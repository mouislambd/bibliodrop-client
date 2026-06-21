import { useState } from "react";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const ReviewForm = ({ bookId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post("/reviews", { bookId, rating, comment });
            toast.success("Review added!");
            onReviewAdded(res.data.review);
            setComment("");
            setRating(5);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="font-semibold mb-3">Write a Review</h3>
            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border rounded-lg px-3 py-2"
                >
                    {[5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>{n} ★</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Write your review..."
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
};

export default ReviewForm;