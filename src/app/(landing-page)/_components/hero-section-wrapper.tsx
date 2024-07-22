import { api } from "~/trpc/server";
import HeroSection from "./hero-section";

const HeroSectionWrapper = async () => {
  const data = await api.helpers.images.query(undefined);

  return <HeroSection data={data} />;
};

export default HeroSectionWrapper;
