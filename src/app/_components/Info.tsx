import Link from "next/link";

const Info = () => {
  return (
    <div className="relative w-full bg-rose-400/30 px-4 py-2">
      <p className="text-center text-sm text-slate-900">
        All stories are brought to life by AI 🤖, with thumbnails crafted from{" "}
        <Link
          href="https://bookcoverzone.com/"
          target="_blank"
          className="font-semibold text-primary underline"
        >
          BookCoverZone
        </Link>
        📚.
      </p>
    </div>
  );
};

export default Info;
