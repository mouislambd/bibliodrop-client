"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import {
    FiArrowLeft, FiCalendar, FiUser, FiEdit2, FiTrash2, FiEyeOff, FiEye,
} from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function BookDetailsPage({ params }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const router = useRouter();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [requestingDelivery, setRequestingDelivery] = useState(false);
    const [canReview, setCanReview] = useState(false);

    useEffect(() => {
        fetchBook();
        fetchReviews();
    }, [id]);

    useEffect(() => {
        if (session?.user) checkCanReview();
    }, [session, id]);

    const fetchBook = async () => {
        try {
            const res = await axios.get(`${API}/books/${id}`);
            setBook(res.data.book || res.data);
        } catch {
            toast.error("Book not found!");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API}/reviews/${id}`);
            setReviews(res.data.reviews || []);
        } catch { }
    };
   

    const checkCanReview = async () => {
        try {
            const res = await axios.get(`${API}/deliveries/can-review/${id}`, { withCredentials: true });
            setCanReview(res.data.canReview);
        } catch { }
    };

    const handleDeliveryRequest = async () => {
        if (!session?.user) {
            toast.error("Please login first!");
            router.push("/login");
            return;
        }
        setRequestingDelivery(true);
        try {
            const res = await axios.post(
                `${API}/deliveries/checkout`,
                { bookId: id },
                { withCredentials: true }
            );
            if (res.data.url) window.location.href = res.data.url;
        } catch {
            toast.error("Failed to initiate delivery request!");
        } finally {
            setRequestingDelivery(false);
        }
    };

    const handleReviewSubmit = async () => {
        if (!comment.trim()) {
            toast.error("Please write a comment!");
            return;
        }
        setSubmittingReview(true);
        try {
            await axios.post(
                `${API}/reviews`,
                { bookId: id, rating, comment },
                { withCredentials: true }
            );
            toast.success("Review submitted!");
            setComment("");
            setRating(5);
            fetchReviews();
        } catch {
            toast.error("Failed to submit review!");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this book?")) return;
        try {
            await axios.delete(`${API}/books/${id}`, { withCredentials: true });
            toast.success("Book deleted!");
            router.push("/browse");
        } catch {
            toast.error("Failed to delete!");
        }
    };

    const handleUnpublish = async () => {
        try {
            await axios.patch(`${API}/books/${id}/unpublish`, {}, { withCredentials: true });
            toast.success("Book unpublished!");
            fetchBook();
        } catch {
            toast.error("Failed!");
        }
    };

    const isOwner = session?.user?.id === book?.librarianId;
    const isAdmin = session?.user?.role === "admin";
    const isCheckedOut = book?.status === "checkedout";

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!book) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
            <p>Book not found.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">
            <div className="max-w-5xl mx-auto">

                {/* Back */}
                <Link href="/browse" className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 mb-8 transition">
                    <FiArrowLeft /> Back to Browse
                </Link>

                {/* Book Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12"
                >
                    {/* Cover */}
                    <div className="relative">
                        <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl object-cover"
                        />
                        {isCheckedOut && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                                Checked Out
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">
                        <span className="text-emerald-400 text-sm bg-emerald-400/10 px-3 py-1 rounded-full w-fit mb-4">
                            {book.category}
                        </span>
                        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                        <p className="text-gray-400 flex items-center gap-2 mb-1">
                            <FiUser size={14} /> {book.author}
                        </p>
                        <p className="text-gray-400 flex items-center gap-2 mb-4">
                            <FiCalendar size={14} /> {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300 leading-relaxed mb-6">{book.description}</p>
                        <p className="text-3xl font-bold text-emerald-400 mb-6">৳{book.deliveryFee}</p>

                        {/* Actions */}
                        <div className="flex gap-3 flex-wrap">
                            {!isOwner && !isAdmin && (
                                <button
                                    onClick={handleDeliveryRequest}
                                    disabled={isCheckedOut || requestingDelivery}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {requestingDelivery ? "Processing..." : isCheckedOut ? "Unavailable" : "Request Delivery"}
                                </button>
                            )}

                            {(isOwner || isAdmin) && (
                                <>
                                    <Link
                                        href={`/books/${id}/edit`}
                                        className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-3 rounded-xl hover:bg-blue-500/30 transition"
                                    >
                                        <FiEdit2 /> Edit
                                    </Link>
                                    {book.status === "Published" && (
                                        <button
                                            onClick={handleUnpublish}
                                            className="flex items-center gap-2 bg-gray-700 text-gray-300 px-4 py-3 rounded-xl hover:bg-gray-600 transition"
                                        >
                                            <FiEyeOff /> Unpublish
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-3 rounded-xl hover:bg-red-500/30 transition"
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Reviews */}
                <div className="bg-[#1e293b] rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">Reviews ({reviews.length})</h2>

                    {/* Review Form */}
                    {canReview && (
                        <div className="bg-[#0f172a] rounded-xl p-4 mb-6">
                            <h3 className="font-semibold mb-3">Leave a Review</h3>
                            <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setRating(star)}>
                                        {star <= rating
                                            ? <FaStar className="text-yellow-400 text-xl" />
                                            : <FaRegStar className="text-gray-500 text-xl" />
                                        }
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your review..."
                                rows={3}
                                className="w-full bg-[#1e293b] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm mb-3"
                            />
                            <button
                                onClick={handleReviewSubmit}
                                disabled={submittingReview}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm transition disabled:opacity-50"
                            >
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <p className="text-gray-400 text-sm">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-[#0f172a] rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={review.userImage || "https://i.pravatar.cc/40"}
                                            alt={review.userName}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium text-sm">{review.userName}</p>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    star <= review.rating
                                                        ? <FaStar key={star} className="text-yellow-400 text-xs" />
                                                        : <FaRegStar key={star} className="text-gray-500 text-xs" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}