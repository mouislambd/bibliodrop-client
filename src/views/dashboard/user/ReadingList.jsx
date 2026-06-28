"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "../../../utils/axios";

const ReadingList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("/deliveries/my-deliveries");
                const delivered = res.data.deliveries.filter((d) => d.status === "delivered");
                setBooks(delivered);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">My Reading List</h2>

            {books.length === 0 ? (
                <p className="text-gray-500">No books delivered yet.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {books.map((d) => (
                        <Link key={d._id} href={`/books/${d.book?._id}`} className="block group">
                            <img src={d.book?.coverImage} alt={d.book?.title} className="w-full h-48 object-cover rounded-xl shadow-sm group-hover:shadow-md transition" />
                            <p className="font-medium mt-2 truncate">{d.book?.title}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReadingList;