"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiCheck, FiTrash2 } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ApprovalPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        axios.get(`${API}/books/all`, { withCredentials: true })
            .then((res) => {
                const pending = (res.data || []).filter((b) => b.status === "Pending Approval");
                setBooks(pending);
            })
            .catch(() => toast.error("Failed to load books"))
            .finally(() => setLoading(false));
    };

    const handleApprove = async (id) => {
        try {
            await axios.patch(`${API}/books/${id}/approve`, {}, { withCredentials: true });
            toast.success("Book approved & published!");
            fetchBooks();
        } catch {
            toast.error("Failed to approve!");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this book?")) return;
        try {
            await axios.delete(`${API}/books/${id}`, { withCredentials: true });
            toast.success("Book deleted!");
            fetchBooks();
        } catch {
            toast.error("Failed to delete!");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                Book Approval Queue
                <span className="ml-2 text-sm bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                    {books.length} pending
                </span>
            </h1>

            {books.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl p-10 text-center text-gray-400">
                    No books pending approval. 🎉
                </div>
            ) : (
                <div className="bg-[#1e293b] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-700 bg-[#0f172a]">
                                    <th className="text-left px-4 py-3">Cover</th>
                                    <th className="text-left px-4 py-3">Title</th>
                                    <th className="text-left px-4 py-3">Author</th>
                                    <th className="text-left px-4 py-3">Category</th>
                                    <th className="text-left px-4 py-3">Fee</th>
                                    <th className="text-left px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book._id} className="border-b border-gray-800 hover:bg-[#0f172a] transition">
                                        <td className="px-4 py-3">
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="w-10 h-14 object-cover rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-3 font-medium">{book.title}</td>
                                        <td className="px-4 py-3 text-gray-400">{book.author}</td>
                                        <td className="px-4 py-3 text-gray-400">{book.category}</td>
                                        <td className="px-4 py-3 text-emerald-400">৳{book.deliveryFee}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(book._id)}
                                                    className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/40 transition"
                                                >
                                                    <FiCheck /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(book._id)}
                                                    className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/40 transition"
                                                >
                                                    <FiTrash2 /> Delete
                                                </button>
                                            </div>
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