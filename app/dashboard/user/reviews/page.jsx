"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function MyReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editReview, setEditReview] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(5);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        axios.get(`${API}/reviews/user/my-reviews`, { withCredentials: true })
            .then((res) => setReviews(res.data.reviews || []))
            .catch(() => toast.error("Failed to load reviews"))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this review?")) return;
        try {
            await axios.delete(`${API}/reviews/${id}`, { withCredentials: true });
            toast.success("Review deleted!");
            fetchReviews();
        } catch {
            toast.error("Failed to delete!");
        }
    };

    const handleEdit = async (id) => {
        try {
            await axios.put(`${API}/reviews/${id}`, {
                comment: editComment,
                rating: editRating,
            }, { withCredentials: true });
            toast.success("Review updated!");
            setEditReview(null);
            fetchReviews();
        } catch {
            toast.error("Failed to update!");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
            {reviews.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl p-10 text-center text-gray-400">
                    No reviews yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-[#1e293b] rounded-xl p-5">
                            {editReview === review._id ? (
                                <div className="space-y-3">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} onClick={() => setEditRating(star)}>
                                                {star <= editRating
                                                    ? <FaStar className="text-yellow-400 text-xl" />
                                                    : <FaRegStar className="text-gray-500 text-xl" />
                                                }
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                        rows={3}
                                        className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(review._id)}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm transition"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditReview(null)}
                                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-2">
                                            <p className="font-semibold text-sm">{review.book?.title}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditReview(review._id);
                                                    setEditComment(review.comment);
                                                    setEditRating(review.rating);
                                                }}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            star <= review.rating
                                                ? <FaStar key={star} className="text-yellow-400 text-xs" />
                                                : <FaRegStar key={star} className="text-gray-500 text-xs" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-sm">{review.comment}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}