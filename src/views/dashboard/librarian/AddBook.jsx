"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import axiosInstance from "../../../utils/axios";
import toast from "react-hot-toast";

const AddBook = () => {
    const [formData, setFormData] = useState({
        title: "", author: "", description: "", category: "Fiction", deliveryFee: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please select a cover image");
            return;
        }
        setLoading(true);
        try {
            const form = new FormData();
            form.append("image", imageFile);
            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                form
            );
            const coverImage = imgRes.data.data.url;

            await axiosInstance.post("/books", { ...formData, coverImage });
            toast.success("Book submitted for approval!");
            router.push("/dashboard/librarian/inventory");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Add New Book</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text" name="title" required value={formData.title} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                        type="text" name="author" required value={formData.author} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description" required rows={4} value={formData.description} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category" value={formData.category} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            <option>Fiction</option>
                            <option>Sci-Fi</option>
                            <option>Academic</option>
                            <option>Mystery</option>
                            <option>Biography</option>
                            <option>Children</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee ($)</label>
                        <input
                            type="number" name="deliveryFee" required min="0" step="0.01"
                            value={formData.deliveryFee} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                    <input
                        type="file" accept="image/*" required
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
                <button
                    type="submit" disabled={loading}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Submit for Approval"}
                </button>
            </form>
        </div>
    );
};

export default AddBook;