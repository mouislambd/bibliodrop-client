import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { FaBookOpen, FaTruck, FaUsers } from "react-icons/fa";

const About = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-5xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-heading font-bold text-primary mb-4 text-center">About BiblioDrop</h1>
                <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                    BiblioDrop connects avid readers and students with local libraries and independent book owners,
                    bringing your next favorite read straight to your doorstep.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <FaBookOpen className="text-3xl text-secondary mx-auto mb-3" />
                        <h3 className="font-semibold text-lg mb-2">Vast Collection</h3>
                        <p className="text-gray-500 text-sm">Browse thousands of books across genres from libraries and independent owners near you.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <FaTruck className="text-3xl text-secondary mx-auto mb-3" />
                        <h3 className="font-semibold text-lg mb-2">Doorstep Delivery</h3>
                        <p className="text-gray-500 text-sm">Request a book and have it delivered to you, with real-time status tracking.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <FaUsers className="text-3xl text-secondary mx-auto mb-3" />
                        <h3 className="font-semibold text-lg mb-2">Community Driven</h3>
                        <p className="text-gray-500 text-sm">Librarians and readers build a trusted local reading community together.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-heading font-bold text-primary mb-4">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Traditional library systems often require physical visits, which can be a barrier for busy
                        professionals or remote students. BiblioDrop democratizes access to books, helps local libraries
                        reach a wider audience, and provides a secure, streamlined borrowing experience for everyone.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default About;