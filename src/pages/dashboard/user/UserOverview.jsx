import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../../utils/axios";

const UserOverview = () => {
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

    const totalBooks = deliveries.filter((d) => d.status === "delivered").length;
    const pendingDeliveries = deliveries.filter((d) => d.status !== "delivered").length;
    const totalSpent = deliveries.reduce((sum, d) => sum + d.deliveryFee, 0);

    const chartData = [
        { name: "Pending", count: deliveries.filter((d) => d.status === "pending").length },
        { name: "Dispatched", count: deliveries.filter((d) => d.status === "dispatched").length },
        { name: "Delivered", count: deliveries.filter((d) => d.status === "delivered").length },
    ];

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Total Books Read</p>
                    <p className="text-3xl font-bold text-primary mt-2">{totalBooks}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Pending Deliveries</p>
                    <p className="text-3xl font-bold text-accent mt-2">{pendingDeliveries}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Total Spent on Fees</p>
                    <p className="text-3xl font-bold text-secondary mt-2">${totalSpent.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold mb-4">Delivery Status Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#40916C" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserOverview;