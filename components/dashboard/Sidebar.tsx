"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    TrendingUp,
    PieChart,
    Newspaper,
    BellRing,
    History,
    Globe
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Portfolio", href: "/dashboard/portfolio", icon: PieChart },
        { name: "AI Recommendations", href: "/dashboard/recommendations", icon: TrendingUp },
        { name: "Market News", href: "/dashboard/news", icon: Newspaper },
        { name: "Alerts", href: "/dashboard/alerts", icon: BellRing },
        { name: "Backtesting", href: "/dashboard/backtesting", icon: History },
        { name: "Global Insights", href: "/dashboard/insights", icon: Globe },
    ];

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
                <TrendingUp className="w-6 h-6 text-emerald-500 mr-2" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                    AI Stock Advisor
                </span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3 shrink-0" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 shrink-0 text-xs text-slate-500 text-center">
                This platform provides AI insights and does not guarantee returns. Not financial advice.
            </div>
        </div>
    );
}
