"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User as UserIcon, ShieldAlert } from "lucide-react";

export default function Topbar() {
    const { data: session } = useSession();

    return (
        <div className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10 w-full">
            <div className="flex items-center md:hidden">
                <span className="text-lg font-bold text-emerald-400">AI Stock</span>
            </div>

            {/* Search / Context can go here later */}
            <div className="hidden md:flex flex-1"></div>

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
