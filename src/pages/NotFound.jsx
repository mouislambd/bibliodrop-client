import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-light text-center px-4">
            <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
            <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition">
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;