"use client";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiBook, FiClock, FiDollarSign } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function UserDashboard() {
    const { data: session } = useSession();
    const [deliveries, setDeliveries] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        Promise.all([
            axios.get(`${API}/deliveries/my`, { withCredentials: true }),
            axios.get(`${API}/reviews/my`, { withCredentials: true }),
        ]).then(([d, r]) => {
            setDeliveries(d.data || []);
            setReviews(r.data || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [session]);

    const totalSpent = deliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
    const pending = deliveries.filter((d) => d.status === "Pending").length;
    const delivered = deliveries.filter((d) => d.status === "Delivered").length;

    const chartData = deliveries.slice(-6).map((d) => ({
        name: new Date(d.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric" }),
        fee: d.deliveryFee || 0,
    }));

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <img
                        src={session?.user?.image || "https://i.pravatar.cc/100"}
                        alt="avatar"
                        className="w-14 h-14 rounded-full border-2 border-emerald-400"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}!</h1>
                        <p className="text-gray-400 text-sm">User Dashboard</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Books Read", value: delivered, icon: <FiBook />, color: "emerald" },
                        { label: "Pending Deliveries", value: pending, icon: <FiClock />, color: "yellow" },
                        { label: "Total Spent", value: `৳${totalSpent}`, icon: <FiDollarSign />, color: "blue" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#1e293b] rounded-xl p-5 flex items-center gap-4">
                            <div className={`text-2xl text-${stat.color}-400`}>{stat.icon}</div>
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                {chartData.length > 0 && (
                    <div className="bg-[#1e293b] rounded-xl p-6 mb-8">
                        <h2 className="font-semibold mb-4">Spending History</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Line type="monotone" dataKey="fee" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Delivery History */}
                <div className="bg-[#1e293b] rounded-xl p-6 mb-8">
                    <h2 className="font-semibold mb-4">Delivery History</h2>
                    {deliveries.length === 0 ? (
                        <p className="text-gray-400 text-sm">No deliveries yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-700">
                                        <th className="text-left py-2">Book</th>
                                        <th className="text-left py-2">Fee</th>
                                        <th className="text-left py-2">Date</th>
                                        <th className="text-left py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveries.map((d) => (
                                        <tr key={d._id} className="border-b border-gray-800">
                                            <td className="py-2">{d.bookTitle || "N/A"}</td>
                                            <td className="py-2">৳{d.deliveryFee}</td>
                                            <td className="py-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                                            <td className="py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${d.status === "Delivered" ? "bg-emerald-500/20 text-emerald-400" :
                                                        d.status === "Dispatched" ? "bg-blue-500/20 text-blue-400" :
                                                            "bg-yellow-500/20 text-yellow-400"
                                                    }`}>
                                                    {d.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* My Reviews */}
                <div className="bg-[#1e293b] rounded-xl p-6">
                    <h2 className="font-semibold mb-4">My Reviews</h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-400 text-sm">No reviews yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((r) => (
                                <div key={r._id} className="bg-[#0f172a] rounded-lg p-4">
                                    <p className="font-medium text-sm">{r.bookTitle}</p>
                                    <p className="text-gray-400 text-sm mt-1">{r.comment}</p>
                                    <p className="text-emerald-400 text-xs mt-1">{"⭐".repeat(r.rating)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}