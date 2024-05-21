import { BookMarked, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { workSans } from "~/config/font";
import { cn } from "~/utils/cn";

const HeroSection = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto flex items-center gap-6 border-b border-slate-300 px-4 py-6">
        <div className="py-12">
          <h1 className={cn(`${workSans.className} mb-5 text-5xl font-bold`)}>
            Find Timeless{" "}
            <span className="relative text-primary">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute left-0 top-2/3 h-[0.58em] w-full fill-secondary"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
              Stories
            </span>{" "}
            <br /> That Transport and Inspire
          </h1>

          <p className="mb-5 text-base text-slate-800">
            Step into a world where the past, present, and future converge in
            stories that transport and inspire, weaving a tapestry of
            imagination and emotion.
          </p>

          <Button className="mb-5 gap-2">
            <BookMarked className="rotate-12" size={18} color="#fff" />
            <span>Browse the best Reading collection</span>
          </Button>
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-1 flex">
              <Star size={22} className="fill-amber-400 stroke-amber-400" />
              <Star size={22} className="fill-amber-400 stroke-amber-400" />
              <Star size={22} className="fill-amber-400 stroke-amber-400" />
              <Star size={22} className="fill-amber-400 stroke-amber-400" />
              <Star size={22} className="fill-amber-400 stroke-amber-400" />
            </div>
            <p className="text-center text-sm md:text-left">
              Already
              <span className="mx-1 rounded-full text-lg font-bold text-primary underline underline-offset-4">
                1 Million+
              </span>
              <span className="font-bold">#storytellers</span> are sharing their
              stories.
            </p>
          </div>
        </div>

        <div className="flex max-h-[30rem] w-9/12 gap-4 overflow-hidden">
          <div className="flex flex-col gap-4">
            <Image
              src="/hero-stories/1.jpg"
              alt="A person reading a book"
              className="w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
            <Image
              src="/hero-stories/2.jpg"
              alt="A person reading a book"
              className="w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
            <Image
              src="/hero-stories/7.jpg"
              alt="A person reading a book"
              className="w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Image
              src="/hero-stories/7.jpg"
              alt="A person reading a book"
              className="-mt-24 w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
            <Image
              src="/hero-stories/3.jpg"
              alt="A person reading a book"
              className="w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
            <Image
              src="/hero-stories/4.jpg"
              alt="A person reading a book"
              className="w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Image
              src="/hero-stories/5.jpg"
              alt="A person reading a book"
              className="w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
            <Image
              src="/hero-stories/6.jpg"
              alt="A person reading a book"
              className="w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
            <Image
              src="/hero-stories/2.jpg"
              alt="A person reading a book"
              className="w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Image
              src="/hero-stories/3.jpg"
              alt="A person reading a book"
              className="-mt-32 w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
            <Image
              src="/hero-stories/4.jpg"
              alt="A person reading a book"
              className="w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
            <Image
              src="/hero-stories/7.jpg"
              alt="A person reading a book"
              className="-mb-24 w-36 rounded-lg object-cover"
              width={180}
              height={300}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
