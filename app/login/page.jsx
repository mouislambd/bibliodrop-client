"use client";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiBookOpen, FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signIn.email({ email, password });
            toast.success("Login successful!");
            router.push("/");
        } catch (err) {
            toast.error("Invalid email or password!");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await signIn.social({ provider: "google" });
        } catch (err) {
            toast.error("Google login failed!");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
            <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-md shadow-2xl">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-2xl mb-2">
                    <FiBookOpen size={28} />
                    BiblioDrop
                </div>
                <p className="text-center text-gray-400 text-sm mb-8">Welcome back! Please login.</p>

                {/* Google Login */}
                <button
                    onClick={handleGoogle}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 rounded-xl mb-6 hover:bg-gray-100 transition"
                >
                    <FcGoogle size={22} />
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-gray-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-700" />
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0f172a] text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0f172a] text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-emerald-400 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}