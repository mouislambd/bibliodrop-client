import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../../utils/axios";

const LibrarianOverview = () => {
    const [books, setBooks] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksRes, deliveriesRes] = await Promise.all([
                    axiosInstance.get("/books/librarian/my-books"),
                    axiosInstance.get("/deliveries/librarian-deliveries"),
                ]);
                setBooks(booksRes.data.books);
                setDeliveries(deliveriesRes.data.deliveries);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalEarnings = deliveries.reduce((sum, d) => sum + d.deliveryFee, 0);
    const activePending = deliveries.filter((d) => d.status !== "delivered").length;

    const chartData = [
        { name: "Pending Approval", count: books.filter((b) => b.status === "pending_approval").length },
        { name: "Published", count: books.filter((b) => b.status === "published").length },
        { name: "Unpublished", count: books.filter((b) => b.status === "unpublished").length },
    ];

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Total Books Listed</p>
                    <p className="text-3xl font-bold text-primary mt-2">{books.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Total Earnings</p>
                    <p className="text-3xl font-bold text-secondary mt-2">${totalEarnings.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-gray-500 text-sm">Active Pending Requests</p>
                    <p className="text-3xl font-bold text-accent mt-2">{activePending}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold mb-4">Books by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1B4332" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LibrarianOverview;