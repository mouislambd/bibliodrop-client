"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiHeart, FiTrash2 } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = () => {
        axios.get(`${API}/wishlist`, { withCredentials: true })
            .then((res) => setWishlist(res.data.items || []))
            .catch(() => toast.error("Failed to load wishlist"))
            .finally(() => setLoading(false));
    };

    const handleRemove = async (bookId) => {
        try {
            await axios.delete(`${API}/wishlist/${bookId}`, { withCredentials: true });
            toast.success("Removed from wishlist!");
            fetchWishlist();
        } catch {
            toast.error("Failed to remove!");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FiHeart className="text-emerald-400" /> My Wishlist
            </h1>
            {wishlist.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl p-10 text-center text-gray-400">
                    <FiHeart size={40} className="mx-auto mb-3 text-gray-600" />
                    <p>Your wishlist is empty.</p>
                    <Link href="/browse" className="text-emerald-400 hover:underline text-sm mt-2 inline-block">
                        Browse Books
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlist.map((item) => (
                        <div key={item._id} className="bg-[#1e293b] rounded-xl overflow-hidden group relative">
                            <Link href={`/books/${item.book?._id}`}>
                                <img
                                    src={item.book?.coverImage || "https://i.pravatar.cc/300"}
                                    alt={item.book?.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-3">
                                    <h3 className="font-semibold text-sm truncate">{item.book?.title}</h3>
                                    <p className="text-emerald-400 text-sm font-bold mt-1">৳{item.book?.deliveryFee}</p>
                                </div>
                            </Link>
                            <button
                                onClick={() => handleRemove(item.book?._id)}
                                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full transition"
                            >
                                <FiTrash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}