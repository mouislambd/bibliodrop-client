import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axios";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";

const MyWishlist = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await axiosInstance.get("/wishlist");
            setItems(res.data.items);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (bookId) => {
        try {
            await axiosInstance.delete(`/wishlist/${bookId}`);
            toast.success("Removed from wishlist");
            setItems(items.filter((item) => item.book._id !== bookId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove");
        }
    };

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">My Wishlist</h2>

            {items.length === 0 ? (
                <p className="text-gray-500">Your wishlist is empty. Browse books and tap the heart icon to save them here.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden relative">
                            <button
                                onClick={() => handleRemove(item.book._id)}
                                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-50"
                            >
                                <FaHeart className="text-red-500" />
                            </button>
                            <Link to={`/books/${item.book._id}`}>
                                <img src={item.book.coverImage} alt={item.book.title} className="w-full h-48 object-cover" />
                                <div className="p-3">
                                    <h3 className="font-semibold truncate">{item.book.title}</h3>
                                    <p className="text-sm text-gray-500">{item.book.category}</p>
                                    <p className="text-secondary font-bold mt-1">${item.book.deliveryFee} delivery</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyWishlist;