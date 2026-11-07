"use client";
import { useState, use } from "react";
import Link from "next/link";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const bookContent = [
  { title: "Chapter 1: The Foundation", text: "Ethics is the branch of knowledge that deals with moral principles. It governs the way we live and the choices we make, influencing our interactions with others and our impact on society. At its core, it asks: what is the right thing to do? Throughout history, philosophers have grappled with this fundamental question, shaping the moral landscape of our world." },
  { title: "Chapter 1: The Foundation (cont.)", text: "Moral principles are not static; they evolve with societies. What was considered ethical centuries ago may be viewed differently today. This evolution reflects our growing understanding of human rights, equality, and justice. As we navigate the complexities of life, our ethical framework serves as a compass, guiding our decisions and actions in an increasingly interconnected global community." },
  { title: "Chapter 2: Technology & Ethics", text: "In our modern world, technological advancements have brought about new ethical challenges. From artificial intelligence to data privacy, it is crucial to consider the moral implications of our actions. How do we ensure that AI systems are fair and unbiased? How do we protect personal privacy in an era of mass data collection? These are pressing questions that demand urgent attention." },
  { title: "Chapter 2: Technology & Ethics (cont.)", text: "The responsibility lies not only with developers and policymakers but also with users. Being an informed citizen means understanding the potential impact of the technology we embrace. We must advocate for ethical design and transparent practices, ensuring that technological progress aligns with human values and promotes the well-being of all members of society." },
  { title: "Chapter 3: Building a Future", text: "As we move forward, building a foundation of integrity and empathy will be key to creating a sustainable and equitable future for everyone. It requires conscious effort, constant learning, and a commitment to doing good, even when no one is watching. By fostering a culture of responsibility, we can address the challenges of today and prepare for the opportunities of tomorrow." },
  { title: "Conclusion", text: "The journey towards a more ethical world is ongoing. It is a path marked by continuous reflection, dialogue, and action. While there are no simple solutions, the commitment to moral integrity remains our most powerful tool for shaping a better future. Let us proceed with clarity, courage, and a shared vision of a world grounded in ethical principles." }
];

export default function ReadBookPage({ params }) {
  const { id } = use(params);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection) => {
    const next = currentPage + newDirection;
    if (next >= 0 && next < bookContent.length) {
      setDirection(newDirection);
      setCurrentPage(next);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#1e293b] p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 text-[#e2e8f0]">
        <Link href={`/books/${id}`} className="inline-flex items-center gap-2 hover:text-white">
          <FiArrowLeft /> Back to Details
        </Link>
        <span className="text-gray-500 text-sm">Page {currentPage + 1} of {bookContent.length}</span>
      </div>

      <div className="relative w-full max-w-2xl bg-[#fdfaf5] p-12 md:p-16 rounded-sm shadow-2xl min-h-[600px] flex flex-col justify-between font-serif border border-gray-300 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="flex-grow"
          >
            <h2 className="text-2xl font-bold mb-8 border-b-2 border-gray-800 pb-4">{bookContent[currentPage].title}</h2>
            <p className="text-xl leading-relaxed text-justify">{bookContent[currentPage].text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-300">
          <button 
            onClick={() => paginate(-1)}
            disabled={currentPage === 0}
            className="flex items-center gap-2 font-medium hover:text-blue-700 disabled:opacity-30 transition"
          >
            <FiChevronLeft /> Previous
          </button>
          <button 
            onClick={() => paginate(1)}
            disabled={currentPage === bookContent.length - 1}
            className="flex items-center gap-2 font-medium hover:text-blue-700 disabled:opacity-30 transition"
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
