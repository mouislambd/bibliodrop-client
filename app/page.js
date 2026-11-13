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

const guides = [
  { title: "How to Choose a Book", description: "Learn how to find the perfect book for your next read.", icon: "📖" },
  { title: "Reading Habits", description: "Tips to help you read more consistently every day.", icon: "⏰" },
  { title: "Library Etiquette", description: "Everything you need to know about borrowing responsibly.", icon: "🤝" },
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
      <section className="min-h-[90vh] w-full bg-cover bg-center relative" style={{ backgroundImage: "url('/hero.png')" }}>
        <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-[1px]"></div>
        <div className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-gray-600 to-gray-800/20 text-gray-400 text-sm px-4 py-1 rounded-full mb-6 inline-block">
              📚 Books Delivered to Your Door
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your Local Library,{" "}
              <span className="text-gray-400">Delivered</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
              Browse thousands of books from local libraries and independent owners. Request delivery and enjoy reading from the comfort of your home.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold px-8 py-3 rounded-full transition text-lg"
            >
              Browse Books <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-10"
        >
          New <span className="text-gray-400">Arrivals</span>
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { id: "new-1", title: "The Midnight Library", author: "Matt Haig", image: "https://picsum.photos/400/600?random=10" },
            { id: "new-2", title: "Project Hail Mary", author: "Andy Weir", image: "https://picsum.photos/400/600?random=11" },
            { id: "new-3", title: "Klara and the Sun", author: "Kazuo Ishiguro", image: "https://picsum.photos/400/600?random=12" },
            { id: "new-4", title: "The Vanishing Half", author: "Brit Bennett", image: "https://picsum.photos/400/600?random=13" },
          ].map((book, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/books/${book.id}/read`}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-translate-y-2">
                    <img 
                      src={book.image} 
                      alt={book.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Book+Cover';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-sm">{book.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{book.author}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Section: Trending Books */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-[#1e293b] rounded-2xl my-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-10"
        >
          Trending <span className="text-gray-400">Books</span>
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { id: "667e5a0e5f2b8a001a1d1d11", title: "The Great Gatsby", author: "F. Scott Fitzgerald", image: "https://picsum.photos/400/600?random=1" },
            { id: "667e5a0e5f2b8a001a1d1d12", title: "1984", author: "George Orwell", image: "https://picsum.photos/400/600?random=2" },
            { id: "667e5a0e5f2b8a001a1d1d13", title: "To Kill a Mockingbird", author: "Harper Lee", image: "https://picsum.photos/400/600?random=3" },
            { id: "667e5a0e5f2b8a001a1d1d14", title: "Pride and Prejudice", author: "Jane Austen", image: "https://picsum.photos/400/600?random=4" },
          ].map((book, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0f172a] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <Link href={`/books/${book.id}`}>
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-40 object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Book+Cover';
                  }}
                />
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                  <p className="text-gray-400 text-xs">{book.author}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-10"
        >
          Featured <span className="text-gray-400">Books</span>
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
                      src={book.coverImage?.startsWith('http') ? book.coverImage : `${API}${book.coverImage}`}
                      alt={book.title}
                      className="w-full h-48 object-cover bg-[#0f172a]"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Book+Cover';
                      }}
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                      <p className="text-gray-400 text-xs">{book.author}</p>
                      <p className="text-gray-400 text-sm font-bold mt-1">৳{book.deliveryFee}</p>
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
            Top <span className="text-gray-400">Librarians</span>
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
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-400 bg-[#1e293b]"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/100x100?text=User';
                  }}
                />
                <h3 className="font-semibold text-lg">{lib.name}</h3>
                <p className="text-gray-400 text-sm">{lib.deliveries} deliveries completed</p>
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
          Popular <span className="text-gray-400">Categories</span>
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
                className="bg-[#1e293b] hover:bg-gradient-to-r from-gray-600 to-gray-800/20 border border-gray-700 hover:border-gray-400 rounded-xl p-6 flex flex-col items-center gap-3 transition group"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-sm font-medium group-hover:text-gray-400 transition">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reading Guides */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-10"
        >
          Reading <span className="text-gray-400">Guides</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#1e293b] rounded-xl p-6 border border-gray-700 hover:border-gray-400 transition"
            >
              <div className="text-4xl mb-4">{guide.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
              <p className="text-gray-400 text-sm">{guide.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
