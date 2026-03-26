export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { ticker, name, quantity, buyPrice } = await req.json();

        if (!ticker || !quantity || quantity <= 0) {
            return NextResponse.json({ message: 'Invalid stock data' }, { status: 400 });
        }

        await connectMongo();

        // Add logic to either push new or update existing ticker
        const user = await User.findById(session.user.id);
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        // Check if stock already exists in portfolio to average it down or up
        const existingStock = user.portfolio.find((s: any) => s.ticker === ticker);

        if (existingStock) {
            // Calculate new weighted buy price
            const totalCost = (existingStock.quantity * existingStock.buyPrice) + (quantity * buyPrice);
            const newQuantity = existingStock.quantity + quantity;
            existingStock.quantity = newQuantity;
            existingStock.buyPrice = totalCost / newQuantity;
            existingStock.addedAt = new Date();
        } else {
            user.portfolio.push({
                ticker,
                name,
                quantity,
                buyPrice,
                addedAt: new Date(),
            });
        }

        await user.save();

        return NextResponse.json({ success: true, portfolio: user.portfolio }, { status: 200 });

    } catch (error: any) {
        console.error('Portfolio API error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectMongo();
        const user = await User.findById(session.user.id).select('portfolio').lean();

        return NextResponse.json({ portfolio: user?.portfolio || [] }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch portfolio' }, { status: 500 });
    }
}
