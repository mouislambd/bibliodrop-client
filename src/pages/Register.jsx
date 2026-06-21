import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signIn } from "../utils/auth-client";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", confirmPassword: "", role: "user",
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { register } = useAuth();
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

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await signIn.social({
                provider: "google",
                callbackURL: `${import.meta.env.VITE_CLIENT_URL}/choose-role`,
            });
        } catch (error) {
            toast.error("Google login failed");
            setGoogleLoading(false);
        }
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
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className="flex items-center my-4">
                    <hr className="flex-1 border-gray-300" />
                    <span className="px-3 text-gray-400 text-sm">OR</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
                    {googleLoading ? "Redirecting..." : "Continue with Google"}
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