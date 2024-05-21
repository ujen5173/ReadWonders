import { Plus } from "lucide-react";
import Link from "next/link";
import { fontUrbanist } from "~/config/font";
import { cn } from "~/utils/cn";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="w-full">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2">
        <h1 className={cn(`${fontUrbanist.className} text-xl font-bold`)}>
          StoryNest
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="gap-2" variant="ghost-link">
              <Plus size={18} />
              <span>Write a book</span>
            </Button>
          </Link>
          <Link href="/">
            <Button className="gap-2" variant="link">
              <span>Newsletter</span>
            </Button>
          </Link>
          <Link href="/">
            <Button className="gap-2" variant="link">
              <span>Stats</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
