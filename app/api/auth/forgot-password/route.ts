import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) {
            // Don't leak whether user exists or not
            return NextResponse.json({ message: 'If an account with that email exists, we have sent a password reset link.' }, { status: 200 });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetTokenHash}`;

        // In a real app, send an email here using nodemailer, resend, sendgrid, etc.
        console.log('\n\n=== PASSWORD RESET LINK ===');
        console.log(`Reset link for ${email}: \n${resetUrl}`);
        console.log('===========================\n\n');

        return NextResponse.json({
            message: 'If an account with that email exists, we have sent a password reset link.',
            // Only included for dev purposes to speed up testing
            devResetLink: process.env.NODE_ENV === 'development' ? resetUrl : undefined
        }, { status: 200 });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
