"use client";

import { useState } from "react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import toast from "react-hot-toast";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full">
                <h1 className="text-4xl font-heading font-bold text-primary mb-4 text-center">Contact Us</h1>
                <p className="text-gray-600 text-center max-w-xl mx-auto mb-12">
                    Have a question or feedback? We'd love to hear from you.
                </p>

                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <FaEnvelope className="text-secondary text-xl mt-1" />
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <p className="text-gray-500 text-sm">support@bibliodrop.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <FaPhone className="text-secondary text-xl mt-1" />
                            <div>
                                <h3 className="font-semibold">Phone</h3>
                                <p className="text-gray-500 text-sm">+880 1234-567890</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <FaMapMarkerAlt className="text-secondary text-xl mt-1" />
                            <div>
                                <h3 className="font-semibold">Address</h3>
                                <p className="text-gray-500 text-sm">Rangpur, Bangladesh</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                name="message" required rows={4}
                                value={formData.message} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition">
                            Send Message
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;