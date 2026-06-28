"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaBars, FaTimes, FaHome, FaBook, FaTruck, FaStar, FaUsers, FaChartBar, FaPlus, FaHeart } from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const userLinks = [
    { to: "/dashboard/user", label: "Overview", icon: <FaChartBar /> },
    { to: "/dashboard/user/history", label: "Delivery History", icon: <FaTruck /> },
    { to: "/dashboard/user/reading-list", label: "My Reading List", icon: <FaBook /> },
    { to: "/dashboard/user/wishlist", label: "My Wishlist", icon: <FaHeart /> },
    { to: "/dashboard/user/reviews", label: "My Reviews", icon: <FaStar /> },
  ];

  const librarianLinks = [
    { to: "/dashboard/librarian", label: "Overview", icon: <FaChartBar /> },
    { to: "/dashboard/librarian/add-book", label: "Add Book", icon: <FaPlus /> },
    { to: "/dashboard/librarian/inventory", label: "Manage Inventory", icon: <FaBook /> },
    { to: "/dashboard/librarian/deliveries", label: "Manage Deliveries", icon: <FaTruck /> },
  ];

  const adminLinks = [
    { to: "/dashboard/admin", label: "Overview", icon: <FaChartBar /> },
    { to: "/dashboard/admin/approvals", label: "Book Approval", icon: <FaBook /> },
    { to: "/dashboard/admin/users", label: "Manage Users", icon: <FaUsers /> },
    { to: "/dashboard/admin/books", label: "Manage Books", icon: <FaBook /> },
    { to: "/dashboard/admin/transactions", label: "Transactions", icon: <FaTruck /> },
  ];

  const links = user?.role === "admin" ? adminLinks : user?.role === "librarian" ? librarianLinks : userLinks;

  return (
    <div className="flex min-h-screen bg-light">
      <aside className={`fixed md:static top-0 left-0 h-full w-64 bg-primary text-white z-40 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <Link href="/" className="text-xl font-heading font-bold">📚 BiblioDrop</Link>
          <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <img src={user?.photo || "https://i.pravatar.cc/100"} alt={user?.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${pathname === link.to ? "bg-secondary text-white" : "hover:bg-white/10"
                }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition mt-4 border-t border-white/10 pt-4">
            <FaHome />
            <span>Back to Home</span>
          </Link>
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="flex-1 flex flex-col w-full">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between md:justify-end">
          <button className="md:hidden text-2xl text-primary" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <h1 className="font-semibold text-primary capitalize">{user?.role} Dashboard</h1>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
