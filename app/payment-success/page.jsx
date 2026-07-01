"use client";
import { useEffect, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        const bookId = searchParams.get("bookId");

        if (!sessionId || !bookId) {
            setStatus("error");
            return;
        }

        axios.post(
            `${API}/deliveries/confirm`,
            { sessionId, bookId },
            { withCredentials: true }
        )
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"));
    }, []);

    if (status === "loading") return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
            <div className="bg-[#1e293b] rounded-2xl p-10 text-center max-w-md w-full">
                {status === "success" ? (
                    <>
                        <FiCheckCircle size={60} className="text-emerald-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
                        <p className="text-gray-400 mb-6">Your delivery request has been confirmed.</p>
                        <Link
                            href="/dashboard/user/history"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition inline-block"
                        >
                            View Delivery History
                        </Link>
                    </>
                ) : (
                    <>
                        <FiXCircle size={60} className="text-red-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong!</h1>
                        <p className="text-gray-400 mb-6">Payment may have failed or already been processed.</p>
                        <Link
                            href="/browse"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition inline-block"
                        >
                            Back to Browse
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}