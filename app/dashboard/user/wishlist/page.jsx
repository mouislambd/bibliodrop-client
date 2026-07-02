"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function WishlistPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/wishlist`, { withCredentials: true });
            setItems(res.data.items || []);
        } catch {
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (bookId) => {
        setRemovingId(bookId);
        try {
            await axios.delete(`${API}/wishlist/${bookId}`, { withCredentials: true });
            toast.success("Removed from wishlist!");
            setItems((prev) => prev.filter((item) => item.book?._id !== bookId));
        } catch {
            toast.error("Failed to remove!");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-1">My Wishlist</h1>
                    <p className="text-gray-400 text-sm">Books you want to read later</p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-[#1e293b] rounded-xl h-64 animate-pulse" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-[#1e293b] rounded-2xl p-16 text-center">
                        <p className="text-gray-400 mb-4">Your wishlist is empty.</p>
                        <Link
                            href="/browse"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full text-sm transition"
                        >
                            Browse Books
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item, i) => {
                            const book = item.book;
                            if (!book) return null;
                            return (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative"
                                >
                                    <button
                                        onClick={() => handleRemove(book._id)}
                                        disabled={removingId === book._id}
                                        className="absolute top-2 right-2 z-10 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full transition"
                                        title="Remove from wishlist"
                                    >
                                        <FiTrash2 size={12} />
                                    </button>
                                    <Link href={`/books/${book._id}`}>
                                        <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="w-full h-52 object-cover"
                                            />
                                            <div className="p-4 flex flex-col flex-1">
                                                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full w-fit mb-2">
                                                    {book.category}
                                                </span>
                                                <h3 className="font-semibold text-sm line-clamp-2 flex-1">{book.title}</h3>
                                                <p className="text-gray-400 text-xs mt-1">{book.author}</p>
                                                <p className="text-emerald-400 font-bold mt-2">৳{book.deliveryFee}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}