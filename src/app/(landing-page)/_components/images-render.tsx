import { heroImagesFallback } from "~/data";
import { fetchImages } from "~/storiesActions";
import { chunkIntoN } from "~/utils/helpers";
import ImagesWrapper from "./image-wrapper";

const ImagesRender = async () => {
  const data = await fetchImages();

  return (
    <div className="hidden max-h-[30rem] w-9/12 gap-2 overflow-hidden lg:flex">
      {chunkIntoN(data ?? heroImagesFallback, 4).map((chunk, index) => {
        return <ImagesWrapper key={index} chunk={chunk} index={index} />;
      })}
    </div>
  );
};

export default ImagesRender;
