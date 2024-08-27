import { fetchImages } from "~/actions";
import ImagesRenderWrapper from "./images-render-wrapper";

const ImagesRender = async () => {
  const data = await fetchImages();

  return (
    <div className="hidden h-full max-h-[30rem] w-9/12 gap-2 overflow-hidden lg:flex">
      <ImagesRenderWrapper data={data} />
    </div>
  );
};

export default ImagesRender;
