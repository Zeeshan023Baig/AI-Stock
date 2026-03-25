import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET() {
    try {
        // Fetch some global market indicators
        // ^NSEI is NIFTY 50, ^BSESN is SENSEX, ^DJI is Dow Jones
        const symbols = ['^NSEI', '^BSESN', 'RELIANCE.NS', 'TCS.NS', 'INFY.NS'];

        // We suppress errors for missing historical data if some symbol fails
        const quotes = await Promise.all(
            symbols.map(async (sym) => {
                try {
                    return await yahooFinance.quote(sym);
                } catch {
                    return null;
                }
            })
        );

        const validQuotes = quotes.filter(Boolean) as any[];

        // Mock AI analysis based on the live data
        // Here we use a generic rule-based logic to simulate AI predictions
        const predictions = validQuotes.map(quote => {
            const isPositive = (quote?.regularMarketChangePercent || 0) > 0;
            const confidence = isPositive ? 75 + Math.random() * 20 : 60 + Math.random() * 30;
            const recommendation = confidence > 80 ? 'BUY' : (confidence < 65 ? 'AVOID' : 'HOLD');

            return {
                symbol: quote?.symbol,
                name: quote?.shortName || quote?.longName,
                price: quote?.regularMarketPrice,
                changePercent: quote?.regularMarketChangePercent,
                volume: quote?.regularMarketVolume,
                aiPrediction: {
                    direction: isPositive ? 'Bullish' : 'Bearish',
                    confidence: parseFloat(confidence.toFixed(1)),
                    recommendation,
                    targetPrice: (quote?.regularMarketPrice || 0) * (isPositive ? 1.05 : 0.95), // mock 5% target
                    stopLoss: (quote?.regularMarketPrice || 0) * (isPositive ? 0.98 : 1.02), // mock 2% stop-loss
                }
            };
        });

        return NextResponse.json({
            success: true,
            globalTrend: validQuotes.find(q => q?.symbol === '^NSEI')?.regularMarketChangePercent || 0,
            timestamp: new Date().toISOString(),
            predictions
        }, { status: 200 });

    } catch (error: any) {
        console.error('Market data API error:', error);
        return NextResponse.json({ message: 'Failed to fetch market data' }, { status: 500 });
    }
}
