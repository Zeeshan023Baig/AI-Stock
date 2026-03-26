"use client";

import { useState } from "react";
import { Newspaper, TrendingUp, TrendingDown, Globe, Flame, Clock } from "lucide-react";

export default function MarketNewsPage() {
    const [activeTab, setActiveTab] = useState("all");

    const newsItems = [
        {
            id: 1,
            category: "Markets",
            title: "Global Markets Rally as Inflation Cools Down Faster Than Expected",
            excerpt: "Equities surged across the board globally following new data suggesting central banks may begin cutting rates earlier in Q3.",
            source: "Financial Times",
            time: "2 hours ago",
            impact: "Bullish",
            icon: TrendingUp,
        },
        {
            id: 2,
            category: "Tech",
            title: "Major Semiconductor Merger Approved by Regulators",
            excerpt: "The $40B merger will reshape the global chip supply chain, likely boosting capacities for AI hardware manufacturing.",
            source: "Reuters",
            time: "4 hours ago",
            impact: "Bullish",
            icon: TrendingUp,
        },
        {
            id: 3,
            category: "Energy",
            title: "Oil Prices Dip Below $75 Amidst Rising Output Estimates",
            excerpt: "Energy sector stocks took a massive hit today as OPEC+ signaled that it may not extend current production cuts.",
            source: "Bloomberg",
            time: "5 hours ago",
            impact: "Bearish",
            icon: TrendingDown,
        },
        {
            id: 4,
            category: "Economy",
            title: "Job Market Shows Signs of Strain, Unemployment Ticks Up",
            excerpt: "Recent non-farm payrolls dropped by 10% month-over-month, suggesting macroeconomic tightening is finally slowing growth.",
            source: "Wall Street Journal",
            time: "7 hours ago",
            impact: "Bearish",
            icon: TrendingDown,
        },
        {
            id: 5,
            category: "Crypto",
            title: "Bitcoin Surpasses Key Resistance Level Followed by ETF Inflows",
            excerpt: "Institutional buying continues to propel digital assets higher as new regulatory frameworks provide clarity.",
            source: "CoinDesk",
            time: "8 hours ago",
            impact: "Bullish",
            icon: TrendingUp,
        },
        {
            id: 6,
            category: "Markets",
            title: "Asian Markets Mixed Following China Real Estate Default Concerns",
            excerpt: "The Hang Seng dropped 1.2% while the Nikkei gained, reflecting fragmented sentiment in the APAC region.",
            source: "CNBC",
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
                <p className="text-slate-400 text-sm mt-1">Real-time global financial news and macroeconomic impacts.</p>
            </div>

            {/* Breaking News Banner */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-lg">
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shrink-0 animate-pulse">
                    <Flame className="w-3 h-3" /> BREAKING
                </div>
                <p className="text-sm font-medium text-slate-200">
                    Federal Reserve Chairman signals a potential 25 basis point rate cut by September if core inflation remains stable.
                </p>
            </div>

            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
                {['all', 'markets', 'tech', 'energy', 'economy', 'crypto'].map((tab) => (
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
