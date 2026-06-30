"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            setUsers(data.users || []);
        } catch {
            toast.error("Could not load users");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            setActionId(id);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/role`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: newRole }),
                }
            );
            if (!res.ok) throw new Error();
            toast.success("Role updated");
            setUsers((prev) =>
                prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
            );
        } catch {
            toast.error("Could not update role");
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this user permanently?")) return;
        try {
            setActionId(id);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
                { method: "DELETE", credentials: "include" }
            );
            if (!res.ok) throw new Error();
            toast.success("User deleted");
            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch {
            toast.error("Delete failed");
        } finally {
            setActionId(null);
        }
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
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage Users</h1>

            <div className="overflow-x-auto bg-[#1e293b] rounded-xl">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-800 hover:bg-[#0f172a]">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-gray-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-red-500/20 text-red-400" :
                                            user.role === "librarian" ? "bg-blue-500/20 text-blue-400" :
                                                "bg-emerald-500/20 text-emerald-400"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2">
                                        {user.role !== "admin" && (
                                            <button
                                                disabled={actionId === user._id}
                                                onClick={() => handleRoleChange(user._id, "admin")}
                                                className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none"
                                            >
                                                Make Admin
                                            </button>
                                        )}
                                        {user.role !== "librarian" && (
                                            <button
                                                disabled={actionId === user._id}
                                                onClick={() => handleRoleChange(user._id, "librarian")}
                                                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none"
                                            >
                                                Make Librarian
                                            </button>
                                        )}
                                        <button
                                            disabled={actionId === user._id}
                                            onClick={() => handleDelete(user._id)}
                                            className="btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-none"
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