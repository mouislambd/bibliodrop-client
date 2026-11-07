"use client";
import { use } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function ReadBookPage({ params }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <Link href={`/books/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
        <FiArrowLeft /> Back to Details
      </Link>
      <div className="max-w-3xl mx-auto bg-[#1e293b] p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Ethics in the Modern World</h1>
        <p className="text-gray-300 leading-relaxed mb-4">
          Ethics is the branch of knowledge that deals with moral principles. It governs the way we live and the choices we make, influencing our interactions with others and our impact on society.
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">
          In our modern world, technological advancements have brought about new ethical challenges. From artificial intelligence to data privacy, it is crucial to consider the moral implications of our actions.
        </p>
        <p className="text-gray-300 leading-relaxed">
          As we move forward, building a foundation of integrity and empathy will be key to creating a sustainable and equitable future for everyone.
        </p>
      </div>
    </div>
  );
}
