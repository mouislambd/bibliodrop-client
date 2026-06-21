import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signIn } from "../utils/auth-client";
import toast from "react-hot-toast";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData);
            toast.success("Login successful!");
            const from = location.state?.from?.pathname;
            navigate(from || "/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "http://localhost:5173/choose-role",
            });
        } catch (error) {
            toast.error("Google login failed");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-heading font-bold text-primary text-center mb-2">Welcome Back</h2>
                <p className="text-gray-500 text-center mb-6">Login to your BiblioDrop account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password" name="password" required
                            value={formData.password} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
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
                    Don't have an account?{" "}
                    <Link to="/register" className="text-secondary font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;