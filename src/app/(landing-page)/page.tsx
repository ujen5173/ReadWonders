import FeaturedAndLatest from "./_components/featured-latest";
import HeroSectionWrapper from "./_components/hero-section-wrapper";
import MostLoved from "./_components/most-loved";
import TopPicks from "./_components/top-picks";

const Home = async () => {
  return (
    <>
      <HeroSectionWrapper />
      <TopPicks />
      <FeaturedAndLatest />
      <MostLoved />
    </>
  );
};

export default Home;
