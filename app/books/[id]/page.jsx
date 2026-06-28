"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import {
    FiArrowLeft,
    FiCalendar,
    FiUser,
    FiEdit2,
    FiTrash2,
    FiEyeOff,
    FiEye,
} from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function BookDetailsPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const [requesting, setRequesting] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchBook();
        fetchReviews();
    }, [id]);

    const fetchBook = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/books/${id}`);
            setBook(res.data.book);
        } catch (err) {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const res = await axios.get(`${API}/reviews/book/${id}`);
            setReviews(res.data.reviews || []);
        } catch (err) {
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    const isOwner =
        user && book?.librarian && String(book.librarian._id) === String(user.id);

    const handleRequestDelivery = async () => {
        if (!user) {
            router.push("/login");
            return;
        }
        setRequesting(true);
        try {
            const res = await axios.post(
                `${API}/payments/create-checkout-session`,
                { bookId: book._id },
                { withCredentials: true }
            );
            window.location.href = res.data.url;
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong. Try again.");
        } finally {
            setRequesting(false);
        }
    };

    const handleTogglePublish = async () => {
        setActionLoading(true);
        try {
            const res = await axios.patch(
                `${API}/books/${book._id}/toggle-publish`,
                {},
                { withCredentials: true }
            );
            setBook(res.data.book);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this book?")) return;
        setActionLoading(true);
        try {
            await axios.delete(`${API}/books/${book._id}`, { withCredentials: true });
            router.push("/dashboard/librarian");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete book");
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] px-4 py-10">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 animate-pulse">
                    <div className="bg-[#1e293b] rounded-2xl h-[450px]" />
                    <div className="space-y-4">
                        <div className="h-8 bg-[#1e293b] rounded w-3/4" />
                        <div className="h-4 bg-[#1e293b] rounded w-1/2" />
                        <div className="h-24 bg-[#1e293b] rounded" />
                        <div className="h-10 bg-[#1e293b] rounded w-40" />
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !book) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white px-4">
                <h2 className="text-2xl font-bold mb-2">Book not found</h2>
                <p className="text-gray-400 mb-6">
                    The book you're looking for doesn't exist or was removed.
                </p>
                <Link
                    href="/browse"
                    className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-full text-sm"
                >
                    Back to Browse
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/browse"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 text-sm mb-8"
                >
                    <FiArrowLeft /> Back to Browse
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-2 gap-10"
                >
                    {/* Cover Image */}
                    <div className="relative">
                        <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-[450px] object-cover rounded-2xl"
                        />
                        {book.isCheckedOut && (
                            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                Checked Out
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full w-fit mb-3">
                            {book.category}
                        </span>
                        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                        <p className="text-gray-400 mb-4">by {book.author}</p>

                        <p className="text-gray-300 leading-relaxed mb-6">
                            {book.description}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                            <span className="flex items-center gap-1">
                                <FiUser /> {book.librarian?.name}
                            </span>
                            <span className="flex items-center gap-1">
                                <FiCalendar />{" "}
                                {new Date(book.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        <p className="text-2xl font-bold text-emerald-400 mb-6">
                            ৳{book.deliveryFee}{" "}
                            <span className="text-sm text-gray-400 font-normal">
                                delivery fee
                            </span>
                        </p>

                        {/* Request Delivery / Owner Controls */}
                        {isOwner ? (
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={`/dashboard/librarian/edit/${book._id}`}
                                    className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#293548] px-5 py-2.5 rounded-full text-sm"
                                >
                                    <FiEdit2 /> Edit
                                </Link>
                                <button
                                    onClick={handleTogglePublish}
                                    disabled={actionLoading || book.status === "pending_approval"}
                                    className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#293548] px-5 py-2.5 rounded-full text-sm disabled:opacity-40"
                                >
                                    {book.status === "published" ? <FiEyeOff /> : <FiEye />}
                                    {book.status === "published" ? "Unpublish" : "Publish"}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={actionLoading}
                                    className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-5 py-2.5 rounded-full text-sm"
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleRequestDelivery}
                                disabled={book.isCheckedOut || requesting}
                                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium w-fit transition"
                            >
                                {requesting
                                    ? "Processing..."
                                    : book.isCheckedOut
                                        ? "Currently Unavailable"
                                        : "Request Delivery"}
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Reviews */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-16"
                >
                    <h2 className="text-2xl font-bold mb-6">Reviews</h2>

                    {reviewsLoading ? (
                        <div className="space-y-3">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="bg-[#1e293b] rounded-xl h-20 animate-pulse" />
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <p className="text-gray-400">No reviews yet for this book.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-[#1e293b] rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={review.user?.image || "https://i.ibb.co/placeholder.png"}
                                                alt={review.user?.name}
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                            <span className="font-medium text-sm">
                                                {review.user?.name}
                                            </span>
                                        </div>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) =>
                                                i < review.rating ? (
                                                    <FaStar key={i} className="text-emerald-400" size={14} />
                                                ) : (
                                                    <FaRegStar key={i} className="text-gray-600" size={14} />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}