import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ results: [] }, { status: 200 });
        }

        // Call Yahoo Finance search
        const searchResult: any = await yahooFinance.search(query, {
            quotesCount: 5,
            newsCount: 0,
        });

        const formattedResults = searchResult.quotes.map((quote: any) => ({
            symbol: quote.symbol,
            shortname: quote.shortname || quote.longname || quote.symbol,
            exchDisp: quote.exchDisp,
            typeDisp: quote.typeDisp,
        }));

        return NextResponse.json({ results: formattedResults }, { status: 200 });
    } catch (error: any) {
        console.error('Search API error:', error);
        return NextResponse.json({ message: 'Failed to search stocks' }, { status: 500 });
    }
}
