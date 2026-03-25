import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { riskTolerance, investmentDuration, budgetRange, preferredSectors, marketExperience } = data;

        // Basic calculation for risk score (0-100)
        let baseScore = 50;

        // Risk Tolerance weighting
        if (riskTolerance === 'high') baseScore += 20;
        if (riskTolerance === 'low') baseScore -= 20;

        // Experience weighting
        if (marketExperience === 'expert') baseScore += 10;
        if (marketExperience === 'beginner') baseScore -= 10;

        // Duration weighting
        if (investmentDuration === '1 week') baseScore += 10; // short term = higher risk typically
        if (investmentDuration === 'long-term') baseScore -= 10;

        // Ensure it stays between 0 and 100
        const finalRiskScore = Math.max(0, Math.min(100, baseScore));

        await dbConnect();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        user.preferences = {
            riskTolerance,
            investmentDuration,
            budgetRange,
            preferredSectors,
            marketExperience,
        };
        user.riskScore = finalRiskScore;
        user.hasCompletedOnboarding = true;

        await user.save();

        return NextResponse.json({
            message: 'Onboarding complete',
            riskScore: finalRiskScore
        }, { status: 200 });
    } catch (error: any) {
        console.error('Onboarding error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
