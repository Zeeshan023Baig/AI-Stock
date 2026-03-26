"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { TrendingUp, Activity, PieChart, ShieldAlert, ArrowUpRight, ArrowDownRight, Zap, Loader2, Globe } from "lucide-react";
import PortfolioChart from "@/components/dashboard/PortfolioChart";

export default function DashboardPage() {
    const { data: session } = useSession();

    const [portfolioTotal, setPortfolioTotal] = useState<number | null>(null);
    const [portfolioChange, setPortfolioChange] = useState<number | null>(null);
    const [niftyPrice, setNiftyPrice] = useState<number | null>(null);
    const [niftyChange, setNiftyChange] = useState<number | null>(null);
    const [alertsTotal, setAlertsTotal] = useState<number | null>(null);
    const [macroData, setMacroData] = useState<any>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch NIFTY 50
                const niftyRes = await fetch("/api/data/stock/%5ENSEI");
                const niftyData = await niftyRes.json();
                if (niftyData.quote) {
                    setNiftyPrice(niftyData.quote.regularMarketPrice);
                    setNiftyChange(niftyData.quote.regularMarketChangePercent);
                }

                // Fetch Global Macros
                try {
                    const [oilRes, inrRes, goldRes] = await Promise.all([
                        fetch("/api/data/stock/CL%3DF"), // WTI Crude
                        fetch("/api/data/stock/INR%3DX"), // USD/INR
                        fetch("/api/data/stock/GC%3DF"),  // Gold
                    ]);

                    const oil = oilRes.ok ? await oilRes.json() : null;
                    const inr = inrRes.ok ? await inrRes.json() : null;
                    const gold = goldRes.ok ? await goldRes.json() : null;

                    setMacroData({
                        oil: oil?.quote || null,
                        inr: inr?.quote || null,
                        gold: gold?.quote || null
                    });
                } catch (e) { console.error("Macro fetch failed"); }

                // Fetch User Alerts
                try {
                    const alertsRes = await fetch("/api/user/alerts");
                    const alertsData = await alertsRes.json();
                    if (alertsData.alerts) {
                        setAlertsTotal(alertsData.alerts.length);
                    } else {
                        setAlertsTotal(0);
                    }
                } catch (e) { setAlertsTotal(0); }

                // Fetch Portfolio Live Value
                const portRes = await fetch("/api/user/portfolio");
                const portData = await portRes.json();

                if (portData.portfolio && portData.portfolio.length > 0) {
                    let totalValue = 0;
                    let totalInvested = 0;

                    const pricePromises = portData.portfolio.map(async (item: any) => {
                        const quoteRes = await fetch(`/api/data/stock/${item.ticker}`);
                        if (!quoteRes.ok) return;
                        const quoteData = await quoteRes.json();
                        const currentPrice = quoteData.quote?.regularMarketPrice || item.buyPrice;
                        totalValue += currentPrice * item.quantity;
                        totalInvested += item.buyPrice * item.quantity;
                    });

                    await Promise.all(pricePromises);
                    setPortfolioTotal(totalValue);
                    setPortfolioChange(totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0);
                } else {
                    setPortfolioTotal(0);
                    setPortfolioChange(0);
                }
            } catch (error) {
                console.error("Dashboard data fetch error", error);
            }
        };

        // Start polling every 30s
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Welcome back, {session?.user?.name?.split(" ")[0] || "Investor"}
                    </h1>
                    {niftyChange === null ? (
                        <p className="text-slate-400 text-sm mt-1 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Synthesizing Market Story...</p>
                    ) : (
                        <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed border-l-2 border-emerald-500 pl-3">
                            The market is currently {niftyChange > 0 ? "showing bullish momentum" : "facing downward pressure"} as the NIFTY 50 {niftyChange > 0 ? "climbs" : "drops"} <strong>{Math.abs(niftyChange).toFixed(2)}%</strong> today.
                            {macroData?.inr?.regularMarketChangePercent > 0 && " The weakening Rupee continues to act as a massive tailwind for IT and Pharma export revenues."}
                            {macroData?.oil?.regularMarketChangePercent > 1 && " Meanwhile, spiking crude oil profiles are threatening gross margins for domestic aviation and FMCG sectors."}
                            {macroData?.gold?.regularMarketChangePercent > 0.5 && " Gold's upward trajectory suggests institutional investors are rotating capital into safe havens."}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        Risk Score: 65 (Medium)
                    </div>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <PieChart className="w-16 h-16 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">Total Portfolio Value</p>

                    {portfolioTotal === null ? (
                        <div className="mt-4 flex items-center gap-2 text-slate-400">
                            <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-sm">Syncing...</span>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold mt-2 text-slate-200">
                                {portfolioTotal === 0 ? "₹0.00" : `₹${portfolioTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                            </h3>
                            {portfolioTotal !== 0 && portfolioChange !== null && (
                                <div className={`flex items-center gap-1 mt-3 text-sm font-medium ${portfolioChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {portfolioChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    <span>{portfolioChange > 0 ? '+' : ''}{portfolioChange.toFixed(2)}%</span>
                                    <span className="text-slate-500 ml-1 font-normal">all time</span>
                                </div>
                            )}
                            {portfolioTotal === 0 && (
                                <div className="mt-3 text-sm text-slate-500">No active holdings</div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity className="w-16 h-16 text-cyan-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">AI Accuracy (30 Days)</p>
                    <h3 className="text-2xl font-bold mt-2 text-slate-200">84.5%</h3>
                    <div className="flex items-center gap-1 mt-3 text-sm font-medium text-emerald-400">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+2.1%</span>
                        <span className="text-slate-500 ml-1 font-normal">vs last month</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-16 h-16 text-amber-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">Active Triggers</p>
                    {alertsTotal === null ? (
                        <div className="mt-4 flex items-center gap-2 text-slate-400">
                            <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-sm">Fetching...</span>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold mt-2 text-slate-200">{alertsTotal} {alertsTotal === 1 ? 'Alert' : 'Alerts'}</h3>
                            <div className="flex items-center gap-1 mt-3 text-sm font-medium text-amber-400">
                                <Link href="/dashboard/alerts" className="hover:text-amber-300 transition-colors flex items-center">
                                    Manage configurations <ArrowUpRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp className="w-16 h-16 text-red-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">NIFTY 50 Trend</p>
                    {niftyPrice === null ? (
                        <div className="mt-4 flex items-center gap-2 text-slate-400">
                            <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-sm">Fetching...</span>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold mt-2 text-slate-200">{niftyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                            <div className={`flex items-center gap-1 mt-3 text-sm font-medium ${niftyChange! >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {niftyChange! >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                <span>{niftyChange! > 0 ? '+' : ''}{niftyChange!.toFixed(2)}%</span>
                                <span className="text-slate-500 ml-1 font-normal">today</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Recommendations */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" /> Top AI Recommendations
                            </h2>
                            <Link href="/dashboard/recommendations" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {/* Mock Row 1 */}
                            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:bg-slate-800/60">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
                                        <h4 className="font-bold text-lg">RELIANCE</h4>
                                        <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded">ANALYZING</span>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-snug max-w-md">
                                        AI engine is crunching live Energy sector momentum. Click to view real-time signal.
                                    </p>
                                </div>
                                <div className="w-full sm:w-auto shrink-0 flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                                                <div className="bg-blue-500 h-full w-[88%] animate-pulse"></div>
                                            </div>
                                            <span className="text-sm font-bold text-blue-400">88%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mock Row 2 */}
                            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:bg-slate-800/60">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
                                        <h4 className="font-bold text-lg">INFY</h4>
                                        <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded">ANALYZING</span>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-snug max-w-md">
                                        Evaluating IT sector support ranges against global tech headwinds.
                                    </p>
                                </div>
                                <div className="w-full sm:w-auto shrink-0 flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                                                <div className="bg-blue-500 h-full w-[72%] animate-pulse"></div>
                                            </div>
                                            <span className="text-sm font-bold text-blue-400">72%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Allocation */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                            <PieChart className="w-5 h-5 text-cyan-500" /> Portfolio Allocation
                        </h2>
                        <PortfolioChart />
                    </div>
                </div>

                {/* Right Sidebar Area */}
                <div className="space-y-6">
                    {/* Live Global Impact Engine */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-indigo-400" /> Global Macro Impacts
                        </h2>

                        {!macroData ? (
                            <div className="text-center py-6 text-slate-500 text-sm flex gap-2 justify-center items-center">
                                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Macro Data...
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Oil impact */}
                                {macroData.oil && (
                                    <div className={`border-l-4 pl-3 ${macroData.oil.regularMarketChangePercent > 0 ? 'border-red-500' : 'border-emerald-500'}`}>
                                        <div className="flex justify-between items-center whitespace-nowrap overflow-hidden text-ellipsis">
                                            <p className="text-sm font-bold flex items-center gap-1">
                                                Crude Oil <span className="text-xs text-slate-400 font-normal ml-1">(${macroData.oil.regularMarketPrice?.toFixed(2)})</span>
                                            </p>
                                            <span className={`text-xs font-bold ${macroData.oil.regularMarketChangePercent > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {macroData.oil.regularMarketChangePercent > 0 ? '▲' : '▼'} {Math.abs(macroData.oil.regularMarketChangePercent).toFixed(2)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            <span className="text-slate-300 font-medium">Impact:</span> {macroData.oil.regularMarketChangePercent > 0 ? 'Airline & Paint stocks face margin pressure' : 'Reduced import bill boosts Aviation/Paints'}
                                        </p>
                                    </div>
                                )}

                                {/* USD/INR impact */}
                                {macroData.inr && (
                                    <div className={`border-l-4 pl-3 ${macroData.inr.regularMarketChangePercent > 0 ? 'border-emerald-500' : 'border-red-500'}`}>
                                        <div className="flex justify-between items-center whitespace-nowrap overflow-hidden text-ellipsis">
                                            <p className="text-sm font-bold flex items-center gap-1">
                                                USD / INR <span className="text-xs text-slate-400 font-normal ml-1">(₹{macroData.inr.regularMarketPrice?.toFixed(2)})</span>
                                            </p>
                                            <span className={`text-xs font-bold ${macroData.inr.regularMarketChangePercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {macroData.inr.regularMarketChangePercent > 0 ? '▲' : '▼'} {Math.abs(macroData.inr.regularMarketChangePercent).toFixed(2)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            <span className="text-slate-300 font-medium">Impact:</span> {macroData.inr.regularMarketChangePercent > 0 ? 'Weaker Rupee strongly benefits IT & Pharma Exports' : 'Stronger Rupee hurts IT sector foreign revenue'}
                                        </p>
                                    </div>
                                )}

                                {/* Gold impact */}
                                {macroData.gold && (
                                    <div className={`border-l-4 pl-3 ${macroData.gold.regularMarketChangePercent > 0 ? 'border-amber-500' : 'border-slate-500'}`}>
                                        <div className="flex justify-between items-center whitespace-nowrap overflow-hidden text-ellipsis">
                                            <p className="text-sm font-bold flex items-center gap-1 text-amber-500">
                                                Gold <span className="text-xs text-slate-400 font-normal ml-1">(${macroData.gold.regularMarketPrice?.toFixed(1)})</span>
                                            </p>
                                            <span className={`text-xs font-bold ${macroData.gold.regularMarketChangePercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {macroData.gold.regularMarketChangePercent > 0 ? '▲' : '▼'} {Math.abs(macroData.gold.regularMarketChangePercent).toFixed(2)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            <span className="text-slate-300 font-medium">Market Sentiment:</span> {macroData.gold.regularMarketChangePercent > 1.0 ? 'Risk-off. Investors fleeing to safety.' : 'Risk-on. Normal equity market behavior.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Active Triggers */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                            Live Triggers
                        </h2>
                        <div className="space-y-3">
                            {alertsTotal === null ? (
                                <div className="text-center py-4 text-slate-500 text-sm flex gap-2 justify-center items-center">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Syndicating Alerts...
                                </div>
                            ) : alertsTotal === 0 ? (
                                <div className="text-center py-6 text-slate-500 text-sm bg-slate-800/20 rounded-lg border border-slate-800 border-dashed">
                                    You have no active market triggers.
                                </div>
                            ) : (
                                /* We need the actual full alerts array from state to render these properly. 
                                   But since we didn't save the full array into a state variable earlier, 
                                   we can prompt the user to go to the alerts page for details, or render a compact overview. */
                                <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg flex flex-col gap-2 items-center text-center">
                                    <Zap className="w-6 h-6 text-amber-500 mb-1" />
                                    <p className="text-sm font-medium text-slate-300">You have {alertsTotal} active configurations tracking live assets.</p>
                                    <Link href="/dashboard/alerts" className="mt-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg hover:bg-amber-500/20 transition-all">
                                        View Trigger Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
