import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import toast from "react-hot-toast";

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    dispatched: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
};

const ManageDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const res = await axiosInstance.get("/deliveries/librarian-deliveries");
            setDeliveries(res.data.deliveries);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axiosInstance.patch(`/deliveries/${id}/status`, { status });
            toast.success("Status updated");
            fetchDeliveries();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        }
    };

    const nextStatus = { pending: "dispatched", dispatched: "delivered" };

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Manage Deliveries</h2>

            {deliveries.length === 0 ? (
                <p className="text-gray-500">No delivery requests yet.</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="text-left p-4">Client</th>
                                <th className="text-left p-4">Book</th>
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((d) => (
                                <tr key={d._id} className="border-t border-gray-100">
                                    <td className="p-4">{d.user?.name}</td>
                                    <td className="p-4">{d.book?.title}</td>
                                    <td className="p-4">{new Date(d.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[d.status]}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {nextStatus[d.status] && (
                                            <button
                                                onClick={() => handleStatusChange(d._id, nextStatus[d.status])}
                                                className="bg-primary text-white px-3 py-1 rounded-lg text-xs hover:bg-secondary transition"
                                            >
                                                Mark as {nextStatus[d.status]}
                                            </button>
                                        )}
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

export default ManageDeliveries;