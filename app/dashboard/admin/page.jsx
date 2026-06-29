"use client";
import { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { FiUsers, FiBook, FiTruck, FiDollarSign } from "react-icons/fi";
import toast from "react-hot-toast";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AdminOverviewPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOverview();
    }, []);

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/overview`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error("Failed to load overview");
            const data = await res.json();
            setStats(data);
        } catch (err) {
            toast.error("Could not load dashboard overview");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-[#1e293b] rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    const cards = [
        { label: "Total Users", value: stats?.totalUsers ?? 0, icon: <FiUsers />, color: "text-emerald-400" },
        { label: "Total Books", value: stats?.totalBooks ?? 0, icon: <FiBook />, color: "text-blue-400" },
        { label: "Total Deliveries", value: stats?.totalDeliveries ?? 0, icon: <FiTruck />, color: "text-amber-400" },
        { label: "Total Revenue", value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`, icon: <FiDollarSign />, color: "text-pink-400" },
    ];

    const categoryData = stats?.booksByCategory || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold">Overview</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <div key={card.label} className="bg-[#1e293b] rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">{card.label}</p>
                            <p className="text-2xl font-bold mt-1">{card.value}</p>
                        </div>
                        <div className={`text-3xl ${card.color}`}>{card.icon}</div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart: Books by Category */}
                <div className="bg-[#1e293b] rounded-xl p-5">
                    <h2 className="font-semibold mb-4">Books by Category</h2>
                    {categoryData.length === 0 ? (
                        <p className="text-gray-400 text-sm">No data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="count"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label
                                >
                                    {categoryData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Bar Chart: Revenue/Deliveries trend (if monthly data provided) */}
                <div className="bg-[#1e293b] rounded-xl p-5">
                    <h2 className="font-semibold mb-4">Monthly Deliveries</h2>
                    {!stats?.monthlyDeliveries?.length ? (
                        <p className="text-gray-400 text-sm">No data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={stats.monthlyDeliveries}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}