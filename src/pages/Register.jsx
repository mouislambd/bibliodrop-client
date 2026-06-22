import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", confirmPassword: "", role: "user",
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadImage = async () => {
        if (!photoFile) return "";
        const form = new FormData();
        form.append("image", photoFile);
        const res = await axios.post(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
            form
        );
        return res.data.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const photoUrl = await uploadImage();
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                photo: photoUrl,
                role: formData.role,
            });
            toast.success("Registration successful!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        await loginWithGoogle();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light px-4 py-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-heading font-bold text-primary text-center mb-2">Create Account</h2>
                <p className="text-gray-500 text-center mb-6">Join BiblioDrop today</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text" name="name" required
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" name="email" required
                            value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                        <input
                            type="file" accept="image/*"
                            onChange={(e) => setPhotoFile(e.target.files[0])}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password" name="password" required
                            value={formData.password} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password" name="confirmPassword" required
                            value={formData.confirmPassword} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
                        <select
                            name="role" value={formData.role} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            <option value="user">Reader (User)</option>
                            <option value="librarian">Librarian</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-gray-400 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <button
                    onClick={handleGoogleSignup}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                    <FcGoogle className="text-xl" />
                    Continue with Google
                </button>

                <p className="text-center text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-secondary font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;