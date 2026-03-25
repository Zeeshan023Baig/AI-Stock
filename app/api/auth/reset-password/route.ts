import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
        }

        await dbConnect();

        // Verify token exists and is not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ message: 'Password reset token is invalid or has expired.' }, { status: 400 });
        }

        // Hash the new password and save it
        user.password = password; // The pre-save hook will hash it
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return NextResponse.json({ message: 'Password has been safely reset.' }, { status: 200 });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
