import { NextResponse } from 'next/server';
import yahooFinance from '@/lib/yahooFinance';

export async function GET(req: Request, { params }: { params: any }) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const ticker = resolvedParams.ticker;

        const fetchQuote = async () => { try { return await yahooFinance.quote(ticker); } catch { return null; } };
        const fetchChart = async () => { try { return await yahooFinance.chart(ticker, { period1: '2023-01-01', interval: '1d' }); } catch { return null; } };
        const fetchNews = async () => { try { return await yahooFinance.search(ticker, { quotesCount: 0, newsCount: 5 }); } catch { return null; } };

        // Fetch quote, historical data, and news concurrently
        const [quote, chart, news] = await Promise.all([fetchQuote(), fetchChart(), fetchNews()]);

        if (!quote) {
            return NextResponse.json({ message: 'Stock not found' }, { status: 404 });
        }

        // Process chart data for Recharts (last 90 days)
        const historicalData = ((chart as any)?.quotes || []).slice(-90).map((q: any) => ({
            date: q.date.toISOString().split('T')[0],
            price: q.close,
        })).filter((q: any) => q.price !== null);

        return NextResponse.json({
            quote,
            historicalData,
            news: (news as any)?.news || [],
        });
    } catch (error) {
        console.error('Stock detail API error:', error);
        return NextResponse.json({ message: 'Failed to fetch stock details' }, { status: 500 });
    }
}
