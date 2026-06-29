"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { FiSearch, FiTrash2, FiMail } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ManageUsersPage() {
    const { data: session } = useSession();
    const currentUser = session?.user;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/users`, { withCredentials: true });
            setUsers(res.data.users || []);
        } catch (err) {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingId(userId);
        try {
            await axios.patch(
                `${API}/users/${userId}/role`,
                { role: newRole },
                { withCredentials: true }
            );
            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update role");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!confirm(`Are you sure you want to delete ${userName}?`)) return;
        setUpdatingId(userId);
        try {
            await axios.delete(`${API}/users/${userId}`, { withCredentials: true });
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete user");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const roleBadgeColor = (role) => {
        if (role === "admin") return "bg-purple-500/10 text-purple-400";
        if (role === "librarian") return "bg-emerald-500/10 text-emerald-400";
        return "bg-gray-500/10 text-gray-400";
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-1">Manage Users</h1>
                    <p className="text-gray-400 text-sm">
                        View, promote, or remove platform users
                    </p>
                </motion.div>

                {/* Search */}
                <div className="relative mb-6 max-w-sm">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#1e293b] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                    />
                </div>

                {/* Table */}
                <div className="bg-[#1e293b] rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-6 space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-14 bg-[#0f172a] rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-center text-gray-400 py-16">No users found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700 text-left text-gray-400">
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => {
                                        const isSelf = user._id === currentUser?.id;
                                        return (
                                            <tr
                                                key={user._id}
                                                className="border-b border-gray-800 hover:bg-[#0f172a]/50 transition"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={user.image || "https://i.ibb.co/placeholder.png"}
                                                            alt={user.name}
                                                            className="w-9 h-9 rounded-full object-cover border border-gray-700"
                                                        />
                                                        <span className="font-medium">
                                                            {user.name}
                                                            {isSelf && (
                                                                <span className="text-gray-500 text-xs ml-1">(you)</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <FiMail size={14} /> {user.email}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`text-xs px-3 py-1 rounded-full font-medium ${roleBadgeColor(
                                                            user.role
                                                        )}`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <select
                                                            value={user.role}
                                                            disabled={isSelf || updatingId === user._id}
                                                            onChange={(e) =>
                                                                handleRoleChange(user._id, e.target.value)
                                                            }
                                                            className="bg-[#0f172a] border border-gray-700 text-xs rounded-lg px-2 py-1.5 outline-none focus:border-emerald-400 disabled:opacity-40"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="librarian">Librarian</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDelete(user._id, user.name)}
                                                            disabled={isSelf || updatingId === user._id}
                                                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg disabled:opacity-30 transition"
                                                            title="Delete user"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}