"use client";
import { motion } from "framer-motion";
import { FiBookOpen, FiTruck, FiUsers } from "react-icons/fi";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold mb-4">
                        About <span className="text-emerald-400">BiblioDrop</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        BiblioDrop connects avid readers and students with local libraries
                        and independent book owners for doorstep delivery.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            icon: FiBookOpen,
                            title: "Vast Collection",
                            desc: "Browse thousands of books from local libraries and independent owners across categories.",
                        },
                        {
                            icon: FiTruck,
                            title: "Doorstep Delivery",
                            desc: "Request delivery and receive your favorite books right at your doorstep.",
                        },
                        {
                            icon: FiUsers,
                            title: "Community Driven",
                            desc: "Empowering local librarians to reach a wider audience and serve more readers.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#1e293b] rounded-2xl p-6 text-center"
                        >
                            <item.icon className="text-emerald-400 mx-auto mb-4" size={36} />
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#1e293b] rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Traditional library systems require physical visits, which can be a
                        barrier for busy professionals or remote students. BiblioDrop
                        democratizes access to books, enables local libraries to reach a
                        wider audience, and provides a secure, streamlined borrowing
                        experience for everyone.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}