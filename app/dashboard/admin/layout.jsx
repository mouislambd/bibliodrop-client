"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
    FiGrid, FiCheckSquare, FiUsers, FiBook, FiDollarSign, FiMenu,
} from "react-icons/fi";
import { useState, useEffect } from "react";

const ADMIN_EMAIL = "admin@gmail.com";

const links = [
    { href: "/dashboard/admin", label: "Overview", icon: <FiGrid /> },
    { href: "/dashboard/admin/approval", label: "Book Approval", icon: <FiCheckSquare /> },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: <FiUsers /> },
    { href: "/dashboard/admin/books", label: "Manage Books", icon: <FiBook /> },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: <FiDollarSign /> },
];

export default function AdminDashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (isPending) return;
        if (!session?.user || session.user.email !== ADMIN_EMAIL) {
            router.replace("/");
        }
    }, [session, isPending]);

    if (isPending || !session?.user) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (session.user.email !== ADMIN_EMAIL) return null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex">

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#1e293b] transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
                {/* Profile */}
                <div className="p-6 border-b border-gray-700">
                    <img
                        src={session?.user?.image || "https://i.pravatar.cc/100"}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border-2 border-red-400 mb-3"
                    />
                    <p className="font-semibold text-sm">{session?.user?.name}</p>
                    <p className="text-red-400 text-xs">Administrator</p>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${pathname === link.href
                                    ? "bg-red-500 text-white"
                                    : "text-gray-400 hover:bg-[#0f172a] hover:text-white"
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center gap-3 bg-[#1e293b] px-4 py-3 border-b border-gray-700">
                    <button onClick={() => setSidebarOpen(true)}>
                        <FiMenu size={22} />
                    </button>
                    <span className="font-semibold">Admin Dashboard</span>
                </div>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>

        </div>
    );
}