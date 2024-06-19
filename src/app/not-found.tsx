import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

const NotFound = () => {
  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-4 px-4 py-32">
        <h1 className="text-5xl font-black">404</h1>
        <Separator orientation="vertical" className="h-20" />
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Sorry there is nothing in this wing of the library.
          </h1>
          <p className="mb-4 text-base text-text-secondary">
            Return to the main room to find your next story!
          </p>
          <Link href="/">
            <Button>Back to homepage</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
