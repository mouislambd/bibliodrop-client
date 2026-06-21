import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import toast from "react-hot-toast";

const BookApprovals = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axiosInstance.get("/books", { params: { status: "pending_approval", limit: 50 } });
            // Since /books only returns published, fetch all and filter manually via separate approach
            const allRes = await axiosInstance.get("/books/admin/all-pending");
            setBooks(allRes.data.books || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axiosInstance.patch(`/books/${id}/approve`);
            toast.success("Book approved and published");
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to approve");
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
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Book Approval Queue</h2>

            {books.length === 0 ? (
                <p className="text-gray-500">No books pending approval.</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="text-left p-4">Book</th>
                                <th className="text-left p-4">Librarian</th>
                                <th className="text-left p-4">Category</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book._id} className="border-t border-gray-100">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={book.coverImage} alt={book.title} className="w-10 h-12 object-cover rounded" />
                                        {book.title}
                                    </td>
                                    <td className="p-4">{book.librarian?.name}</td>
                                    <td className="p-4">{book.category}</td>
                                    <td className="p-4 space-x-3">
                                        <button onClick={() => handleApprove(book._id)} className="bg-secondary text-white px-3 py-1 rounded-lg text-xs hover:opacity-90">
                                            Approve & Publish
                                        </button>
                                        <button onClick={() => handleDelete(book._id)} className="text-red-500 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookApprovals;