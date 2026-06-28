"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { FiSearch, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL;

const categories = ["All", "Fiction", "Sci-Fi", "Academic", "History", "Mystery", "Biography"];

export default function BrowsePage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [availability, setAvailability] = useState("All");
    const [minFee, setMinFee] = useState("");
    const [maxFee, setMaxFee] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const searchParams = useSearchParams();

    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) setCategory(cat);
    }, [searchParams]);

    useEffect(() => {
        fetchBooks();
    }, [search, category, availability, minFee, maxFee, page]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 8,
                search,
                category: category === "All" ? "" : category,
                availability: availability === "All" ? "" : availability,
                minFee,
                maxFee,
            };
            const res = await axios.get(`${API}/books`, { params });
            setBooks(res.data.books || res.data);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-bold mb-2">
                        Browse <span className="text-emerald-400">Books</span>
                    </h1>
                    <p className="text-gray-400">Explore our collection and request delivery</p>
                </motion.div>

                {/* Search & Filters */}
                <div className="bg-[#1e293b] rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative lg:col-span-2">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-[#0f172a] text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    {/* Category */}
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Availability */}
                    <select
                        value={availability}
                        onChange={(e) => { setAvailability(e.target.value); setPage(1); }}
                        className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                    >
                        <option value="All">All Status</option>
                        <option value="available">Available</option>
                        <option value="checkedout">Checked Out</option>
                    </select>

                    {/* Fee Range */}
                    <input
                        type="number"
                        placeholder="Min Fee (৳)"
                        value={minFee}
                        onChange={(e) => { setMinFee(e.target.value); setPage(1); }}
                        className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Max Fee (৳)"
                        value={maxFee}
                        onChange={(e) => { setMaxFee(e.target.value); setPage(1); }}
                        className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                    />
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-[#1e293b] rounded-xl h-72 animate-pulse" />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No books found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book, i) => (
                            <motion.div
                                key={book._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link href={`/books/${book._id}`}>
                                    <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                                        <div className="relative">
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="w-full h-52 object-cover"
                                            />
                                            {book.status === "checkedout" && (
                                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                    Unavailable
                                                </span>
                                            )}
                                        </div>
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
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-[#1e293b] rounded-lg text-sm disabled:opacity-40 hover:bg-emerald-500 transition"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-4 py-2 rounded-lg text-sm transition ${page === i + 1
                                        ? "bg-emerald-500 text-white"
                                        : "bg-[#1e293b] hover:bg-emerald-500/30"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-[#1e293b] rounded-lg text-sm disabled:opacity-40 hover:bg-emerald-500 transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}