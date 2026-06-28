import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-3xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-heading font-bold text-primary mb-8">Privacy Policy</h1>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p>Last updated: June 2026</p>

                    <div>
                        <h2 className="text-xl font-semibold text-primary mb-2">1. Information We Collect</h2>
                        <p>We collect information you provide during registration, including your name, email address, and profile photo, as well as delivery and payment information necessary to process book delivery requests.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-primary mb-2">2. How We Use Your Information</h2>
                        <p>Your information is used to manage your account, process delivery requests, facilitate payments through Stripe, and improve our platform's services.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-primary mb-2">3. Data Security</h2>
                        <p>We implement industry-standard security measures, including encrypted passwords and secure authentication, to protect your personal information.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-primary mb-2">4. Third-Party Services</h2>
                        <p>We use trusted third-party services including Stripe for payments, imgBB for image hosting, and Google for authentication. These providers have their own privacy policies governing data handling.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-primary mb-2">5. Contact Us</h2>
                        <p>If you have questions about this Privacy Policy, please reach out via our Contact page.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;