"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axiosInstance from "../../../utils/axios";

const COLORS = ["#1B4332", "#40916C", "#D4A017", "#74C69D", "#52796F", "#95D5B2"];

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get("/users/admin/stats");
                setStats(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    const pieData = stats?.booksByCategory?.map((c) => ({ name: c._id, value: c.count })) || [];

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-primary mt-2">{stats?.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Total Books</p>
                    <p className="text-3xl font-bold text-secondary mt-2">{stats?.totalBooks}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Total Deliveries</p>
                    <p className="text-3xl font-bold text-accent mt-2">{stats?.totalDeliveries}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-primary mt-2">${stats?.totalRevenue?.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold mb-4">Books by Category</h3>
                {pieData.length === 0 ? (
                    <p className="text-gray-500">No published books yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default AdminOverview;