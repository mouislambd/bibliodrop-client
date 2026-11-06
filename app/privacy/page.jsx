"use client";
import { motion } from "framer-motion";

const sections = [
    {
        title: "Information We Collect",
        content:
            "We collect information you provide directly to us, such as your name, email address, and profile photo when you create an account. We also collect information about your book requests and delivery history.",
    },
    {
        title: "How We Use Your Information",
        content:
            "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.",
    },
    {
        title: "Information Sharing",
        content:
            "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website and conducting our business.",
    },
    {
        title: "Data Security",
        content:
            "We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons.",
    },
    {
        title: "Cookies",
        content:
            "We use cookies to enhance your experience, gather general visitor information, and track visits to our website. You can choose to have your computer warn you each time a cookie is being sent.",
    },
    {
        title: "Contact Us",
        content:
            "If you have any questions regarding this privacy policy, you may contact us at support@bibliodrop.com.",
    },
];

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-4 py-16">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">
                        Privacy <span className="text-gray-400">Policy</span>
                    </h1>
                    <p className="text-gray-400">Last updated: July 2026</p>
                </motion.div>

                <div className="space-y-6">
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-[#1e293b] rounded-2xl p-6"
                        >
                            <h2 className="text-lg font-bold text-gray-400 mb-3">
                                {section.title}
                            </h2>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
