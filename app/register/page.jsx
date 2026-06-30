"use client";
import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiBookOpen, FiMail, FiLock, FiUser, FiImage } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import axios from "axios";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        photoURL: "",
        role: "user",
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const uploadImage = async () => {
        if (!imageFile) return form.photoURL;
        const data = new FormData();
        data.append("image", imageFile);
        const res = await axios.post(
            `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
            data
        );
        return res.data.data.url;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            const imageUrl = await uploadImage();
            const { data, error } = await signUp.email({
                email: form.email,
                password: form.password,
                name: form.name,
                image: imageUrl,
                role: form.role,
            });

            if (error) {
                toast.error(error.message || "Registration failed!");
                return;
            }

            toast.success("Registration successful!");
            router.push("/");
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await signIn.social({ provider: "google" });
        } catch (err) {
            toast.error("Google login failed!");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10">
            <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-md shadow-2xl">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-2xl mb-2">
                    <FiBookOpen size={28} />
                    BiblioDrop
                </div>
                <p className="text-center text-gray-400 text-sm mb-8">Create your account</p>

                {/* Google */}
                <button
                    onClick={handleGoogle}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 rounded-xl mb-6 hover:bg-gray-100 transition"
                >
                    <FcGoogle size={22} />
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-gray-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-700" />
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full bg-[#0f172a] text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full bg-[#0f172a] text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full bg-[#0f172a] text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-[#0f172a] text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="relative">
                        <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full bg-[#0f172a] text-gray-400 pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                        />
                    </div>

                    {/* Role */}
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none text-sm"
                    >
                        <option value="user">User (Reader)</option>
                        <option value="librarian">Librarian</option>
                        <option value="admin">admin</option>
                    </select>

                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                 >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </div>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-emerald-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}