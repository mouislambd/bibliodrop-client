"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { FiMenu, FiX, FiBookOpen } from "react-icons/fi";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    const user = session?.user;

    const getDashboardLink = () => {
        if (!user) return null;
        if (user.role === "admin") return "/dashboard/admin";
        if (user.role === "librarian") return "/dashboard/librarian";
        return "/dashboard/user";
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/browse", label: "Browse Books" },
    ];

    const isActive = (href) => pathname === href;

    return (
        <nav className="bg-[#0f172a] text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-emerald-400">
                    <FiBookOpen size={24} />
                    BiblioDrop
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition hover:text-emerald-400 ${isActive(link.href) ? "text-emerald-400 border-b-2 border-emerald-400 pb-1" : "text-gray-300"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user && getDashboardLink() && (
                        <Link
                            href={getDashboardLink()}
                            className={`text-sm font-medium transition hover:text-emerald-400 ${pathname.startsWith("/dashboard") ? "text-emerald-400" : "text-gray-300"
                                }`}
                        >
                            Dashboard
                        </Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={user.image || "https://i.ibb.co/placeholder.png"}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400"
                            />
                            <button
                                onClick={() => signOut()}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-1.5 rounded-full transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-1.5 rounded-full transition"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden text-gray-300"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-[#1e293b] px-4 pb-4 flex flex-col gap-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm font-medium py-2 transition hover:text-emerald-400 ${isActive(link.href) ? "text-emerald-400" : "text-gray-300"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user && getDashboardLink() && (
                        <Link
                            href={getDashboardLink()}
                            onClick={() => setMenuOpen(false)}
                            className="text-sm font-medium py-2 text-gray-300 hover:text-emerald-400"
                        >
                            Dashboard
                        </Link>
                    )}

                    {user ? (
                        <button
                            onClick={() => { signOut(); setMenuOpen(false); }}
                            className="bg-emerald-500 text-white text-sm px-4 py-2 rounded-full text-left"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className="bg-emerald-500 text-white text-sm px-4 py-2 rounded-full"
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}