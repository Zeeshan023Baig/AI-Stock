"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2, TrendingUp, TrendingDown, ArrowRight, PieChart } from "lucide-react";

export default function PortfolioPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [liveData, setLiveData] = useState<Record<string, any>>({});

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                // Fetch User's Portfolio
                const res = await fetch("/api/user/portfolio");
                const data = await res.json();
                const holdings = data.portfolio || [];
                setPortfolio(holdings);

                if (holdings.length > 0) {
                    // Fetch live prices for all holdings using our Search API trick or a direct multi-quote API
                    // For MVP, we can fetch individual quotes if few, or a batch API approach
                    const symbols = holdings.map((h: any) => h.ticker).join(",");
                    const quotesRes = await fetch(`/api/data/market`); // our existing market API doesn't support generic batch yet
                    // Wait, let's just make a specific call to our search API or a new batch API? 
                    // Actually, we can just promise.all the specific stock routes for now for real-time prices.
                    const liveResults = await Promise.all(
                        holdings.map(async (h: any) => {
                            const res = await fetch(`/api/data/stock/${h.ticker}`);
                            if (res.ok) {
                                const stockData = await res.json();
                                return { ticker: h.ticker, quote: stockData.quote };
                            }
                            return null;
                        })
                    );

                    const newLiveData: Record<string, any> = {};
                    liveResults.forEach(res => {
                        if (res) newLiveData[res.ticker] = res.quote;
                    });
                    setLiveData(newLiveData);
                }
            } catch (err) {
                console.error("Failed to load portfolio:", err);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchPortfolioData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchPortfolioData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    // Calculate Aggregates
    let totalInvested = 0;
    let currentValue = 0;

    portfolio.forEach((stock) => {
        const invested = stock.quantity * stock.buyPrice;
        const currentPrice = liveData[stock.ticker]?.regularMarketPrice || stock.buyPrice;
        const currentVal = stock.quantity * currentPrice;

        totalInvested += invested;
        currentValue += currentVal;
    });

    const totalPL = currentValue - totalInvested;
    const isPositivePL = totalPL >= 0;
    const plPercentage = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                    Your Intelligent Portfolio
                </h1>
                <p className="text-slate-400 text-sm">Track your simulated AI investments in real-time.</p>
            </div>

            {/* Market Closed Banner */}
            {Object.keys(liveData).length > 0 && !Object.values(liveData).some(q => q.marketState === "REGULAR") && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-amber-500 mb-0.5">Market Currently Closed</h4>
                        <p className="text-xs text-amber-500/80">
                            The Indian Equity Market is closed for the day. Live Profit/Loss tracking matches your closing buy price and will resume updating tomorrow at 09:15 AM IST.
                        </p>
                    </div>
                </div>
            )}

            {portfolio.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 shadow-lg text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                        <PieChart className="w-10 h-10 text-slate-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-200 mb-2">Your portfolio is empty</h2>
                    <p className="text-slate-400 mb-6 max-w-md">
                        Start building your simulated wealth. Use the global search bar above to find stocks and add them to your portfolio!
                    </p>
                </div>
            ) : (
                <>
                    {/* Top Aggregates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                            <p className="text-sm font-medium text-slate-400 mb-1">Total Invested</p>
                            <h3 className="text-3xl font-bold text-slate-200">
                                {totalInvested.toLocaleString('en-US', { style: 'currency', currency: liveData[portfolio[0]?.ticker]?.currency || 'INR' })}
                            </h3>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                            <p className="text-sm font-medium text-slate-400 mb-1">Current Value</p>
                            <h3 className="text-3xl font-bold text-slate-200">
                                {currentValue.toLocaleString('en-US', { style: 'currency', currency: liveData[portfolio[0]?.ticker]?.currency || 'INR' })}
                            </h3>
                        </div>

                        <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 p-4 opacity-10 ${isPositivePL ? "text-emerald-500" : "text-red-500"}`}>
                                {isPositivePL ? <TrendingUp className="w-16 h-16" /> : <TrendingDown className="w-16 h-16" />}
                            </div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Total Profit / Loss</p>
                            <h3 className={`text-3xl font-bold ${isPositivePL ? "text-emerald-400" : "text-red-400"}`}>
                                {isPositivePL ? "+" : ""}{totalPL.toLocaleString('en-US', { style: 'currency', currency: liveData[portfolio[0]?.ticker]?.currency || 'INR' })}
                            </h3>
                            <div className={`inline-flex items-center gap-1 mt-2 text-sm font-bold ${isPositivePL ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"} px-2 py-1 rounded`}>
                                {isPositivePL ? "▲" : "▼"} {Math.abs(plPercentage).toFixed(2)}%
                            </div>
                        </div>
                    </div>

                    {/* Holdings List */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-lg font-bold">Individual Holdings</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-700/50">
                                        <th className="p-4 font-medium">Asset</th>
                                        <th className="p-4 font-medium text-right">Shares</th>
                                        <th className="p-4 font-medium text-right">Avg Buy Price</th>
                                        <th className="p-4 font-medium text-right">Current Price</th>
                                        <th className="p-4 font-medium text-right">Total Value</th>
                                        <th className="p-4 font-medium text-right">Profit/Loss</th>
                                        <th className="p-4 font-medium text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {portfolio.map((stock) => {
                                        const currentPrice = liveData[stock.ticker]?.regularMarketPrice || stock.buyPrice;
                                        const stockValue = stock.quantity * currentPrice;
                                        const stockInvested = stock.quantity * stock.buyPrice;
                                        const stockPL = stockValue - stockInvested;
                                        const isProfitable = stockPL >= 0;
                                        const currency = liveData[stock.ticker]?.currency || 'INR';

                                        return (
                                            <tr key={stock._id || stock.ticker} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-200">{stock.ticker}</div>
                                                    <div className="text-xs text-slate-500 max-w-[150px] truncate">{stock.name}</div>
                                                </td>
                                                <td className="p-4 text-right text-slate-300 font-medium">{stock.quantity}</td>
                                                <td className="p-4 text-right text-slate-300">{stock.buyPrice.toFixed(2)}</td>
                                                <td className="p-4 text-right font-bold text-slate-200">
                                                    {currentPrice.toFixed(2)}
                                                </td>
                                                <td className="p-4 text-right font-bold text-slate-200">
                                                    {stockValue.toLocaleString('en-US', { style: 'currency', currency })}
                                                </td>
                                                <td className={`p-4 text-right font-bold ${isProfitable ? "text-emerald-400" : "text-red-400"}`}>
                                                    {isProfitable ? "+" : ""}{stockPL.toLocaleString('en-US', { style: 'currency', currency })}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Link href={`/dashboard/stock/${stock.ticker}`}>
                                                        <button className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg transition-colors inline-flex items-center justify-center">
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
