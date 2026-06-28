"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;

const categories = [
  { name: "Fiction", icon: "📖" },
  { name: "Sci-Fi", icon: "🚀" },
  { name: "Academic", icon: "🎓" },
  { name: "History", icon: "🏛️" },
  { name: "Mystery", icon: "🔍" },
  { name: "Biography", icon: "👤" },
];

const topLibrarians = [
  { name: "Rafiq Ahmed", avatar: "https://i.pravatar.cc/100?img=1", deliveries: 142 },
  { name: "Nusrat Jahan", avatar: "https://i.pravatar.cc/100?img=2", deliveries: 98 },
  { name: "Karim Hossain", avatar: "https://i.pravatar.cc/100?img=3", deliveries: 87 },
];

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/books/featured`)
      .then((res) => setBooks(res.data.books))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0f172a] text-white">

      {/* Hero */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-emerald-500/20 text-emerald-400 text-sm px-4 py-1 rounded-full mb-6 inline-block">
            📚 Books Delivered to Your Door
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Your Local Library,{" "}
            <span className="text-emerald-400">Delivered</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Browse thousands of books from local libraries and independent owners. Request delivery and enjoy reading from the comfort of your home.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full transition text-lg"
          >
            Browse Books <FiArrowRight />
          </Link>
        </motion.div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-10"
        >
          Featured <span className="text-emerald-400">Books</span>
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1e293b] rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-400">No featured books available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book, i) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/books/${book._id}`}>
                  <div className="bg-[#1e293b] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 h-full">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                      <p className="text-gray-400 text-xs">{book.author}</p>
                      <p className="text-emerald-400 text-sm font-bold mt-1">৳{book.deliveryFee}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Top Librarians */}
      <section className="bg-[#1e293b] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-10"
          >
            Top <span className="text-emerald-400">Librarians</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topLibrarians.map((lib, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0f172a] rounded-xl p-6 text-center"
              >
                <img
                  src={lib.avatar}
                  alt={lib.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-emerald-400"
                />
                <h3 className="font-semibold text-lg">{lib.name}</h3>
                <p className="text-emerald-400 text-sm">{lib.deliveries} deliveries completed</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-10"
        >
          Popular <span className="text-emerald-400">Categories</span>
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/browse?category=${cat.name}`}
                className="bg-[#1e293b] hover:bg-emerald-500/20 border border-gray-700 hover:border-emerald-400 rounded-xl p-6 flex flex-col items-center gap-3 transition group"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-sm font-medium group-hover:text-emerald-400 transition">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}