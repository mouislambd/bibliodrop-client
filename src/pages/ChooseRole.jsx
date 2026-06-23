import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, authClient } from "../utils/auth-client";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const ChooseRole = () => {
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const navigate = useNavigate();

    const handleChoose = async () => {
        if (!selected) {
            toast.error("Please select a role");
            return;
        }
        const email = session?.user?.email;
        if (!email) {
            toast.error("No user found");
            return;
        }
        setLoading(true);
        try {
            await axiosInstance.patch("/users/update-role", { email, role: selected });
            toast.success("Role updated! Please login again.");
            await authClient.signOut();
            window.location.href = "/login";
        } catch (error) {
            toast.error("Failed to set role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-3xl font-heading font-bold text-primary mb-2">Choose Your Role</h2>
                <p className="text-gray-500 mb-8">How will you use BiblioDrop?</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div
                        onClick={() => setSelected("user")}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition ${selected === "user" ? "border-primary bg-primary/10" : "border-gray-200 hover:border-primary"}`}
                    >
                        <div className="text-4xl mb-2">📚</div>
                        <h3 className="font-bold text-lg">Reader</h3>
                        <p className="text-sm text-gray-500">Browse and borrow books</p>
                    </div>
                    <div
                        onClick={() => setSelected("librarian")}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition ${selected === "librarian" ? "border-primary bg-primary/10" : "border-gray-200 hover:border-primary"}`}
                    >
                        <div className="text-4xl mb-2">🏛️</div>
                        <h3 className="font-bold text-lg">Librarian</h3>
                        <p className="text-sm text-gray-500">List and manage books</p>
                    </div>
                </div>

                <button
                    onClick={handleChoose}
                    disabled={loading || !selected}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default ChooseRole;