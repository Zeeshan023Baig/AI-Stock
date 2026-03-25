"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [devLink, setDevLink] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        setDevLink("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to send reset email");
            }

            setSuccess(true);
            if (data.devResetLink) {
                setDevLink(data.devResetLink);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-200">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-10 h-10 text-emerald-500" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        AI Stock Advisor
                    </h1>
                </div>
                <h2 className="text-center text-2xl font-semibold tracking-tight">
                    Reset your password
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-slate-900 py-8 px-4 shadow-xl border border-slate-800 sm:rounded-xl sm:px-10">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle className="w-12 h-12 text-emerald-500" />
                            </div>
                            <p className="text-sm text-slate-300">
                                If an account exists with this email, a reset link has been sent.
                            </p>
                            {devLink && (
                                <div className="mt-4 p-4 bg-slate-800 rounded text-left break-all">
                                    <span className="text-xs text-slate-400 block mb-1">Dev only link:</span>
                                    <a href={devLink} className="text-emerald-400 text-sm hover:underline">
                                        {devLink}
                                    </a>
                                </div>
                            )}
                            <div className="mt-6">
                                <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400">
                                    Return to login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            <p className="text-sm text-slate-400">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-slate-300">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2.5 px-3 bg-slate-800 text-slate-200 shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? "Sending..." : "Send reset link"}
                                </button>
                            </div>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-6 text-center text-sm text-slate-400">
                            Remember your password?{" "}
                            <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400">
                                Sign in
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
