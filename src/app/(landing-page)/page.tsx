import Footer from "~/components/sections/footer";
import FeaturedAndLatest from "./_components/featured-latest";
import HeroSection from "./_components/hero-section";
import TopPicks from "./_components/top-picks";

const Home = async () => {
  return (
    <>
      <HeroSection />
      <TopPicks />
      <FeaturedAndLatest />
      <Footer />
    </>
  );
};

export default Home;
