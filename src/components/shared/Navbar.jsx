import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
    };

    const navLinkClass = ({ isActive }) =>
        `font-medium transition ${isActive ? "text-accent" : "text-white hover:text-accent"}`;

    return (
        <nav className="bg-primary sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-heading font-bold text-white">
                    📚 BiblioDrop
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/" className={navLinkClass}>Home</NavLink>
                    <NavLink to="/books" className={navLinkClass}>Browse Books</NavLink>
                    {user && (
                        <NavLink to={`/dashboard/${user.role}`} className={navLinkClass}>Dashboard</NavLink>
                    )}
                    {user ? (
                        <button onClick={handleLogout} className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                            Login
                        </Link>
                    )}
                </div>

                <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-primary px-4 pb-4 flex flex-col gap-4">
                    <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/books" className={navLinkClass} onClick={() => setMenuOpen(false)}>Browse Books</NavLink>
                    {user && (
                        <NavLink to={`/dashboard/${user.role}`} className={navLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                    )}
                    {user ? (
                        <button onClick={handleLogout} className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold w-fit">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold w-fit" onClick={() => setMenuOpen(false)}>
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;