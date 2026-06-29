"use client";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiBook, FiDollarSign, FiClock, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL;
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const categories = ["Fiction", "Sci-Fi", "Academic", "History", "Mystery", "Biography"];

export default function LibrarianDashboard() {
    const { data: session } = useSession();
    const [books, setBooks] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: "", author: "", description: "",
        deliveryFee: "", category: "Fiction",
    });

    useEffect(() => {
        if (!session?.user) return;
        fetchData();
    }, [session]);

    const fetchData = async () => {
        try {
            const [b, d] = await Promise.all([
                axios.get(`${API}/books/my`, { withCredentials: true }),
                axios.get(`${API}/deliveries/librarian`, { withCredentials: true }),
            ]);
            setBooks(b.data || []);
            setDeliveries(d.data || []);
        } catch {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return null;
        const data = new FormData();
        data.append("image", imageFile);
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, data);
        return res.data.data.url;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const imageUrl = await uploadImage();
            const payload = { ...form };
            if (imageUrl) payload.coverImage = imageUrl;

            if (editBook) {
                await axios.put(`${API}/books/${editBook._id}`, payload, { withCredentials: true });
                toast.success("Book updated!");
            } else {
                await axios.post(`${API}/books`, payload, { withCredentials: true });
                toast.success("Book submitted for approval!");
            }
            setForm({ title: "", author: "", description: "", deliveryFee: "", category: "Fiction" });
            setImageFile(null);
            setEditBook(null);
            setShowForm(false);
            fetchData();
        } catch {
            toast.error("Failed to save book!");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this book?")) return;
        try {
            await axios.delete(`${API}/books/${id}`, { withCredentials: true });
            toast.success("Book deleted!");
            fetchData();
        } catch {
            toast.error("Failed to delete!");
        }
    };

    const handleTogglePublish = async (book) => {
        if (book.status === "Published") {
            try {
                await axios.patch(`${API}/books/${book._id}/unpublish`, {}, { withCredentials: true });
                toast.success("Book unpublished!");
                fetchData();
            } catch {
                toast.error("Failed!");
            }
        }
    };

    const handleStatusUpdate = async (deliveryId, status) => {
        try {
            await axios.patch(`${API}/deliveries/${deliveryId}/status`, { status }, { withCredentials: true });
            toast.success("Status updated!");
            fetchData();
        } catch {
            toast.error("Failed to update status!");
        }
    };

    const totalEarnings = deliveries
        .filter((d) => d.status === "Delivered")
        .reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
    const pendingCount = deliveries.filter((d) => d.status === "Pending").length;

    const chartData = books.slice(0, 6).map((b) => ({
        name: b.title?.slice(0, 10) + "...",
        requests: deliveries.filter((d) => d.bookId === b._id).length,
    }));

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <img
                            src={session?.user?.image || "https://i.pravatar.cc/100"}
                            alt="avatar"
                            className="w-14 h-14 rounded-full border-2 border-emerald-400"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
                            <p className="text-gray-400 text-sm">Librarian Dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setShowForm(!showForm); setEditBook(null); }}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-sm transition"
                    >
                        <FiPlus /> Add Book
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Total Books", value: books.length, icon: <FiBook /> },
                        { label: "Total Earnings", value: `৳${totalEarnings}`, icon: <FiDollarSign /> },
                        { label: "Pending Requests", value: pendingCount, icon: <FiClock /> },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#1e293b] rounded-xl p-5 flex items-center gap-4">
                            <div className="text-2xl text-emerald-400">{stat.icon}</div>
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                {chartData.length > 0 && (
                    <div className="bg-[#1e293b] rounded-xl p-6 mb-8">
                        <h2 className="font-semibold mb-4">Book Requests Overview</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Bar dataKey="requests" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Add/Edit Book Form */}
                {showForm && (
                    <div className="bg-[#1e293b] rounded-xl p-6 mb-8">
                        <h2 className="font-semibold mb-4">{editBook ? "Edit Book" : "Add New Book"}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                            />
                            <input
                                placeholder="Author"
                                value={form.author}
                                onChange={(e) => setForm({ ...form, author: e.target.value })}
                                className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                            />
                            <input
                                placeholder="Delivery Fee (৳)"
                                type="number"
                                value={form.deliveryFee}
                                onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
                                className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                            />
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                            >
                                {categories.map((c) => <option key={c}>{c}</option>)}
                            </select>
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm md:col-span-2"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="bg-[#0f172a] text-gray-400 px-4 py-3 rounded-xl border border-gray-700 outline-none text-sm"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl transition disabled:opacity-50"
                            >
                                {submitting ? "Saving..." : editBook ? "Update Book" : "Submit Book"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Manage Inventory */}
                <div className="bg-[#1e293b] rounded-xl p-6 mb-8">
                    <h2 className="font-semibold mb-4">Manage Inventory</h2>
                    {books.length === 0 ? (
                        <p className="text-gray-400 text-sm">No books added yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-700">
                                        <th className="text-left py-2">Title</th>
                                        <th className="text-left py-2">Category</th>
                                        <th className="text-left py-2">Status</th>
                                        <th className="text-left py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((book) => (
                                        <tr key={book._id} className="border-b border-gray-800">
                                            <td className="py-2">{book.title}</td>
                                            <td className="py-2">{book.category}</td>
                                            <td className="py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${book.status === "Published" ? "bg-emerald-500/20 text-emerald-400" :
                                                        book.status === "Unpublished" ? "bg-gray-500/20 text-gray-400" :
                                                            "bg-yellow-500/20 text-yellow-400"
                                                    }`}>
                                                    {book.status}
                                                </span>
                                            </td>
                                            <td className="py-2 flex gap-2">
                                                {book.status === "Published" && (
                                                    <button
                                                        onClick={() => handleTogglePublish(book)}
                                                        className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                                                    >
                                                        Unpublish
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setEditBook(book);
                                                        setForm({
                                                            title: book.title,
                                                            author: book.author,
                                                            description: book.description,
                                                            deliveryFee: book.deliveryFee,
                                                            category: book.category,
                                                        });
                                                        setShowForm(true);
                                                    }}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(book._id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Manage Deliveries */}
                <div className="bg-[#1e293b] rounded-xl p-6">
                    <h2 className="font-semibold mb-4">Manage Deliveries</h2>
                    {deliveries.length === 0 ? (
                        <p className="text-gray-400 text-sm">No delivery requests yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-700">
                                        <th className="text-left py-2">Client</th>
                                        <th className="text-left py-2">Book</th>
                                        <th className="text-left py-2">Date</th>
                                        <th className="text-left py-2">Status</th>
                                        <th className="text-left py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveries.map((d) => (
                                        <tr key={d._id} className="border-b border-gray-800">
                                            <td className="py-2">{d.userName || "N/A"}</td>
                                            <td className="py-2">{d.bookTitle || "N/A"}</td>
                                            <td className="py-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                                            <td className="py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${d.status === "Delivered" ? "bg-emerald-500/20 text-emerald-400" :
                                                        d.status === "Dispatched" ? "bg-blue-500/20 text-blue-400" :
                                                            "bg-yellow-500/20 text-yellow-400"
                                                    }`}>
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td className="py-2">
                                                {d.status === "Pending" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(d._id, "Dispatched")}
                                                        className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded"
                                                    >
                                                        Dispatch
                                                    </button>
                                                )}
                                                {d.status === "Dispatched" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(d._id, "Delivered")}
                                                        className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded"
                                                    >
                                                        Delivered
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

            </div>
        </div>
    );
}