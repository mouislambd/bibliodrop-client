"use client";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiBook, FiClock, FiDollarSign } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function UserOverviewPage() {
    const { data: session } = useSession();
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        axios.get(`${API}/deliveries/my`, { withCredentials: true })
            .then((res) => setDeliveries(res.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [session]);

    const totalSpent = deliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
    const pending = deliveries.filter((d) => d.status === "Pending").length;
    const delivered = deliveries.filter((d) => d.status === "Delivered").length;

    const chartData = deliveries.slice(-6).map((d) => ({
        name: new Date(d.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric" }),
        fee: d.deliveryFee || 0,
    }));

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Overview</h1>

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
            {chartData.length > 0 ? (
                <div className="bg-[#1e293b] rounded-xl p-6">
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
            ) : (
                <div className="bg-[#1e293b] rounded-xl p-10 text-center text-gray-400">
                    No activity yet. Start browsing books!
                </div>
            )}
        </div>
    );
}