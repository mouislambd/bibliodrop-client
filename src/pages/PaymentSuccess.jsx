import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("processing");

    useEffect(() => {
        const confirmDelivery = async () => {
            const sessionId = searchParams.get("session_id");
            const bookId = searchParams.get("bookId");

            if (!sessionId || !bookId) {
                setStatus("error");
                return;
            }

            try {
                await axiosInstance.post("/deliveries/confirm", { sessionId, bookId });
                setStatus("success");
                toast.success("Delivery requested successfully!");
            } catch (error) {
                setStatus("error");
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        };

        confirmDelivery();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-light px-4">
            <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
                {status === "processing" && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Confirming your delivery request...</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <h2 className="text-2xl font-bold text-green-600 mb-3">Payment Successful! ✅</h2>
                        <p className="text-gray-600 mb-6">Your delivery request has been placed.</p>
                        <Link to="/dashboard/user" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition">
                            Go to Dashboard
                        </Link>
                    </>
                )}
                {status === "error" && (
                    <>
                        <h2 className="text-2xl font-bold text-red-600 mb-3">Something went wrong</h2>
                        <Link to="/books" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition">
                            Browse Books
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;