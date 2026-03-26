"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PieChart, TrendingUp, Newspaper } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Portfolio", href: "/dashboard/portfolio", icon: PieChart },
        { name: "AI Picks", href: "/dashboard/recommendations", icon: TrendingUp },
        { name: "News", href: "/dashboard/news", icon: Newspaper },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 pb-safe">
            <div className="flex items-center justify-around p-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-colors ${isActive ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mb-1 ${isActive ? "text-emerald-400" : ""}`} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
