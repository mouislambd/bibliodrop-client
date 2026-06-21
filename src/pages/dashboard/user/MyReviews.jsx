import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import toast from "react-hot-toast";

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ rating: 5, comment: "" });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axiosInstance.get("/reviews/user/my-reviews");
            setReviews(res.data.reviews);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (review) => {
        setEditingId(review._id);
        setEditData({ rating: review.rating, comment: review.comment });
    };

    const handleUpdate = async (id) => {
        try {
            await axiosInstance.put(`/reviews/${id}`, editData);
            toast.success("Review updated");
            setEditingId(null);
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await axiosInstance.delete(`/reviews/${id}`);
            toast.success("Review deleted");
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">My Reviews</h2>

            {reviews.length === 0 ? (
                <p className="text-gray-500">You haven't left any reviews yet.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
                            <img src={review.book?.coverImage} alt={review.book?.title} className="w-16 h-20 object-cover rounded" />
                            <div className="flex-1">
                                <p className="font-semibold">{review.book?.title}</p>

                                {editingId === review._id ? (
                                    <div className="mt-2 space-y-2">
                                        <select
                                            value={editData.rating}
                                            onChange={(e) => setEditData({ ...editData, rating: Number(e.target.value) })}
                                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                                        >
                                            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} Star</option>)}
                                        </select>
                                        <textarea
                                            value={editData.comment}
                                            onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                            rows={2}
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdate(review._id)} className="bg-primary text-white px-3 py-1 rounded text-sm">Save</button>
                                            <button onClick={() => setEditingId(null)} className="bg-gray-200 px-3 py-1 rounded text-sm">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-yellow-500 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                                        <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                                        <div className="flex gap-3 mt-2">
                                            <button onClick={() => startEdit(review)} className="text-secondary text-sm hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(review._id)} className="text-red-500 text-sm hover:underline">Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviews;