"use client";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiBook, FiDollarSign, FiClock } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LibrarianOverviewPage() {
    const { data: session } = useSession();
    const [books, setBooks] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        Promise.all([
            axios.get(`${API}/books/librarian/my-books`, { withCredentials: true }),
            axios.get(`${API}/deliveries/librarian-deliveries`, { withCredentials: true }),
        ]).then(([b, d]) => {
            setBooks(b.data.books || []);
            setDeliveries(d.data.deliveries || []);
        })
        .catch(() => { })
            .finally(() => setLoading(false));
    }, [session]);

    const totalEarnings = deliveries
        .filter((d) => d.status === "Delivered")
        .reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
    const pendingCount = deliveries.filter((d) => d.status === "Pending").length;

    const chartData = books.slice(0, 6).map((b) => ({
        name: b.title?.slice(0, 12) + "...",
        requests: deliveries.filter((d) => d.bookId === b._id).length,
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
                    { label: "Total Books", value: books.length, icon: <FiBook /> },
                    { label: "Total Earnings", value: `৳${totalEarnings}`, icon: <FiDollarSign /> },
                    { label: "Pending Requests", value: pendingCount, icon: <FiClock /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#1e293b] rounded-xl p-5 flex items-center gap-4">
                        <div className="text-2xl text-emerald-400">{stat.icon}</div>
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
                    <h2 className="font-semibold mb-4">Book Requests Overview</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip />
                            <Bar dataKey="requests" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="bg-[#1e293b] rounded-xl p-10 text-center text-gray-400">
                    No books added yet.
                </div>
            )}
        </div>
    );
}