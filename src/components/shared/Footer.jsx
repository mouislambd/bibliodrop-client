import { Link } from "react-router-dom";
import { FaXTwitter, FaFacebook, FaInstagram } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-12 pb-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-heading font-bold mb-3">📚 BiblioDrop</h3>
                    <p className="text-gray-300 text-sm">Your local library, delivered to your doorstep.</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link to="/about" className="hover:text-accent">About</Link></li>
                        <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
                        <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Follow Us</h4>
                    <div className="flex gap-4 text-xl">
                        <a href="#" className="hover:text-accent"><FaXTwitter /></a>
                        <a href="#" className="hover:text-accent"><FaFacebook /></a>
                        <a href="#" className="hover:text-accent"><FaInstagram /></a>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold mb-3">Newsletter</h4>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="px-3 py-2 rounded-lg text-sm text-gray-800 w-full focus:outline-none"
                        />
                        <button className="bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-4">
                © {new Date().getFullYear()} BiblioDrop. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;