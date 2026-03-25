"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, ShieldAlert, Search, Loader2 } from "lucide-react";

export default function Topbar() {
    const { data: session } = useSession();
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                setIsOpen(false);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/data/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results || []);
                setIsOpen(true);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = (symbol: string) => {
        setQuery("");
        setIsOpen(false);
        router.push(`/dashboard/stock/${symbol}`);
    };

    return (
        <div className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10 w-full">
            <div className="flex items-center md:hidden">
                <span className="text-lg font-bold text-emerald-400">AI Stock</span>
            </div>

            {/* Global Search */}
            <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto" ref={searchRef}>
                <div className="relative w-full max-w-md">
                    <div className="relative flex items-center">
                        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search stocks (e.g. RELIANCE, TCS)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => { if (query.trim()) setIsOpen(true) }}
                            className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
                        />
                        {loading && <Loader2 className="absolute right-3 w-4 h-4 text-emerald-500 animate-spin" />}
                    </div>

                    {/* Search Dropdown */}
                    {isOpen && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-2 z-50">
                            {results.map((item) => (
                                <button
                                    key={item.symbol}
                                    onClick={() => handleSelect(item.symbol)}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-700/50 flex flex-col transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-200 text-sm">{item.symbol}</span>
                                        <span className="text-xs text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded">{item.exchDisp || item.typeDisp}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 truncate mt-0.5 pr-4">{item.shortname}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {isOpen && query.trim() && !loading && results.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-4 text-center z-50 text-sm text-slate-400">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Risk Score Indicator */}
                <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                    <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-slate-300 font-medium tracking-wide">AI Engine Active</span>
                </div>

                {/* User Profile Dropdown / Quick Info */}
                <div className="flex items-center gap-2 px-2 border-l border-slate-700/50 pl-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <UserIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="hidden md:flex flex-col mr-2">
                        <span className="text-sm font-medium text-slate-200 leading-tight">
                            {session?.user?.name || "User"}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                            {session?.user?.role || "Member"}
                        </span>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-2"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
