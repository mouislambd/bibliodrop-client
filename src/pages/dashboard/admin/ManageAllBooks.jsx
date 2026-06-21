import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import toast from "react-hot-toast";

const statusColors = {
    pending_approval: "bg-yellow-100 text-yellow-700",
    published: "bg-green-100 text-green-700",
    unpublished: "bg-gray-200 text-gray-600",
};

const ManageAllBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axiosInstance.get("/books/admin/all-books");
            setBooks(res.data.books);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await axiosInstance.patch(`/books/${id}/toggle-publish`);
            toast.success("Status updated");
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this book?")) return;
        try {
            await axiosInstance.delete(`/books/${id}`);
            toast.success("Book deleted");
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Manage All Books</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left p-4">Book</th>
                            <th className="text-left p-4">Librarian</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id} className="border-t border-gray-100">
                                <td className="p-4">{book.title}</td>
                                <td className="p-4">{book.librarian?.name}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[book.status]}`}>
                                        {book.status.replace("_", " ")}
                                    </span>
                                </td>
                                <td className="p-4 space-x-3">
                                    {book.status !== "pending_approval" && (
                                        <button onClick={() => handleToggle(book._id)} className="text-secondary hover:underline">
                                            {book.status === "published" ? "Unpublish" : "Publish"}
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(book._id)} className="text-red-500 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAllBooks;