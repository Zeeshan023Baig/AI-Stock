"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronRight, ShieldCheck, Activity } from "lucide-react";

const sectorsList = [
    "IT & Tech", "Banking & Finance", "Energy", "Healthcare & Pharma",
    "Automobiles", "FMCG", "Real Estate", "Telecommunications"
];

export default function OnboardingPage() {
    const router = useRouter();
    const { update } = useSession(); // Used to trigger session refresh

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        riskTolerance: "medium",
        investmentDuration: "1 month",
        budgetRange: "₹50,000 - ₹2,00,000",
        preferredSectors: [] as string[],
        marketExperience: "intermediate",
    });

    const toggleSector = (sector: string) => {
        setFormData((prev) => ({
            ...prev,
            preferredSectors: prev.preferredSectors.includes(sector)
                ? prev.preferredSectors.filter((s) => s !== sector)
                : [...prev.preferredSectors, sector],
        }));
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/user/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to save preferences");
            }

            // Update next-auth session to reflect hasCompletedOnboarding = true
            await update({ hasCompletedOnboarding: true });

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-200">
            <div className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Activity className="w-8 h-8 text-emerald-500" />
                        <h2 className="text-2xl font-bold">Investment Profile</h2>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
                        <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>

                    {error && <p className="text-red-400 mb-4">{error}</p>}

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">What is your market experience?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {["beginner", "intermediate", "expert"].map((exp) => (
                                        <button
                                            key={exp}
                                            onClick={() => setFormData({ ...formData, marketExperience: exp })}
                                            className={`p-4 rounded-xl border ${formData.marketExperience === exp
                                                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                                    : "bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300"
                                                } transition-all capitalize`}
                                        >
                                            {exp}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">How do you react to a 20% market drop? (Risk Tolerance)</h3>
                                <div className="grid grid-cols-1 space-y-3">
                                    <button
                                        onClick={() => setFormData({ ...formData, riskTolerance: "low" })}
                                        className={`p-4 text-left rounded-xl border ${formData.riskTolerance === "low"
                                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                                : "bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300"
                                            } transition-all`}
                                    >
                                        <span className="font-medium block w-full">Sell immediately (Low Risk)</span>
                                        <span className="text-xs opacity-70">Capital preservation is my priority</span>
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, riskTolerance: "medium" })}
                                        className={`p-4 text-left rounded-xl border ${formData.riskTolerance === "medium"
                                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                                : "bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300"
                                            } transition-all`}
                                    >
                                        <span className="font-medium block w-full">Hold and wait (Medium Risk)</span>
                                        <span className="text-xs opacity-70">Balanced approach to growth and risk</span>
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, riskTolerance: "high" })}
                                        className={`p-4 text-left rounded-xl border ${formData.riskTolerance === "high"
                                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                                : "bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300"
                                            } transition-all`}
                                    >
                                        <span className="font-medium block w-full">Buy more! (High Risk)</span>
                                        <span className="text-xs opacity-70">Aggressive growth is my goal</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">What is your investment duration?</h3>
                                <select
                                    value={formData.investmentDuration}
                                    onChange={(e) => setFormData({ ...formData, investmentDuration: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="1 week">1 Week (Trading)</option>
                                    <option value="1 month">1 Month (Short-term)</option>
                                    <option value="3 months">3 Months (Medium-term)</option>
                                    <option value="long-term">Long Term (1+ Years)</option>
                                </select>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">Estimated Budget Range</h3>
                                <select
                                    value={formData.budgetRange}
                                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="Below ₹50,000">Below ₹50,000</option>
                                    <option value="₹50,000 - ₹2,00,000">₹50,000 - ₹2,00,000</option>
                                    <option value="₹2,00,000 - ₹10,00,000">₹2,00,000 - ₹10,00,000</option>
                                    <option value="Above ₹10,00,000">Above ₹10,00,000</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Preferred Sectors</h3>
                                <p className="text-slate-400 text-sm mb-4">Select at least 2 sectors you are interested in.</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {sectorsList.map((sector) => (
                                        <button
                                            key={sector}
                                            onClick={() => toggleSector(sector)}
                                            className={`p-3 rounded-lg text-sm font-medium border transition-all ${formData.preferredSectors.includes(sector)
                                                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                                                }`}
                                        >
                                            {sector}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex gap-4 items-start mt-6">
                                <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                                <p className="text-sm text-emerald-100/80 leading-relaxed">
                                    Based on your answers, our AI will generate a personalized <strong>Risk Score</strong> and tailor stock recommendations specifically for your profile.
                                    You will not see this questionnaire again.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="bg-slate-800/50 p-6 flex justify-between border-t border-slate-800">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 rounded-lg text-slate-400 hover:text-slate-200 font-medium transition-colors"
                        >
                            Back
                        </button>
                    ) : (
                        <div></div> // empty spacer
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-2 transition-colors"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || formData.preferredSectors.length < 2}
                            className="px-8 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                            {loading ? "Generating Profile..." : "Complete Setup"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
