import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
    { name: "Fiction", emoji: "📖" },
    { name: "Sci-Fi", emoji: "🚀" },
    { name: "Academic", emoji: "🎓" },
    { name: "Mystery", emoji: "🔍" },
    { name: "Biography", emoji: "👤" },
    { name: "Children", emoji: "🧸" },
];

const PopularCategories = () => {
    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary text-center mb-10">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            to={`/books?category=${cat.name}`}
                            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition block"
                        >
                            <div className="text-4xl mb-2">{cat.emoji}</div>
                            <h3 className="font-semibold text-primary">{cat.name}</h3>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PopularCategories;