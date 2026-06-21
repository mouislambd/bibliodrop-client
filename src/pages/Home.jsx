import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import Hero from "../components/home/Hero";
import FeaturedBooks from "../components/home/FeaturedBooks";
import TopLibrarians from "../components/home/TopLibrarians";
import PopularCategories from "../components/home/PopularCategories";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <Hero />
                <FeaturedBooks />
                <TopLibrarians />
                <PopularCategories />
            </main>
            <Footer />
        </div>
    );
};

export default Home;