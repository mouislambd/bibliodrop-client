"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function DeliveryHistoryPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/deliveries/my-deliveries`, { withCredentials: true })
            .then((res) => setDeliveries(res.data.deliveries || []))
            .catch(() => toast.error("Failed to load deliveries"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Delivery History</h1>
            {deliveries.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl p-10 text-center text-gray-400">
                    No delivery history yet.
                </div>
            ) : (
                <div className="bg-[#1e293b] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-700 bg-[#0f172a]">
                                    <th className="text-left px-4 py-3">Book</th>
                                    <th className="text-left px-4 py-3">Fee</th>
                                    <th className="text-left px-4 py-3">Date</th>
                                    <th className="text-left px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {deliveries.map((d) => (
                                        <tr key={d._id} className="border-b border-gray-800 hover:bg-[#0f172a] transition">
                                            <td className="px-4 py-3">{d.book?.title || "N/A"}</td>
                                            <td className="px-4 py-3 text-emerald-400">৳{d.deliveryFee}</td>
                                            <td className="px-4 py-3 text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${d.status === "delivered" ? "bg-emerald-500/20 text-emerald-400" :
                                                        d.status === "dispatched" ? "bg-blue-500/20 text-blue-400" :
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
                </div>
            )}
        </div>
    );
}