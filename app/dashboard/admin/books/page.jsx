"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSearch, FiTrash2, FiEyeOff, FiUser } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ManageBooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/books/admin/all-books`, {
                withCredentials: true,
            });
            setBooks(res.data.books || []);
        } catch (err) {
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleForceUnpublish = async (bookId) => {
        setUpdatingId(bookId);
        try {
            await axios.put(
                `${API}/books/${bookId}`,
                { status: "unpublished" },
                { withCredentials: true }
            );
            setBooks((prev) =>
                prev.map((b) => (b._id === bookId ? { ...b, status: "unpublished" } : b))
            );
        } catch (err) {
            alert(err.response?.data?.message || "Failed to unpublish book");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (bookId, title) => {
        if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
        setUpdatingId(bookId);
        try {
            await axios.delete(`${API}/books/${bookId}`, { withCredentials: true });
            setBooks((prev) => prev.filter((b) => b._id !== bookId));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete book");
        } finally {
            setUpdatingId(null);
        }
    };

    const statusBadgeColor = (status) => {
        if (status === "published") return "bg-emerald-500/10 text-emerald-400";
        if (status === "pending_approval") return "bg-yellow-500/10 text-yellow-400";
        return "bg-gray-500/10 text-gray-400";
    };

    const filteredBooks = books.filter((b) => {
        const matchesSearch =
            b.title?.toLowerCase().includes(search.toLowerCase()) ||
            b.author?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-1">Manage All Books</h1>
                    <p className="text-gray-400 text-sm">
                        Platform-wide control over every book listing
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#1e293b] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#1e293b] text-white px-4 py-2.5 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                    >
                        <option value="All">All Status</option>
                        <option value="published">Published</option>
                        <option value="unpublished">Unpublished</option>
                        <option value="pending_approval">Pending Approval</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-[#1e293b] rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-6 space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-[#0f172a] rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : filteredBooks.length === 0 ? (
                        <p className="text-center text-gray-400 py-16">No books found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700 text-left text-gray-400">
                                        <th className="px-6 py-4 font-medium">Book</th>
                                        <th className="px-6 py-4 font-medium">Librarian</th>
                                        <th className="px-6 py-4 font-medium">Category</th>
                                        <th className="px-6 py-4 font-medium">Fee</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBooks.map((book) => (
                                        <tr
                                            key={book._id}
                                            className="border-b border-gray-800 hover:bg-[#0f172a]/50 transition"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={book.coverImage}
                                                        alt={book.title}
                                                        className="w-10 h-12 object-cover rounded-md"
                                                    />
                                                    <div>
                                                        <p className="font-medium line-clamp-1">{book.title}</p>
                                                        <p className="text-gray-500 text-xs">{book.author}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                <span className="flex items-center gap-1.5">
                                                    <FiUser size={14} />
                                                    {book.librarian?.name || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{book.category}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-medium">
                                                ৳{book.deliveryFee}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadgeColor(
                                                        book.status
                                                    )}`}
                                                >
                                                    {book.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleForceUnpublish(book._id)}
                                                        disabled={
                                                            book.status !== "published" ||
                                                            updatingId === book._id
                                                        }
                                                        title="Force unpublish"
                                                        className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded-lg disabled:opacity-30 transition"
                                                    >
                                                        <FiEyeOff size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(book._id, book.title)}
                                                        disabled={updatingId === book._id}
                                                        title="Delete book"
                                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg disabled:opacity-30 transition"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}