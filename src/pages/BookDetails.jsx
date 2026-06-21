import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import ReviewForm from "../components/ReviewForm";

const BookDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookRes, reviewRes] = await Promise.all([
                    axiosInstance.get(`/books/${id}`),
                    axiosInstance.get(`/reviews/${id}`),
                ]);
                setBook(bookRes.data.book);
                setReviews(reviewRes.data.reviews);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleRequestDelivery = async () => {
        if (!user) {
            navigate("/login", { state: { from: { pathname: `/books/${id}` } } });
            return;
        }
        setRequesting(true);
        try {
            const res = await axiosInstance.post("/deliveries/create-checkout-session", { bookId: id });
            window.location.href = res.data.url;
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setRequesting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Book not found</p>
            </div>
        );
    }

    const isOwner = user && book.librarian?._id === user.id;
    const disabled = book.isCheckedOut || isOwner;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
                <div className="grid md:grid-cols-2 gap-10">
                    <img src={book.coverImage} alt={book.title} className="w-full h-96 object-cover rounded-xl shadow-md" />

                    <div>
                        <h1 className="text-3xl font-heading font-bold text-primary mb-2">{book.title}</h1>
                        <p className="text-gray-500 mb-4">by {book.author}</p>
                        <p className="text-gray-700 mb-4">{book.description}</p>

                        <div className="space-y-2 mb-6">
                            <p><span className="font-semibold">Category:</span> {book.category}</p>
                            <p><span className="font-semibold">Delivery Fee:</span> ${book.deliveryFee}</p>
                            <p><span className="font-semibold">Status:</span>{" "}
                                <span className={book.isCheckedOut ? "text-red-500" : "text-green-600"}>
                                    {book.isCheckedOut ? "Checked Out" : "Available"}
                                </span>
                            </p>
                            <p><span className="font-semibold">Added:</span> {new Date(book.createdAt).toLocaleDateString()}</p>
                        </div>

                        <button
                            onClick={handleRequestDelivery}
                            disabled={disabled || requesting}
                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {requesting ? "Processing..." : isOwner ? "You own this book" : book.isCheckedOut ? "Unavailable" : "Request Delivery"}
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-heading font-bold text-primary mb-6">Reviews</h2>
                    {user && (
                        <ReviewForm bookId={id} onReviewAdded={(newReview) => setReviews([...reviews, newReview])} />
                    )}
                    {reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
                                    <img src={review.user.photo || "https://i.pravatar.cc/100"} alt={review.user.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{review.user.name}</p>
                                        <p className="text-yellow-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                                        <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookDetails;