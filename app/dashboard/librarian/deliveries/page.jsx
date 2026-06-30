"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LibrarianDeliveriesPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = () => {
        axios.get(`${API}/deliveries/librarian-deliveries`, { withCredentials: true })
            .then((res) => setDeliveries(res.data.deliveries || []))
            .catch(() => toast.error("Failed to load deliveries"))
            .finally(() => setLoading(false));
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.patch(`${API}/deliveries/${id}/status`, { status }, { withCredentials: true });
            toast.success("Status updated!");
            fetchDeliveries();
        } catch {
            toast.error("Failed to update status!");
        }
    };

    const statusBadge = (status) => {
        if (status === "delivered") return "bg-emerald-500/20 text-emerald-400";
        if (status === "dispatched") return "bg-blue-500/20 text-blue-400";
        return "bg-yellow-500/20 text-yellow-400";
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Deliveries</h1>
            {deliveries.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl p-10 text-center text-gray-400">
                    No delivery requests yet.
                </div>
            ) : (
                <div className="bg-[#1e293b] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-700 bg-[#0f172a]">
                                    <th className="text-left px-4 py-3">Client</th>
                                    <th className="text-left px-4 py-3">Book</th>
                                    <th className="text-left px-4 py-3">Fee</th>
                                    <th className="text-left px-4 py-3">Date</th>
                                    <th className="text-left px-4 py-3">Status</th>
                                    <th className="text-left px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.map((d) => (
                                    <tr key={d._id} className="border-b border-gray-800 hover:bg-[#0f172a] transition">
                                        <td className="px-4 py-3">{d.user?.name || "N/A"}</td>
                                        <td className="px-4 py-3">{d.book?.title || "N/A"}</td>
                                        <td className="px-4 py-3 text-emerald-400">৳{d.deliveryFee}</td>
                                        <td className="px-4 py-3 text-gray-400">
                                            {new Date(d.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge(d.status)}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {d.status === "pending" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(d._id, "dispatched")}
                                                    className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/40 transition"
                                                >
                                                    Dispatch
                                                </button>
                                            )}
                                            {d.status === "dispatched" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(d._id, "delivered")}
                                                    className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg hover:bg-emerald-500/40 transition"
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                            {d.status === "delivered" && (
                                                <span className="text-xs text-gray-500">Completed</span>
                                            )}
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