import { motion } from "framer-motion";

const librarians = [
    { name: "Sarah Johnson", deliveries: 142, avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Michael Chen", deliveries: 128, avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Emma Williams", deliveries: 115, avatar: "https://i.pravatar.cc/150?img=3" },
];

const TopLibrarians = () => { 
    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-primary text-center mb-10">Top Librarians</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {librarians.map((lib, i) => (
                    <motion.div
                        key={lib.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: i * 0.15 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition"
                    >
                        <img src={lib.avatar} alt={lib.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-secondary" />
                        <h3 className="font-semibold text-lg">{lib.name}</h3>
                        <p className="text-gray-500 text-sm">{lib.deliveries} deliveries completed</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};



export default TopLibrarians;