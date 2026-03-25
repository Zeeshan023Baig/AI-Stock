"use client";

import { usePathname } from "next/navigation";
import { Hammer } from "lucide-react";

export default function FeaturePlaceholderPage() {
    const pathname = usePathname();
    const featureName = pathname.split('/').pop()?.replace(/-/g, ' ');

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6">
                    <Hammer className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 capitalize">
                    {featureName} Dashboard
                </h2>
                <p className="text-slate-400 mb-6">
                    This feature is currently under active development. Our AI is crunching the numbers and will be ready soon!
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
