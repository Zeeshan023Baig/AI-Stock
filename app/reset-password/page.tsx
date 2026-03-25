"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to reset password");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-medium text-slate-200">Invalid Reset Link</h3>
                <p className="text-slate-400 mt-2 text-center">
                    The password reset link is missing or invalid. Please request a new one.
                </p>
                <Link href="/forgot-password" className="mt-6 text-emerald-500 hover:underline">
                    Go to Forgot Password
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-xl font-medium text-slate-200">Password Reset Complete</h3>
                <p className="text-sm text-slate-300">
                    Your password has been successfully reset. Redirecting to login...
                </p>
                <div className="mt-6">
                    <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400">
                        Click here if not redirected
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-slate-300">
                    New Password
                </label>
                <div className="mt-2">
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-lg border-0 py-2.5 px-3 bg-slate-800 text-slate-200 shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300">
                    Confirm New Password
                </label>
                <div className="mt-2">
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
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
                    Set a new password
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-slate-900 py-8 px-4 shadow-xl border border-slate-800 sm:rounded-xl sm:px-10">
                    <Suspense fallback={<div className="text-center text-slate-400">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
