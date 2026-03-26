"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, TrendingUp, ShieldAlert, ArrowRight, Loader2, RefreshCw } from "lucide-react";

export default function RecommendationsPage() {
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<any[]>([]);

    useEffect(() => {
        // In a real app, this would fetch from a specialized backend endpoint
        // For now, we simulate AI fetching top trends across the market
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                // We'll mock 6 high-confidence recommendations
                const mockData = [
                    { ticker: "RELIANCE.NS", name: "Reliance Industries", signal: "BUY", conf: 88, target: 3150, stop: 2850, sector: "Energy", reasoning: "Energy sector breakout expected. High volume accumulation observed over the past 3 days." },
                    { ticker: "TCS.NS", name: "Tata Consultancy", signal: "BUY", conf: 82, target: 4100, stop: 3850, sector: "IT", reasoning: "Strong quarterly guidance and favorable currency tailwinds." },
                    { ticker: "HDFCBANK.NS", name: "HDFC Bank", signal: "HOLD", conf: 65, target: 1550, stop: 1350, sector: "Banking", reasoning: "Consolidating near support levels. Awaiting clearer credit growth metrics." },
                    { ticker: "INFY.NS", name: "Infosys", signal: "HOLD", conf: 72, target: 1650, stop: 1450, sector: "IT", reasoning: "IT sector neutral trend. Support holding firm at current range." },
                    { ticker: "WIPRO.NS", name: "Wipro", signal: "AVOID", conf: 45, target: 400, stop: 480, sector: "IT", reasoning: "Lagging peers in margin expansion. Downward pressure continues." },
                    { ticker: "ITC.NS", name: "ITC Ltd", signal: "BUY", conf: 91, target: 480, stop: 410, sector: "FMCG", reasoning: "Defensive stock with high dividend yield. FMCG volumes picking up." },
                ];

                setTimeout(() => {
                    setRecommendations(mockData);
                    setLoading(false);
                }, 1000);
            } catch (e) {
                console.error(e);
            }
        };
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
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
                    <p className="text-slate-400 text-sm mt-1">Live algorithmic trading signals based on technical and fundamental data.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm font-medium border border-slate-700">
                    <RefreshCw className="w-4 h-4" /> Refresh Signals
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((rec) => {
                    const isBuy = rec.signal === "BUY";
                    const isHold = rec.signal === "HOLD";
                    return (
                        <div key={rec.ticker} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-slate-700 transition-colors relative overflow-hidden group">
                            {/* Background Accent */}
                            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-10 ${isBuy ? 'bg-emerald-500' : isHold ? 'bg-amber-500' : 'bg-red-500'}`}></div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-bold text-slate-100">{rec.ticker.split('.')[0]}</h2>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded ${isBuy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                isHold ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {rec.signal}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm">{rec.name}</p>
                                </div>

                                <div className="text-right">
                                    <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className={`text-lg font-bold ${isBuy ? 'text-emerald-400' : isHold ? 'text-amber-400' : 'text-red-400'}`}>
                                            {rec.conf}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-5">
                                <div
                                    className={`h-full ${isBuy ? 'bg-emerald-500' : isHold ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${rec.conf}%` }}
                                ></div>
                            </div>

                            <div className="bg-slate-800/50 rounded-lg p-4 mb-5 border border-slate-700/50">
                                <p className="text-sm text-slate-300 italic">"{rec.reasoning}"</p>
                                <div className="flex gap-6 mt-3 mt-4 pt-4 border-t border-slate-700/50">
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Target Price</span>
                                        <span className="font-medium text-emerald-400">₹{rec.target}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Stop Loss</span>
                                        <span className="font-medium text-red-400">₹{rec.stop}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-1">Sector</span>
                                        <span className="font-medium text-slate-300">{rec.sector}</span>
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
