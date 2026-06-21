import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="bg-gradient-to-br from-primary to-secondary text-white py-24 px-4">
            <div className="max-w-7xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-6xl font-heading font-bold mb-6"
                >
                    Your Local Library, Delivered
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
                >
                    Browse thousands of books from local libraries and independent owners. Request delivery, read more, worry less.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Link
                        to="/books"
                        className="bg-accent text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition inline-block"
                    >
                        Browse Books
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;