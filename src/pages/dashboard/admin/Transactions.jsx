import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";

const Transactions = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("/deliveries/all");
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
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">All Transactions</h2>

            {deliveries.length === 0 ? (
                <p className="text-gray-500">No transactions yet.</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="text-left p-4">Transaction ID</th>
                                <th className="text-left p-4">User Email</th>
                                <th className="text-left p-4">Librarian Email</th>
                                <th className="text-left p-4">Amount</th>
                                <th className="text-left p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((d) => (
                                <tr key={d._id} className="border-t border-gray-100">
                                    <td className="p-4 font-mono text-xs">{d.transactionId}</td>
                                    <td className="p-4">{d.user?.email}</td>
                                    <td className="p-4">{d.librarian?.email}</td>
                                    <td className="p-4">${d.deliveryFee}</td>
                                    <td className="p-4">{new Date(d.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Transactions;