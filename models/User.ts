import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    hasCompletedOnboarding: boolean;
    riskScore?: number;
    preferences?: {
        riskTolerance?: 'low' | 'medium' | 'high';
        investmentDuration?: '1 week' | '1 month' | '3 months' | 'long-term';
        budgetRange?: string;
        preferredSectors?: string[];
        marketExperience?: 'beginner' | 'intermediate' | 'expert';
    };
    portfolio?: any[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        hasCompletedOnboarding: { type: Boolean, default: false },
        riskScore: { type: Number, default: 0 },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        preferences: {
            riskTolerance: { type: String, enum: ['low', 'medium', 'high'] },
            investmentDuration: { type: String, enum: ['1 week', '1 month', '3 months', 'long-term'] },
            budgetRange: { type: String },
            preferredSectors: [{ type: String }],
            marketExperience: { type: String, enum: ['beginner', 'intermediate', 'expert'] },
        },
        portfolio: [{
            ticker: String,
            name: String,
            quantity: Number,
            buyPrice: Number,
            addedAt: { type: Date, default: Date.now }
        }], // Can be structured later
    },
    { timestamps: true }
);

// We shouldn't hash the password if it's already hashed, so we do it in a pre-save hook
UserSchema.pre('save', async function () {
    const user = this as any;
    if (!user.isModified('password') || !user.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password || '');
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
