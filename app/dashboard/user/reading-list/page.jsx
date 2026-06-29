"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ReadingListPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/deliveries/my`, { withCredentials: true })
            .then((res) => {
                const delivered = (res.data || []).filter((d) => d.status === "Delivered");
                setBooks(delivered);
            })
            .catch(() => toast.error("Failed to load reading list"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Reading List</h1>
            {books.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl p-10 text-center text-gray-400">
                    No books delivered yet.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {books.map((d) => (
                        <Link key={d._id} href={`/books/${d.bookId}`}>
                            <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                                <img
                                    src={d.bookCover || "https://i.ibb.co/placeholder.png"}
                                    alt={d.bookTitle}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-3">
                                    <h3 className="font-semibold text-sm truncate">{d.bookTitle}</h3>
                                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                                        Delivered
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}