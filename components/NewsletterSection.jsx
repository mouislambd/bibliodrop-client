import { motion } from "framer-motion";

export default function NewsletterSection() {
    return (
        <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#0f172a] py-16 px-4 border-t border-gray-800"
        >
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Connected with BiblioDrop</h2>
                <p className="text-gray-400 mb-8">Subscribe to get the latest library updates and book recommendations delivered to your inbox.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-[#1e293b] text-white px-4 py-3 rounded-lg flex-1 outline-none border border-gray-700 focus:border-gray-500 transition"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium">
                        Subscribe
                    </button>
                </div>
            </div>
        </motion.section>
    );
}
