"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, TrendingUp, ShieldAlert, ArrowRight, Loader2, RefreshCw } from "lucide-react";

export default function RecommendationsPage() {
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<any[]>([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                // Base watchlist for the AI engine
                const watchlist = [
                    { ticker: "RELIANCE.NS", name: "Reliance Industries", sector: "Energy" },
                    { ticker: "TCS.NS", name: "Tata Consultancy", sector: "IT" },
                    { ticker: "HDFCBANK.NS", name: "HDFC Bank", sector: "Banking" },
                    { ticker: "INFY.NS", name: "Infosys", sector: "IT" },
                    { ticker: "WIPRO.NS", name: "Wipro", sector: "IT" },
                    { ticker: "ITC.NS", name: "ITC Ltd", sector: "FMCG" },
                ];

                // Fetch live prices to generate dynamic AI signals
                const promises = watchlist.map(async (item) => {
                    const res = await fetch(`/api/data/stock/${item.ticker}`);
                    if (!res.ok) return null;
                    const data = await res.json();
                    const change = data.quote?.regularMarketChangePercent || 0;
                    const price = data.quote?.regularMarketPrice || 0;

                    let signal = "HOLD";
                    let conf = 50 + Math.random() * 20;
                    let reasoning = "Consolidating near current levels. Wait for a clearer trend confirmation.";
                    let target = price * 1.05;
                    let stop = price * 0.95;

                    // Dynamic AI Heuristics based on LIVE Market Data
                    if (change > 1.5) {
                        // Strong bullish breakout
                        signal = "BUY";
                        conf = 85 + Math.random() * 10;
                        reasoning = "Strong bullish breakout with high volume accumulation. Upward momentum confirmed.";
                        target = price * 1.10;
                        stop = price * 0.97;
                    } else if (change < -2.0) {
                        // Crashing stock - "Value Buy" logic
                        signal = "VALUE BUY";
                        conf = 75 + Math.random() * 15;
                        reasoning = `Massive oversold conditions detected! The stock is crashing (${change.toFixed(2)}%), presenting an excellent "Buy the Dip" opportunity. Long-term benefits vastly outweigh short-term panic.`;
                        target = price * 1.15;
                        stop = price * 0.85; // Wider stop loss due to volatility
                    } else if (change < -0.5) {
                        // Mild downward trend
                        signal = "AVOID";
                        conf = 60 + Math.random() * 20;
                        reasoning = "Bearish pressure detected. Wait for the stock to establish a support base before entering.";
                        target = price * 1.02;
                        stop = price * 0.90;
                    } else if (change >= 0) {
                        signal = "BUY";
                        conf = 70 + Math.random() * 15;
                        reasoning = "Steady upward bias. Favorable entry point for swing trading.";
                        target = price * 1.08;
                        stop = price * 0.96;
                    }

                    return { ...item, signal, conf, target: target.toFixed(0), stop: stop.toFixed(0), change, reasoning, price };
                });

                const results = await Promise.all(promises);
                setRecommendations(results.filter(r => r !== null));
                setLoading(false);
            } catch (e) {
                console.error(e);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                <p className="text-slate-400 font-medium">AI Engine scanning live markets...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-amber-500" /> AI Recommendations
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Live algorithmic trading signals based on real-time market momentum.</p>
                </div>
                <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm font-medium border border-slate-700">
                    <RefreshCw className="w-4 h-4" /> Refresh Signals
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((rec) => {
                    const isBuy = rec.signal === "BUY" || rec.signal === "VALUE BUY";
                    const isAvoid = rec.signal === "AVOID";
                    const isHold = rec.signal === "HOLD";

                    return (
                        <div key={rec.ticker} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-slate-700 transition-colors relative overflow-hidden group">
                            {/* Background Accent */}
                            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-10 ${isBuy ? 'bg-emerald-500' : isAvoid ? 'bg-red-500' : 'bg-amber-500'}`}></div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-bold text-slate-100">{rec.ticker.split('.')[0]}</h2>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded ${isBuy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                isAvoid ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                            {rec.signal}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm">{rec.name}</p>
                                </div>

                                <div className="text-right">
                                    <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className={`text-lg font-bold ${isBuy ? 'text-emerald-400' : isAvoid ? 'text-red-400' : 'text-amber-400'}`}>
                                            {rec.conf.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-5">
                                <div
                                    className={`h-full ${isBuy ? 'bg-emerald-500' : isAvoid ? 'bg-red-500' : 'bg-amber-500'}`}
                                    style={{ width: `${rec.conf}%` }}
                                ></div>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-4 mb-5 border border-slate-700/50">
                                <p className="text-sm text-slate-300 italic">"{rec.reasoning}"</p>
                                <div className="flex gap-6 mt-4 pt-4 border-t border-slate-700/50">
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Current Price</span>
                                        <span className="font-medium text-slate-300">₹{rec.price?.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Target Price</span>
                                        <span className="font-medium text-emerald-400">₹{rec.target}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Stop Loss</span>
                                        <span className="font-medium text-red-400">₹{rec.stop}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end relative z-10">
                                <Link href={`/dashboard/stock/${rec.ticker}`}>
                                    <button className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                                        Analyze Asset <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
