"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, ArrowUpRight, ArrowDownRight, Activity, Plus, X, Globe, Zap, Newspaper } from "lucide-react";

export default function StockDetailPage() {
    const params = useParams();
    const ticker = params.ticker as string;
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shares, setShares] = useState(1);
    const [addingError, setAddingError] = useState("");
    const [addingLoading, setAddingLoading] = useState(false);

    useEffect(() => {
        if (!ticker) return;
        const fetchStock = async () => {
            try {
                const res = await fetch(`/api/data/stock/${ticker}`);
                const result = await res.json();
                if (res.ok) {
                    setData(result);
                } else {
                    console.error("Failed to load stock data");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStock();
        const interval = setInterval(fetchStock, 15000);
        return () => clearInterval(interval);
    }, [ticker]);

    const handleAddToPortfolio = async () => {
        setAddingLoading(true);
        setAddingError("");
        try {
            const res = await fetch("/api/user/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticker: data.quote.symbol,
                    name: data.quote.shortName || data.quote.longName || data.quote.symbol,
                    quantity: shares,
                    buyPrice: data.quote.regularMarketPrice,
                }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                router.push("/dashboard/portfolio");
            } else {
                const errData = await res.json();
                setAddingError(errData.message || "Failed to add to portfolio");
            }
        } catch (e) {
            setAddingError("Network error. Try again.");
        } finally {
            setAddingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (!data || !data.quote) {
        return (
            <div className="text-center py-20 text-slate-400">
                <h2 className="text-2xl font-bold mb-4">Stock Not Found</h2>
                <p>Could not load data for {ticker}. It may be delisted or invalid.</p>
            </div>
        );
    }

    const { quote, historicalData, news } = data;
    const isPositive = (quote.regularMarketChangePercent || 0) >= 0;

    // Mock AI Logic based on simple metrics
    const mockConfidence = isPositive ? 75 + Math.random() * 20 : 50 + Math.random() * 30;
    const mockDirection = isPositive ? "Bullish" : "Bearish";
    const mockRecommendation = mockConfidence > 80 ? "BUY" : (mockConfidence < 60 ? "AVOID" : "HOLD");

    const formatNumber = (num: number) => {
        if (!num) return "N/A";
        if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
        if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
        if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
        return num.toLocaleString();
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-100">{quote.symbol}</h1>
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full border border-slate-700">
                            {quote.fullExchangeName || "Exchange"}
                        </span>
                    </div>
                    <p className="text-slate-400 text-lg mb-4">{quote.longName || quote.shortName}</p>

                    <div className="flex items-baseline gap-4">
                        <h2 className="text-4xl font-black text-slate-100">
                            {quote.regularMarketPrice?.toFixed(2)} {quote.currency || "INR"}
                        </h2>
                        <div className={`flex items-center text-lg font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                            {isPositive ? <ArrowUpRight className="w-6 h-6 mr-1" /> : <ArrowDownRight className="w-6 h-6 mr-1" />}
                            <span>{Math.abs(quote.regularMarketChangePercent || 0).toFixed(2)}%</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                        Market is {quote.marketState === "REGULAR" ? <span className="text-emerald-500 font-bold">Open</span> : <span className="text-amber-500 font-bold">Closed</span>}
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add to Portfolio
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Chart & Key Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Interactive Chart */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-cyan-500" /> Price History (90 Days)
                        </h3>
                        <div className="h-72 w-full">
                            {historicalData && historicalData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={historicalData}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" stroke="#475569" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                        <YAxis stroke="#475569" fontSize={12} domain={['auto', 'auto']} tickFormatter={(val) => val.toFixed(0)} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f1f5f9' }}
                                            itemStyle={{ color: isPositive ? '#34d399' : '#f87171' }}
                                        />
                                        <Area type="monotone" dataKey="price" stroke={isPositive ? "#10b981" : "#ef4444"} strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500 italic">Chart data not available</div>
                            )}
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" /> Key Financials
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <p className="text-xs text-slate-400 mb-1">Market Cap</p>
                                <p className="font-bold text-slate-200">{formatNumber(quote.marketCap)}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <p className="text-xs text-slate-400 mb-1">P/E Ratio (TTM)</p>
                                <p className="font-bold text-slate-200">{quote.trailingPE?.toFixed(2) || "N/A"}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <p className="text-xs text-slate-400 mb-1">Volume</p>
                                <p className="font-bold text-slate-200">{formatNumber(quote.regularMarketVolume)}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <p className="text-xs text-slate-400 mb-1">52W High / Low</p>
                                <p className="font-bold text-slate-200 text-sm">{quote.fiftyTwoWeekHigh?.toFixed(1)} / {quote.fiftyTwoWeekLow?.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI & News */}
                <div className="space-y-6">
                    {/* AI Prediction */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Zap className="w-32 h-32" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                            <Zap className="w-5 h-5 text-amber-500" /> AI Forecast
                        </h3>

                        <div className="relative z-10">
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-slate-400 text-sm">30-Day Trend</span>
                                    <span className={`text-xl font-bold ${mockDirection === 'Bullish' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {mockDirection}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${mockDirection === 'Bullish' ? 'bg-emerald-500' : 'bg-red-500'}`}
                                        style={{ width: `${mockConfidence}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-slate-500">
                                    <span>Confidence</span>
                                    <span>{mockConfidence.toFixed(1)}%</span>
                                </div>
                            </div>

                            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-300">Target Action</span>
                                    <span className={`px-3 py-1 text-xs font-bold rounded ${mockRecommendation === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' :
                                        mockRecommendation === 'AVOID' ? 'bg-red-500/20 text-red-400' :
                                            'bg-amber-500/20 text-amber-400'
                                        }`}>
                                        {mockRecommendation}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 italic">
                                    "Based on recent volume spikes and momentum, AI suggests this stock is trending {mockDirection.toLowerCase()} due to broader sector movement."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Related News */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg max-h-[400px] overflow-y-auto custom-scrollbar">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 sticky top-0 bg-slate-900 pb-2 z-10">
                            <Newspaper className="w-5 h-5 text-slate-400" /> Latest News
                        </h3>
                        <div className="space-y-4">
                            {news && news.length > 0 ? (
                                news.map((item: any, i: number) => (
                                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                                        <div className="border-l-2 border-slate-700 pl-3 group-hover:border-emerald-500 transition-colors">
                                            <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 line-clamp-2 transition-colors">
                                                {item.title}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-slate-500">{item.publisher}</span>
                                                <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                                                    {new Date(item.providerPublishTime * 1000).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">No recent news found for this ticker.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add to Portfolio Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-100">Add to Portfolio</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 text-slate-200">
                            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <div>
                                    <p className="font-bold text-lg">{quote.symbol}</p>
                                    <p className="text-sm text-slate-400">{quote.shortName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{quote.regularMarketPrice?.toFixed(2)} {quote.currency}</p>
                                    <p className="text-xs text-slate-500">Current Price</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Number of Shares</label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="any"
                                    value={shares}
                                    onChange={(e) => setShares(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg font-bold"
                                />
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Total Estimated Cost:</span>
                                <span className="font-bold text-emerald-400 text-lg">
                                    {((quote.regularMarketPrice || 0) * shares).toFixed(2)} {quote.currency}
                                </span>
                            </div>

                            {addingError && <p className="text-red-400 text-sm text-center">{addingError}</p>}
                        </div>
                        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                            <button
                                onClick={handleAddToPortfolio}
                                disabled={addingLoading || shares <= 0}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-bold transition-all flex justify-center items-center"
                            >
                                {addingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Investment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
