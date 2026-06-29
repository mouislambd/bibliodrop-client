"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const categories = ["Fiction", "Sci-Fi", "Academic", "History", "Mystery", "Biography"];

export default function AddBookPage() {
    const [form, setForm] = useState({
        title: "", author: "", description: "",
        deliveryFee: "", category: "Fiction",
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!imageFile) return null;
        const data = new FormData();
        data.append("image", imageFile);
        const res = await axios.post(
            `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, data
        );
        return res.data.data.url;
    };

    const handleSubmit = async () => {
        if (!form.title || !form.author || !form.description || !form.deliveryFee) {
            toast.error("Please fill all fields!");
            return;
        }
        if (!imageFile) {
            toast.error("Please upload a book cover!");
            return;
        }
        setSubmitting(true);
        try {
            const coverImage = await uploadImage();
            await axios.post(`${API}/books`, {
                ...form,
                coverImage,
                deliveryFee: Number(form.deliveryFee),
            }, { withCredentials: true });
            toast.success("Book submitted for approval!");
            setForm({ title: "", author: "", description: "", deliveryFee: "", category: "Fiction" });
            setImageFile(null);
            setPreview(null);
        } catch {
            toast.error("Failed to submit book!");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
            <div className="bg-[#1e293b] rounded-2xl p-6 max-w-2xl">

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">Book Cover *</label>
                    <div
                        className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition"
                        onClick={() => document.getElementById("coverInput").click()}
                    >
                        {preview ? (
                            <img src={preview} alt="preview" className="w-32 h-44 object-cover mx-auto rounded-lg" />
                        ) : (
                            <div className="text-gray-400">
                                <FiUpload size={32} className="mx-auto mb-2" />
                                <p className="text-sm">Click to upload cover image</p>
                            </div>
                        )}
                    </div>
                    <input
                        id="coverInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        className="hidden"
                    />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title *</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Book title"
                            className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Author *</label>
                        <input
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            placeholder="Author name"
                            className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Delivery Fee (৳) *</label>
                            <input
                                name="deliveryFee"
                                type="number"
                                value={form.deliveryFee}
                                onChange={handleChange}
                                placeholder="e.g. 50"
                                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Category *</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                            >
                                {categories.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description *</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Book description..."
                            rows={4}
                            className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                        <p className="text-yellow-400 text-xs">
                            ⚠️ After submission, your book will be marked as "Pending Approval" and reviewed by admin before publishing.
                        </p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Submit Book"}
                    </button>
                </div>
            </div>
        </div>
    );
}