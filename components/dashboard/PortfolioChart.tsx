"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
    { name: "IT & Tech", value: 45, color: "#10b981" }, // emerald-500
    { name: "Banking", value: 30, color: "#06b6d4" },   // cyan-500
    { name: "Energy", value: 15, color: "#f59e0b" },    // amber-500
    { name: "Pharma", value: 10, color: "#8b5cf6" },    // violet-500
];

export default function PortfolioChart() {
    const [activeIndex, setActiveIndex] = useState(-1);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(-1);
    };

    return (
        <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                opacity={activeIndex === -1 || activeIndex === index ? 1 : 0.6}
                                className="transition-opacity duration-300 outline-none"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", color: "#e2e8f0" }}
                        itemStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry: any) => <span className="text-slate-300 text-sm ml-1">{value} ({entry.payload.value}%)</span>}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-2xl font-bold text-slate-200">100%</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Allocated</span>
            </div>
        </div>
    );
}
