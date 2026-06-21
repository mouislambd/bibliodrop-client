import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import toast from "react-hot-toast";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get("/users");
            setUsers(res.data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await axiosInstance.patch(`/users/${id}/role`, { role });
            toast.success("Role updated");
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await axiosInstance.delete(`/users/${id}`);
            toast.success("User deleted");
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Manage Users</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left p-4">Name</th>
                            <th className="text-left p-4">Email</th>
                            <th className="text-left p-4">Role</th>
                            <th className="text-left p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-t border-gray-100">
                                <td className="p-4">{u.name}</td>
                                <td className="p-4">{u.email}</td>
                                <td className="p-4 capitalize">{u.role}</td>
                                <td className="p-4 space-x-2">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="user">User</option>
                                        <option value="librarian">Librarian</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:underline text-xs">
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

export default ManageUsers;