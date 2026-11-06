"use client";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold mb-4">
                        Contact <span className="text-gray-400">Us</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Have questions? We'd love to hear from you.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {[
                            { icon: FiMail, label: "Email", value: "support@bibliodrop.com" },
                            { icon: FiPhone, label: "Phone", value: "+880 1700-000000" },
                            { icon: FiMapPin, label: "Address", value: "Dhaka, Bangladesh" },
                        ].map((item, i) => (
                            <div key={i} className="bg-[#1e293b] rounded-2xl p-6 flex items-center gap-4">
                                <item.icon className="text-gray-400 flex-shrink-0" size={24} />
                                <div>
                                    <p className="text-gray-400 text-sm">{item.label}</p>
                                    <p className="font-medium">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#1e293b] rounded-2xl p-6"
                    >
                        <h2 className="text-xl font-bold mb-6">Send a Message</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-gray-400 outline-none text-sm"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-gray-400 outline-none text-sm"
                            />
                            <textarea
                                placeholder="Your Message"
                                rows={4}
                                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-gray-400 outline-none text-sm"
                            />
                            <button className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition">
                                Send Message
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
