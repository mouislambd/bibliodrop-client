"use client";
import { useState, use } from "react";
import Link from "next/link";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const bookContent = [
  {
    title: "Chapter 1: The Foundation",
    text: "Ethics is the branch of knowledge that deals with moral principles. It governs the way we live and the choices we make, influencing our interactions with others and our impact on society. At its core, it asks: what is the right thing to do?"
  },
  {
    title: "Chapter 2: Technology & Ethics",
    text: "In our modern world, technological advancements have brought about new ethical challenges. From artificial intelligence to data privacy, it is crucial to consider the moral implications of our actions. We must ensure that technology serves humanity, not the other way around."
  },
  {
    title: "Chapter 3: Building a Future",
    text: "As we move forward, building a foundation of integrity and empathy will be key to creating a sustainable and equitable future for everyone. It requires conscious effort, constant learning, and a commitment to doing good, even when no one is watching."
  }
];

export default function ReadBookPage({ params }) {
  const { id } = use(params);
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < bookContent.length - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#e2e8f0] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link href={`/books/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white">
          <FiArrowLeft /> Back to Details
        </Link>
        <span className="text-gray-500 text-sm">Page {currentPage + 1} of {bookContent.length}</span>
      </div>

      <div className="w-full max-w-2xl bg-[#f8f9fa] text-[#1e293b] p-8 md:p-12 rounded-sm shadow-2xl min-h-[500px] flex flex-col justify-between font-serif">
        <div>
          <h2 className="text-xl font-bold mb-6 border-b border-gray-300 pb-2">{bookContent[currentPage].title}</h2>
          <p className="text-lg leading-relaxed">{bookContent[currentPage].text}</p>
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-300">
          <button 
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 disabled:opacity-30"
          >
            <FiChevronLeft /> Previous
          </button>
          <button 
            onClick={nextPage}
            disabled={currentPage === bookContent.length - 1}
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 disabled:opacity-30"
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
