import FAQs from "~/components/shared/faq";
import FeaturedAndLatest from "./_components/featured-latest";
import HeroSection from "./_components/hero-section";
import MostLoved from "./_components/most-loved";
import TopPicks from "./_components/top-picks";

const Home = async () => {
  return (
    <>
      <HeroSection />
      <TopPicks />
      <FeaturedAndLatest />
      <MostLoved />
      <FAQs />
    </>
  );
};

export default Home;
