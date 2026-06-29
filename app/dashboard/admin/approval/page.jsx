"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BookApprovalPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        fetchPendingBooks();
    }, []);

    const fetchPendingBooks = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/books/pending`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            setBooks(data.books || []);
        } catch {
            toast.error("Could not load pending books");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            setActionId(id);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/books/${id}/approve`,
                { method: "PATCH", credentials: "include" }
            );
            if (!res.ok) throw new Error();
            toast.success("Book approved & published");
            setBooks((prev) => prev.filter((b) => b._id !== id));
        } catch {
            toast.error("Approval failed");
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this book permanently?")) return;
        try {
            setActionId(id);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/books/${id}`,
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

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-[#1e293b] rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
                Book Approval Queue
            </h1>

            <div className="overflow-x-auto bg-[#1e293b] rounded-xl">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                            <th className="p-4">Cover</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Librarian</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Fee</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500">
                                    No books pending approval. 🎉
                                </td>
                            </tr>
                        ) : (
                            books.map((book) => (
                                <tr key={book._id} className="border-b border-gray-800 hover:bg-[#0f172a]">
                                    <td className="p-4">
                                        <img
                                            src={book.coverImage}
                                            alt={book.title}
                                            className="w-10 h-14 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-4 font-medium">{book.title}</td>
                                    <td className="p-4 text-gray-400">{book.librarian?.email}</td>
                                    <td className="p-4 text-gray-400">{book.category}</td>
                                    <td className="p-4 text-emerald-400">${book.deliveryFee}</td>
                                    <td className="p-4 text-center space-x-2">
                                        <button
                                            disabled={actionId === book._id}
                                            onClick={() => handleApprove(book._id)}
                                            className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                                        >
                                            Approve & Publish
                                        </button>
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