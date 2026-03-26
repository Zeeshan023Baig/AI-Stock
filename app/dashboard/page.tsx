"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { TrendingUp, Activity, PieChart, ShieldAlert, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import PortfolioChart from "@/components/dashboard/PortfolioChart";

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Welcome back, {session?.user?.name?.split(" ")[0] || "Investor"}
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Here is your AI-powered market overview today.</p>
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
                    <h3 className="text-2xl font-bold mt-2 text-slate-200">₹2,45,000</h3>
                    <div className="flex items-center gap-1 mt-3 text-sm font-medium text-emerald-400">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+3.2% (₹7,840)</span>
                        <span className="text-slate-500 ml-1 font-normal">this month</span>
                    </div>
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
                    <h3 className="text-2xl font-bold mt-2 text-slate-200">4 Alerts</h3>
                    <div className="flex items-center gap-1 mt-3 text-sm font-medium text-amber-400">
                        <span>2 Actionable today</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp className="w-16 h-16 text-red-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">NIFTY 50 Trend</p>
                    <h3 className="text-2xl font-bold mt-2 text-slate-200">22,145.30</h3>
                    <div className="flex items-center gap-1 mt-3 text-sm font-medium text-red-400">
                        <ArrowDownRight className="w-4 h-4" />
                        <span>-0.45%</span>
                        <span className="text-slate-500 ml-1 font-normal">today</span>
                    </div>
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
                                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded">BUY</span>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-snug max-w-md">
                                        Energy sector breakout expected. Target: ₹3,150. Stop-loss: ₹2,850.
                                    </p>
                                </div>
                                <div className="w-full sm:w-auto shrink-0 flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full w-[88%]"></div>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-400">88%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mock Row 2 */}
                            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:bg-slate-800/60">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
                                        <h4 className="font-bold text-lg">INFY</h4>
                                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded">HOLD</span>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-snug max-w-md">
                                        IT sector neutral trend. Support holding at ₹1,520 range.
                                    </p>
                                </div>
                                <div className="w-full sm:w-auto shrink-0 flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                                                <div className="bg-amber-500 h-full w-[72%]"></div>
                                            </div>
                                            <span className="text-sm font-bold text-amber-400">72%</span>
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
                    {/* News Impact Engine */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                            News Impact Engine
                        </h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-emerald-500 pl-3">
                                <p className="text-sm font-medium">Oil prices drop globally</p>
                                <p className="text-xs text-slate-400 mt-1">Impact: Airline stocks up, Energy neutral</p>
                            </div>
                            <div className="border-l-4 border-red-500 pl-3">
                                <p className="text-sm font-medium">US Inflation higher than expected</p>
                                <p className="text-xs text-slate-400 mt-1">Impact: Tech sector seeing sell-off pressures</p>
                            </div>
                            <div className="border-l-4 border-amber-500 pl-3">
                                <p className="text-sm font-medium">RBI holds interest rates</p>
                                <p className="text-xs text-slate-400 mt-1">Impact: Banking sector stable, real estate mixed</p>
                            </div>
                        </div>
                    </div>

                    {/* Active Triggers */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                            Live Triggers
                        </h2>
                        <div className="space-y-3">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-bold">TCS</div>
                                    <div className="text-xs text-slate-400">Buy above ₹4,000</div>
                                </div>
                                <div className="text-emerald-400 text-xs font-medium px-2 py-1 bg-emerald-500/20 rounded">
                                    Hit: ₹4,010
                                </div>
                            </div>
                            <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-bold">HDFCBANK</div>
                                    <div className="text-xs text-slate-400">Sell below ₹1,350</div>
                                </div>
                                <div className="text-slate-400 text-xs font-medium px-2 py-1 bg-slate-700 rounded">
                                    Curr: ₹1,420
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
