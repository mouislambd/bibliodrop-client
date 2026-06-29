"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiEyeOff } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const categories = ["Fiction", "Sci-Fi", "Academic", "History", "Mystery", "Biography"];

export default function InventoryPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editBook, setEditBook] = useState(null);
    const [form, setForm] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        axios.get(`${API}/books/my`, { withCredentials: true })
            .then((res) => setBooks(res.data || []))
            .catch(() => toast.error("Failed to load books"))
            .finally(() => setLoading(false));
    };

    const handleEdit = (book) => {
        setEditBook(book._id);
        setForm({
            title: book.title,
            author: book.author,
            description: book.description,
            deliveryFee: book.deliveryFee,
            category: book.category,
        });
    };

    const handleUpdate = async () => {
        setSubmitting(true);
        try {
            let coverImage = null;
            if (imageFile) {
                const data = new FormData();
                data.append("image", imageFile);
                const res = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, data
                );
                coverImage = res.data.data.url;
            }
            const payload = { ...form };
            if (coverImage) payload.coverImage = coverImage;
            await axios.put(`${API}/books/${editBook}`, payload, { withCredentials: true });
            toast.success("Book updated!");
            setEditBook(null);
            setImageFile(null);
            fetchBooks();
        } catch {
            toast.error("Failed to update!");
        } finally {
            setSubmitting(false);
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

    const handleUnpublish = async (id) => {
        try {
            await axios.patch(`${API}/books/${id}/unpublish`, {}, { withCredentials: true });
            toast.success("Book unpublished!");
            fetchBooks();
        } catch {
            toast.error("Failed!");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Inventory</h1>

            {/* Edit Form */}
            {editBook && (
                <div className="bg-[#1e293b] rounded-2xl p-6 mb-6">
                    <h2 className="font-semibold mb-4">Edit Book</h2>
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
                            placeholder="Delivery Fee"
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
                        <div className="flex gap-3">
                            <button
                                onClick={handleUpdate}
                                disabled={submitting}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl transition disabled:opacity-50 text-sm"
                            >
                                {submitting ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={() => setEditBook(null)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Books Table */}
            {books.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl p-10 text-center text-gray-400">
                    No books added yet.
                </div>
            ) : (
                <div className="bg-[#1e293b] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-700 bg-[#0f172a]">
                                    <th className="text-left px-4 py-3">Cover</th>
                                    <th className="text-left px-4 py-3">Title</th>
                                    <th className="text-left px-4 py-3">Category</th>
                                    <th className="text-left px-4 py-3">Fee</th>
                                    <th className="text-left px-4 py-3">Status</th>
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
                                        <td className="px-4 py-3 text-gray-400">{book.category}</td>
                                        <td className="px-4 py-3 text-emerald-400">৳{book.deliveryFee}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${book.status === "Published" ? "bg-emerald-500/20 text-emerald-400" :
                                                    book.status === "Unpublished" ? "bg-gray-500/20 text-gray-400" :
                                                        "bg-yellow-500/20 text-yellow-400"
                                                }`}>
                                                {book.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                {book.status === "Published" && (
                                                    <button
                                                        onClick={() => handleUnpublish(book._id)}
                                                        className="text-gray-400 hover:text-white"
                                                        title="Unpublish"
                                                    >
                                                        <FiEyeOff />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(book)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(book._id)}
                                                    className="text-red-400 hover:text-red-300"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
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