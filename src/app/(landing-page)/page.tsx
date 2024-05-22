import AllBooks from "./_components/all-books";
import FeaturedAndLatest from "./_components/featured-latest";
import HeroSection from "./_components/hero-section";
import TopPicks from "./_components/top-picks";

const Home = () => {
  return (
    <>
      <HeroSection />
      <TopPicks />
      <FeaturedAndLatest />
      <AllBooks />
    </>
  );
};

export default Home;
