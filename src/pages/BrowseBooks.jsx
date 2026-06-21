import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import BookCard from "../components/books/BookCard";
import axiosInstance from "../utils/axios";

const BrowseBooks = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const page = Number(searchParams.get("page")) || 1;
    const category = searchParams.get("category") || "";

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const params = { page, limit: 9 };
                if (search) params.search = search;
                if (category) params.category = category;

                const res = await axiosInstance.get("/books", { params });
                setBooks(Array.isArray(res.data.books) ? res.data.books : []);
                setTotalPages(res.data.totalPages || 1);
            } catch (error) {
                console.error(error);
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [page, category, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ page: 1, ...(category && { category }) });
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage, ...(category && { category }) });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
                <h1 className="text-3xl font-heading font-bold text-primary mb-6">Browse Books</h1>

                <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        placeholder="Search by book name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition">
                        Search
                    </button>
                </form>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-gray-200 animate-pulse h-72 rounded-xl"></div>
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <p className="text-center text-gray-500 py-20">No books found matching your filters.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-4 py-2 rounded-lg ${page === i + 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default BrowseBooks;