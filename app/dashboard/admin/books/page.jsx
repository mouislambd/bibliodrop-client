"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ManageBooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/books/admin/all-books`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            setBooks(data.books || []);
        } catch {
            toast.error("Could not load books");
        } finally {
            setLoading(false);
        }
    };

    const handleUnpublish = async (id) => {
        try {
            setActionId(id);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/books/${id}/toggle-publish`,
                { method: "PATCH", credentials: "include" }
            );
            if (!res.ok) throw new Error();
            toast.success("Book unpublished");
            setBooks((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status: "unpublished" } : b))
            );
        } catch {
            toast.error("Action failed");
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this book permanently?")) return;
        try {
            setActionId(id);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
                { method: "DELETE", credentials: "include" }
            );
            if (!res.ok) throw new Error();
            toast.success("Book deleted");
            setBooks((prev) => prev.filter((b) => b._id !== id));
        } catch {
            toast.error("Delete failed");
        } finally {
            setActionId(null);
        }
    };

    const statusBadge = (status) => {
        const map = {
            "pending_approval": "bg-amber-500/20 text-amber-400",
            published: "bg-emerald-500/20 text-emerald-400",
            unpublished: "bg-gray-500/20 text-gray-400",
        };
        return map[status] || "bg-gray-500/20 text-gray-400";
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-14 bg-[#1e293b] rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage All Books</h1>

            <div className="overflow-x-auto bg-[#1e293b] rounded-xl">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                            <th className="p-4">Title</th>
                            <th className="p-4">Librarian</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-500">
                                    No books found.
                                </td>
                            </tr>
                        ) : (
                            books.map((book) => (
                                <tr key={book._id} className="border-b border-gray-800 hover:bg-[#0f172a]">
                                    <td className="p-4 font-medium">{book.title}</td>
                                    <td className="p-4 text-gray-400">{book.librarian?.email}</td>
                                    <td className="p-4 text-gray-400">{book.category}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(book.status)}`}>
                                            {book.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2">
                                        {book.status === "published" && (
                                            <button
                                                disabled={actionId === book._id}
                                                onClick={() => handleUnpublish(book._id)}
                                                className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-white border-none"
                                            >
                                                Unpublish
                                            </button>
                                        )}
                                        <button
                                            disabled={actionId === book._id}
                                            onClick={() => handleDelete(book._id)}
                                            className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
