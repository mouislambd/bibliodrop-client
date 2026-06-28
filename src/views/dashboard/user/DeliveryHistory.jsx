"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    dispatched: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
};

const DeliveryHistory = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("/deliveries/my-deliveries");
                setDeliveries(res.data.deliveries);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Delivery History</h2>

            {deliveries.length === 0 ? (
                <p className="text-gray-500">No delivery requests yet.</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="text-left p-4">Book</th>
                                <th className="text-left p-4">Fee</th>
                                <th className="text-left p-4">Request Date</th>
                                <th className="text-left p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((d) => (
                                <tr key={d._id} className="border-t border-gray-100">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={d.book?.coverImage} alt={d.book?.title} className="w-10 h-12 object-cover rounded" />
                                        {d.book?.title}
                                    </td>
                                    <td className="p-4">${d.deliveryFee}</td>
                                    <td className="p-4">{new Date(d.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[d.status]}`}>
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
    );
};

export default DeliveryHistory;