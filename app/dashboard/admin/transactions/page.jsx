// app/dashboard/admin/transactions/page.jsx
"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const TransactionsPage = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/deliveries/all`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error("Failed to fetch transactions");

            const data = await res.json();
            setDeliveries(data.deliveries || []);
        } catch (error) {
            toast.error("Could not load transactions");
        } finally {
            setLoading(false);
        }
    };

    const filtered = deliveries.filter((d) => {
        const term = searchTerm.toLowerCase();
        return (
            d.transactionId?.toLowerCase().includes(term) ||
            d.user?.email?.toLowerCase().includes(term) ||
            d.librarian?.email?.toLowerCase().includes(term)
        );
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalRevenue = deliveries.reduce(
        (sum, d) => sum + (d.deliveryFee || 0),
        0
    );

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 w-64 bg-base-300 rounded animate-pulse" />
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-12 w-full bg-base-300 rounded animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                        All Transactions
                    </h1>
                    <p className="text-sm text-base-content/60 mt-1">
                        {deliveries.length} total transactions • ${totalRevenue.toFixed(2)} total revenue
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search by email or transaction ID..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="input input-bordered w-full pl-10"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-300">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200 text-base-content/70 text-sm">
                            <th>Transaction ID</th>
                            <th>User Email</th>
                            <th>Librarian Email</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-base-content/50">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((d) => (
                                <tr key={d._id} className="hover">
                                    <td className="font-mono text-xs">{d.transactionId}</td>
                                    <td>{d.user?.email}</td>
                                    <td>{d.librarian?.email}</td>
                                    <td className="font-semibold text-primary">
                                        ${Number(d.deliveryFee).toFixed(2)}
                                    </td>
                                    <td>
                                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="btn btn-sm btn-outline"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="btn btn-sm btn-outline"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;