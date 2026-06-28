import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-gray-400 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand */}
                <div>
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl mb-3">
                        <FiBookOpen size={22} />
                        BiblioDrop
                    </div>
                    <p className="text-sm leading-relaxed">
                        Your local library, delivered to your doorstep. Connecting readers with books they love.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-emerald-400 transition">Home</Link></li>
                        <li><Link href="/browse" className="hover:text-emerald-400 transition">Browse Books</Link></li>
                        <li><Link href="/about" className="hover:text-emerald-400 transition">About</Link></li>
                        <li><Link href="/contact" className="hover:text-emerald-400 transition">Contact</Link></li>
                        <li><Link href="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-white font-semibold mb-3">Newsletter</h4>
                    <p className="text-sm mb-3">Stay updated with new arrivals and offers.</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="bg-[#1e293b] text-white text-sm px-3 py-2 rounded-lg flex-1 outline-none border border-gray-700 focus:border-emerald-400"
                        />
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg transition">
                            Subscribe
                        </button>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-5 text-xl">
                        <a href="#" className="hover:text-emerald-400 transition"><FaFacebook /></a>
                        <a href="#" className="hover:text-emerald-400 transition"><FaXTwitter /></a>
                        <a href="#" className="hover:text-emerald-400 transition"><FaGithub /></a>
                        <a href="#" className="hover:text-emerald-400 transition"><FaLinkedin /></a>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-gray-800 text-center text-sm">
                © {new Date().getFullYear()} BiblioDrop. All rights reserved.
            </div>
        </footer>
    );
}