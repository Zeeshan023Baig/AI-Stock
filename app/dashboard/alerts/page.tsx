"use client";

import { useState } from "react";
import { BellRing, Plus, Settings2, Trash2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState([
        { id: 1, ticker: "RELIANCE.NS", type: "Price Target", condition: "Crosses Above", value: 3000, active: true, triggered: false },
        { id: 2, ticker: "TCS.NS", type: "Price Target", condition: "Crosses Below", value: 3800, active: true, triggered: true },
        { id: 3, ticker: "HDFCBANK.NS", type: "Volume Spike", condition: "Greater Than", value: "20M Shares", active: false, triggered: false },
        { id: 4, ticker: "INFY.NS", type: "AI Confidence", condition: "Drops Below", value: "60%", active: true, triggered: false },
    ]);

    const toggleAlert = (id: number) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
    };

    const deleteAlert = (id: number) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-500 flex items-center gap-2">
                        <BellRing className="w-6 h-6 text-rose-500" /> Live Triggers
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your active market alerts and AI-driven automated notifications.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors text-sm font-bold shadow-lg shadow-rose-500/20">
                    <Plus className="w-4 h-4" /> Create Alert
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                    <h2 className="text-lg font-bold">Your Alerts</h2>
                    <button className="text-slate-400 hover:text-slate-200 p-2"><Settings2 className="w-4 h-4" /></button>
                </div>

                <div className="divide-y divide-slate-800/50">
                    {alerts.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 italic">No active alerts. Create one to get started.</div>
                    ) : (
                        alerts.map((alert) => (
                            <div key={alert.id} className={`p-4 sm:p-6 transition-colors hover:bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${alert.triggered ? 'bg-rose-500/5 border-l-4 border-rose-500' : 'border-l-4 border-transparent'}`}>

                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${alert.triggered ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-800 text-slate-400'}`}>
                                        {alert.condition.includes("Above") ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-slate-200">{alert.ticker.split('.')[0]}</h3>
                                            {alert.triggered && (
                                                <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded animate-pulse">TRIGGERED</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            {alert.type} <ArrowRight className="w-3 h-3 text-slate-500" /> {alert.condition} <strong className="text-slate-200">{alert.type === 'Price Target' ? `₹${alert.value}` : alert.value}</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 mt-2 sm:mt-0">
                                    <button
                                        onClick={() => toggleAlert(alert.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${alert.active ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alert.active ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>

                                    <button onClick={() => deleteAlert(alert.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
