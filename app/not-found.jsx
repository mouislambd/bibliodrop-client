import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center px-4 text-center">
            <FiBookOpen size={60} className="text-emerald-400 mb-6" />
            <h1 className="text-8xl font-bold text-emerald-400 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
            <p className="text-gray-400 mb-8 max-w-md">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition"
            >
                Back to Home
            </Link>
        </div>
    );
}