"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiBookOpen, FiUser, FiBook } from "react-icons/fi";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ChooseRolePage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [selecting, setSelecting] = useState(false);

    useEffect(() => {
        if (!isPending && !session?.user) {
            router.replace("/login");
        }
    }, [session, isPending]);

    const handleRoleSelect = async (role) => {
        setSelecting(true);
        try {
            await axios.patch(
                `${API}/users/update-role`,
                { email: session.user.email, role },
                { withCredentials: true }
            );
            toast.success(`Role set as ${role}!`);
            if (role === "librarian") {
                router.push("/dashboard/librarian");
            } else {
                router.push("/");
            }
        } catch {
            toast.error("Failed to set role!");
        } finally {
            setSelecting(false);
        }
    };

    if (isPending || !session?.user) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
            <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-md shadow-2xl text-white text-center">

                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-2xl mb-2">
                    <FiBookOpen size={28} />
                    BiblioDrop
                </div>

                <p className="text-gray-400 text-sm mb-8">
                    Welcome, <span className="text-white font-semibold">{session.user.name}</span>! <br />
                    Please choose your role to continue.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    {/* User Role */}
                    <button
                        onClick={() => handleRoleSelect("user")}
                        disabled={selecting}
                        className="bg-[#0f172a] hover:bg-emerald-500/20 border-2 border-gray-700 hover:border-emerald-400 rounded-2xl p-6 flex flex-col items-center gap-3 transition group disabled:opacity-50"
                    >
                        <FiUser size={36} className="text-emerald-400" />
                        <div>
                            <p className="font-semibold group-hover:text-emerald-400 transition">Reader</p>
                            <p className="text-gray-400 text-xs mt-1">Browse & request book delivery</p>
                        </div>
                    </button>

                    {/* Librarian Role */}
                    <button
                        onClick={() => handleRoleSelect("librarian")}
                        disabled={selecting}
                        className="bg-[#0f172a] hover:bg-blue-500/20 border-2 border-gray-700 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center gap-3 transition group disabled:opacity-50"
                    >
                        <FiBook size={36} className="text-blue-400" />
                        <div>
                            <p className="font-semibold group-hover:text-blue-400 transition">Librarian</p>
                            <p className="text-gray-400 text-xs mt-1">List books & manage deliveries</p>
                        </div>
                    </button>
                </div>

                {selecting && (
                    <p className="text-gray-400 text-sm mt-6 animate-pulse">Setting up your account...</p>
                )}
            </div>
        </div>
    );
}