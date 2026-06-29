"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FiUsers, FiBook, FiTruck, FiDollarSign } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;
const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AdminOverviewPage() {
    const [stats, setStats] = useState({ users: 0, books: 0, deliveries: 0, revenue: 0 });
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get(`${API}/users`, { withCredentials: true }),
            axios.get(`${API}/books/all`, { withCredentials: true }),
            axios.get(`${API}/deliveries/all`, { withCredentials: true }),
            axios.get(`${API}/deliveries/transactions`, { withCredentials: true }),
        ]).then(([u, b, d, t]) => {
            const allBooks = b.data || [];
            const allTransactions = t.data || [];
            setStats({
                users: u.data?.length || 0,
                books: allBooks.length,
                deliveries: d.data?.length || 0,
                revenue: allTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
            });
            const cats = allBooks.reduce((acc, book) => {
                const found = acc.find((a) => a.name === book.category);
                if (found) found.value++;
                else acc.push({ name: book.category, value: 1 });
                return acc;
            }, []);
            setCategoryData(cats);
        }).catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Overview</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Users", value: stats.users, icon: <FiUsers />, color: "emerald" },
                    { label: "Total Books", value: stats.books, icon: <FiBook />, color: "blue" },
                    { label: "Total Deliveries", value: stats.deliveries, icon: <FiTruck />, color: "yellow" },
                    { label: "Total Revenue", value: `৳${stats.revenue}`, icon: <FiDollarSign />, color: "red" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#1e293b] rounded-xl p-5 flex items-center gap-3">
                        <div className={`text-2xl text-${stat.color}-400`}>{stat.icon}</div>
                        <div>
                            <p className="text-gray-400 text-xs">{stat.label}</p>
                            <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pie Chart */}
            {categoryData.length > 0 && (
                <div className="bg-[#1e293b] rounded-xl p-6">
                    <h2 className="font-semibold mb-4">Books by Category</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {categoryData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}