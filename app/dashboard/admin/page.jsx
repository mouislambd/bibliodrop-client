"use client";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { FiUsers, FiBook, FiTruck, FiDollarSign, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL;
const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ users: 0, books: 0, deliveries: 0, revenue: 0 });
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [pendingBooks, setPendingBooks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (!session?.user) return;
        fetchAll();
    }, [session]);

    const fetchAll = async () => {
        try {
            const [u, b, d, t] = await Promise.all([
                axios.get(`${API}/users`, { withCredentials: true }),
                axios.get(`${API}/books/all`, { withCredentials: true }),
                axios.get(`${API}/deliveries/all`, { withCredentials: true }),
                axios.get(`${API}/deliveries/transactions`, { withCredentials: true }),
            ]);
            const allUsers = u.data || [];
            const allBooks = b.data || [];
            const allDeliveries = d.data || [];
            const allTransactions = t.data || [];

            setUsers(allUsers);
            setBooks(allBooks);
            setTransactions(allTransactions);
            setPendingBooks(allBooks.filter((b) => b.status === "Pending Approval"));
            setStats({
                users: allUsers.length,
                books: allBooks.length,
                deliveries: allDeliveries.length,
                revenue: allTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
            });
        } catch {
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            await axios.patch(`${API}/users/${userId}/role`, { role }, { withCredentials: true });
            toast.success("Role updated!");
            fetchAll();
        } catch {
            toast.error("Failed to update role!");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm("Delete this user?")) return;
        try {
            await axios.delete(`${API}/users/${userId}`, { withCredentials: true });
            toast.success("User deleted!");
            fetchAll();
        } catch {
            toast.error("Failed to delete user!");
        }
    };

    const handleApproveBook = async (bookId) => {
        try {
            await axios.patch(`${API}/books/${bookId}/approve`, {}, { withCredentials: true });
            toast.success("Book approved & published!");
            fetchAll();
        } catch {
            toast.error("Failed to approve!");
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (!confirm("Delete this book?")) return;
        try {
            await axios.delete(`${API}/books/${bookId}`, { withCredentials: true });
            toast.success("Book deleted!");
            fetchAll();
        } catch {
            toast.error("Failed to delete!");
        }
    };

    const handleUnpublishBook = async (bookId) => {
        try {
            await axios.patch(`${API}/books/${bookId}/unpublish`, {}, { withCredentials: true });
            toast.success("Book unpublished!");
            fetchAll();
        } catch {
            toast.error("Failed!");
        }
    };

    // Pie chart data
    const categoryData = books.reduce((acc, book) => {
        const found = acc.find((a) => a.name === book.category);
        if (found) found.value++;
        else acc.push({ name: book.category, value: 1 });
        return acc;
    }, []);

    const tabs = ["overview", "approval", "users", "books", "transactions"];

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <img
                        src={session?.user?.image || "https://i.pravatar.cc/100"}
                        alt="avatar"
                        className="w-14 h-14 rounded-full border-2 border-emerald-400"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
                        <p className="text-gray-400 text-sm">Admin Dashboard</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm capitalize transition ${activeTab === tab
                                    ? "bg-emerald-500 text-white"
                                    : "bg-[#1e293b] text-gray-400 hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {activeTab === "overview" && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: "Total Users", value: stats.users, icon: <FiUsers /> },
                                { label: "Total Books", value: stats.books, icon: <FiBook /> },
                                { label: "Total Deliveries", value: stats.deliveries, icon: <FiTruck /> },
                                { label: "Total Revenue", value: `৳${stats.revenue}`, icon: <FiDollarSign /> },
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#1e293b] rounded-xl p-5 flex items-center gap-3">
                                    <div className="text-2xl text-emerald-400">{stat.icon}</div>
                                    <div>
                                        <p className="text-gray-400 text-xs">{stat.label}</p>
                                        <p className="text-xl font-bold">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pie Chart */}
                        {categoryData.length > 0 && (
                            <div className="bg-[#1e293b] rounded-xl p-6">
                                <h2 className="font-semibold mb-4">Books by Category</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}`}
                                        >
                                            {categoryData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </>
                )}

                {/* Approval Queue */}
                {activeTab === "approval" && (
                    <div className="bg-[#1e293b] rounded-xl p-6">
                        <h2 className="font-semibold mb-4">Book Approval Queue ({pendingBooks.length})</h2>
                        {pendingBooks.length === 0 ? (
                            <p className="text-gray-400 text-sm">No books pending approval.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-400 border-b border-gray-700">
                                            <th className="text-left py-2">Title</th>
                                            <th className="text-left py-2">Author</th>
                                            <th className="text-left py-2">Category</th>
                                            <th className="text-left py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingBooks.map((book) => (
                                            <tr key={book._id} className="border-b border-gray-800">
                                                <td className="py-2">{book.title}</td>
                                                <td className="py-2">{book.author}</td>
                                                <td className="py-2">{book.category}</td>
                                                <td className="py-2 flex gap-2">
                                                    <button
                                                        onClick={() => handleApproveBook(book._id)}
                                                        className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/40"
                                                    >
                                                        <FiCheck /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(book._id)}
                                                        className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/40"
                                                    >
                                                        <FiTrash2 /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Users */}
                {activeTab === "users" && (
                    <div className="bg-[#1e293b] rounded-xl p-6">
                        <h2 className="font-semibold mb-4">Manage Users ({users.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-700">
                                        <th className="text-left py-2">Name</th>
                                        <th className="text-left py-2">Email</th>
                                        <th className="text-left py-2">Role</th>
                                        <th className="text-left py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id} className="border-b border-gray-800">
                                            <td className="py-2">{user.name}</td>
                                            <td className="py-2 text-gray-400">{user.email}</td>
                                            <td className="py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${user.role === "admin" ? "bg-red-500/20 text-red-400" :
                                                        user.role === "librarian" ? "bg-blue-500/20 text-blue-400" :
                                                            "bg-gray-500/20 text-gray-400"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-2 flex gap-2 flex-wrap">
                                                <select
                                                    defaultValue={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className="bg-[#0f172a] text-white text-xs px-2 py-1 rounded border border-gray-700"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="librarian">Librarian</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
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
                    </div>
                )}

                {/* All Books */}
                {activeTab === "books" && (
                    <div className="bg-[#1e293b] rounded-xl p-6">
                        <h2 className="font-semibold mb-4">Manage All Books ({books.length})</h2>
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
                                                        book.status === "Pending Approval" ? "bg-yellow-500/20 text-yellow-400" :
                                                            "bg-gray-500/20 text-gray-400"
                                                    }`}>
                                                    {book.status}
                                                </span>
                                            </td>
                                            <td className="py-2 flex gap-2">
                                                {book.status === "Published" && (
                                                    <button
                                                        onClick={() => handleUnpublishBook(book._id)}
                                                        className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                                                    >
                                                        Unpublish
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteBook(book._id)}
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
                    </div>
                )}

                {/* Transactions */}
                {activeTab === "transactions" && (
                    <div className="bg-[#1e293b] rounded-xl p-6">
                        <h2 className="font-semibold mb-4">All Transactions ({transactions.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-700">
                                        <th className="text-left py-2">Transaction ID</th>
                                        <th className="text-left py-2">User</th>
                                        <th className="text-left py-2">Librarian</th>
                                        <th className="text-left py-2">Amount</th>
                                        <th className="text-left py-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t) => (
                                        <tr key={t._id} className="border-b border-gray-800">
                                            <td className="py-2 text-xs text-gray-400 font-mono">{t.stripeSessionId?.slice(0, 16)}...</td>
                                            <td className="py-2">{t.userEmail}</td>
                                            <td className="py-2">{t.librarianEmail}</td>
                                            <td className="py-2 text-emerald-400">৳{t.amount}</td>
                                            <td className="py-2">{new Date(t.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}