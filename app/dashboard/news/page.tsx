"use client";

import { useState } from "react";
import { Newspaper, TrendingUp, TrendingDown, Globe, Flame, Clock } from "lucide-react";

export default function MarketNewsPage() {
    const [activeTab, setActiveTab] = useState("all");

    const newsItems = [
        {
            id: 1,
            category: "Markets",
            title: "NIFTY 50 Hits New All-Time High Amidst Strong Domestic Inflows",
            excerpt: "Indian equities surged across the board today following positive Q3 GDP data and steady mutual fund SIP contributions.",
            source: "Mint",
            time: "2 hours ago",
            impact: "Bullish",
            icon: TrendingUp,
        },
        {
            id: 2,
            category: "Tech",
            title: "TCS and Infosys Report Margin Expansion Following Cloud Mega-Deals",
            excerpt: "Top Indian IT majors have signaled a recovery in client spending from North American markets, driving sector indices higher.",
            source: "Economic Times",
            time: "4 hours ago",
            impact: "Bullish",
            icon: TrendingUp,
        },
        {
            id: 3,
            category: "Energy",
            title: "Reliance Industries to Spin Off Green Energy Arm by Next Fiscal",
            excerpt: "Shares of RIL saw high volume trading today after the board officially approved the renewable tech demerger plan.",
            source: "Bloomberg Quint",
            time: "5 hours ago",
            impact: "Bullish",
            icon: TrendingUp,
        },
        {
            id: 4,
            category: "Economy",
            title: "RBI Holds Repo Rate Steady at 6.5%, Maintains 'Withdrawal of Accommodation'",
            excerpt: "The Monetary Policy Committee voted to keep interest rates unchanged, citing resilient growth despite persistent core inflation concerns.",
            source: "Financial Express",
            time: "7 hours ago",
            impact: "Neutral",
            icon: Globe,
        },
        {
            id: 5,
            category: "Auto",
            title: "Tata Motors PV Sales Dip as EV FAME Subsidies End",
            excerpt: "Auto sector stocks faced pressure today as major players reported a Month-over-Month decline in electric vehicle registrations.",
            source: "Moneycontrol",
            time: "8 hours ago",
            impact: "Bearish",
            icon: TrendingDown,
        },
        {
            id: 6,
            category: "Markets",
            title: "FIIs Turn Net Sellers in Cash Market, DIIs Continue to Buy the Dip",
            excerpt: "Foreign investors pulled ₹1,200 crore from the domestic market yesterday, but domestic institutions absorbed the liquidity shock.",
            source: "CNBC TV18",
            time: "10 hours ago",
            impact: "Neutral",
            icon: Globe,
        }
    ];

    const filteredNews = activeTab === "all" ? newsItems : newsItems.filter(n => n.category.toLowerCase() === activeTab);

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center gap-2">
                    <Newspaper className="w-6 h-6 text-blue-500" /> Market News
                </h1>
                <p className="text-slate-400 text-sm mt-1">Real-time domestic market news and macroeconomic impacts.</p>
            </div>

            {/* Breaking News Banner */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-lg">
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shrink-0 animate-pulse">
                    <Flame className="w-3 h-3" /> BREAKING
                </div>
                <p className="text-sm font-medium text-slate-200">
                    SEBI introduces new T+0 same-day settlement rules for select large-cap stocks starting next week.
                </p>
            </div>

            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
                {['all', 'markets', 'tech', 'energy', 'economy', 'auto'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* News Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((news) => {
                    const isBullish = news.impact === "Bullish";
                    const isBearish = news.impact === "Bearish";

                    return (
                        <div key={news.id} className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden group hover:border-slate-700 transition-all flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded">
                                        {news.category}
                                    </span>
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${isBullish ? 'bg-emerald-500/10 text-emerald-400' :
                                            isBearish ? 'bg-red-500/10 text-red-400' :
                                                'bg-slate-800 text-slate-400'
                                        }`}>
                                        <news.icon className="w-3 h-3" /> {news.impact}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                                    {news.title}
                                </h3>
                                <p className="text-sm text-slate-400 line-clamp-3">
                                    {news.excerpt}
                                </p>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-800/50 bg-slate-900/50 flex justify-between items-center text-xs text-slate-500">
                                <span className="font-medium">{news.source}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {news.time}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
