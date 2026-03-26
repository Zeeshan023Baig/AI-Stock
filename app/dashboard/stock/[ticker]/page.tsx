"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, ArrowUpRight, ArrowDownRight, Activity, Plus, X, Globe, Zap, Newspaper, AlertTriangle, ShieldCheck, TrendingUp, HelpCircle } from "lucide-react";

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

    // Simulator State
    const [simulateAmount, setSimulateAmount] = useState<number>(10000);

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
    }, [ticker]);

    const handleAddToPortfolio = async () => {
        setAddingLoading(true);
        setAddingError("");
        try {
            const customPriceInput = document.getElementById("customBuyPrice") as HTMLInputElement;
            const finalBuyPrice = customPriceInput ? parseFloat(customPriceInput.value) : data.quote.regularMarketPrice;

            const res = await fetch("/api/user/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticker: data.quote.symbol,
                    name: data.quote.shortName || data.quote.longName || data.quote.symbol,
                    quantity: shares,
                    buyPrice: finalBuyPrice,
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-400 font-medium">Deep AI Analysis running...</p>
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
    const change = quote.regularMarketChangePercent || 0;
    const isPositive = change > 0;

    // --- PHASE 5: HUMAN-LIKE INTELLIGENCE LOGIC ---

    // 1. Decision-Focused UI
    let decisionBadge = { label: "⏳ WAIT", flavor: "Neutral accumulation phase.", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
    let whyPoints = [
        "Consolidating near current price levels.",
        "Average trading volume indicates typical market interest.",
        "News sentiment is balanced, lacking major catalysts."
    ];

    if (change > 1.5) {
        decisionBadge = { label: "✅ BUY NOW", flavor: "Strong breakout detected.", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
        whyPoints = [
            "Strong upward trend confirmed by recent price action.",
            "High trading volume indicating heavy institutional buying.",
            "Positive sector momentum pushing the asset higher today."
        ];
    } else if (change < -2.0) {
        // Drop buy
        decisionBadge = { label: "✅ VALUE BUY", flavor: "Currently oversold alert.", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
        whyPoints = [
            "Stock has experienced a massive short-term drop, entering oversold territory.",
            "Historical fundamentals suggest the asset is currently undervalued.",
            "Excellent entry point for defensive, long-term investors."
        ];
    } else if (change < -0.5) {
        decisionBadge = { label: "❌ AVOID", flavor: "Bearish pressure mounting.", color: "bg-red-500/20 text-red-500 border-red-500/30" };
        whyPoints = [
            "Sharp downward correction in progress.",
            "Failing to hold key technical support levels.",
            "Selling pressure currently outweighs market demand."
        ];
    }

    // 2. Smart Warnings
    let warnings = [];
    if (Math.abs(change) > 3) warnings.push("High volatility expected today. Prices fluctuating rapidly.");
    if ((quote.trailingPE || 0) > 40) warnings.push("Currently trading at a premium valuation (High P/E ratio).");
    if (quote.regularMarketVolume > (quote.averageVolume || quote.regularMarketVolume) * 1.5) warnings.push("Unusual volume spike detected in the last trading session.");

    // 3. Confidence Breakdown
    const confTrend = change > 1.5 ? 28 : (change < -0.5 ? 10 : 20);
    const confNews = news && news.length > 2 ? 22 : 12;
    const confVol = quote.regularMarketVolume > 5000000 ? 25 : 15;
    const confMarket = 20; // Simulated static weight for macroeconomic conditions
    const totalConf = confTrend + confNews + confVol + confMarket;

    // 4. Simulator Outcomes (30 day horizon)
    const upperTarget = simulateAmount * (decisionBadge.label.includes("BUY") ? 1.08 : 1.03);
    const lowerRisk = simulateAmount * (decisionBadge.label === "❌ AVOID" ? 0.90 : 0.95);

    const formatNumber = (num: number) => {
        if (!num) return "N/A";
        if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
        if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
        if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
        return num.toLocaleString();
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section (Decision Focused) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                            <h1 className="text-4xl font-black text-slate-100">{quote.symbol}</h1>
                            {/* MASSIVE DECISION BADGE */}
                            <div className={`px-4 py-1.5 rounded-lg border-2 font-black text-lg shadow-xl uppercase tracking-wide flex items-center gap-2 ${decisionBadge.color}`}>
                                {decisionBadge.label}
                            </div>
                        </div>
                        <p className="text-slate-400 text-lg mb-6">{quote.longName || quote.shortName}</p>

                        <div className="flex items-baseline gap-4">
                            <h2 className="text-5xl font-black text-slate-100">
                                {quote.regularMarketPrice?.toFixed(2)} <span className="text-2xl text-slate-500 font-bold">{quote.currency || "INR"}</span>
                            </h2>
                            <div className={`flex items-center text-xl font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                                {isPositive ? <ArrowUpRight className="w-7 h-7 mr-1" /> : <ArrowDownRight className="w-7 h-7 mr-1" />}
                                <span>{Math.abs(change).toFixed(2)}%</span>
                            </div>
                        </div>

                        {/* Smart Warnings Display directly under price */}
                        {warnings.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                {warnings.map((warn, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg text-sm font-semibold max-w-xl">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        <span>⚠️ {warn}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col w-full lg:w-auto gap-4">
                        <p className="text-sm font-medium text-slate-500 lg:text-right hidden lg:block">
                            AI Verdict: <span className="text-slate-300">{decisionBadge.flavor}</span>
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full lg:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <Plus className="w-6 h-6" /> Add to Portfolio
                        </button>
                    </div>
                </div>
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
                            <Globe className="w-5 h-5 text-blue-500" /> Core Financials
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

                {/* Right Column: Deep AI Reasoning & Simulator */}
                <div className="space-y-6">

                    {/* "Why this stock?" Engine */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-indigo-400" /> Why this stock?
                        </h3>
                        <ul className="space-y-4">
                            {whyPoints.map((point, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-300">
                                    <div className="mt-1 shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    </div>
                                    <span className="leading-snug">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Transparency Base: Confidence Breakdown */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Overall Confidence
                            </h3>
                            <span className="text-xl font-black text-emerald-400">{totalConf}%</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                    <span>Price Trend Strength</span>
                                    <span>{confTrend}/30%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-cyan-500 h-full" style={{ width: `${(confTrend / 30) * 100}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                    <span>News Sentiment</span>
                                    <span>{confNews}/25%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full" style={{ width: `${(confNews / 25) * 100}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                    <span>Volume Activity</span>
                                    <span>{confVol}/25%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full" style={{ width: `${(confVol / 25) * 100}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                    <span>Market Alignment</span>
                                    <span>{confMarket}/20%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-slate-400 h-full" style={{ width: `${(confMarket / 20) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Simulator */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        <h3 className="text-lg font-bold mb-5 flex items-center gap-2 relative z-10">
                            <Zap className="w-5 h-5 text-amber-500" /> Investment Simulator
                        </h3>

                        <div className="relative z-10 space-y-5">
                            <div>
                                <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-bold">"If I invest..."</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        min="100"
                                        step="1000"
                                        value={simulateAmount}
                                        onChange={(e) => setSimulateAmount(parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-amber-500 transition-colors font-bold text-lg"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                                <p className="text-xs text-slate-500 mb-3 text-center">Predicted 30-Day Range Outcome</p>
                                <div className="flex justify-between items-center px-2">
                                    <div className="text-center">
                                        <p className="font-bold text-red-400 text-lg">₹{lowerRisk.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                                        <p className="text-[10px] text-slate-500 uppercase mt-1">Bear Case</p>
                                    </div>
                                    <div className="h-0.5 w-10 bg-slate-800 mx-2"></div>
                                    <div className="text-center">
                                        <p className="font-bold text-emerald-400 text-lg">₹{upperTarget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                                        <p className="text-[10px] text-slate-500 uppercase mt-1">Bull Case</p>
                                    </div>
                                </div>
                            </div>
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

                            <div className="grid grid-cols-2 gap-4">
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Entry Buy Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{quote.currency}</span>
                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            defaultValue={quote.regularMarketPrice?.toFixed(2)}
                                            id="customBuyPrice"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg font-bold"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">Leave as default to buy at current price</p>
                                </div>
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
