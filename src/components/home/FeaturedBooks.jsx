import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axios";

const FeaturedBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axiosInstance.get("/books/featured");
                setBooks(Array.isArray(res.data.books) ? res.data.books : []);
            } catch (error) {
                console.error(error);
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary text-center mb-10">Featured Books</h2>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-xl"></div>
                    ))}
                </div>
            ) : books.length === 0 ? (
                <p className="text-center text-gray-500">No featured books yet.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {books.map((book, i) => (
                        <motion.div
                            key={book._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link to={`/books/${book._id}`} className="block group">
                                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition relative">
                                    <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                                    {book.isCheckedOut && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            Unavailable
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold mt-2 text-sm truncate">{book.title}</h3>
                                <p className="text-xs text-gray-500">{book.category}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeaturedBooks;