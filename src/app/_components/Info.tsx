import Link from "next/link";

const Info = () => {
  return (
    // <FeedbackDialog>
    <div className="relative w-full bg-rose-400/30 px-4 py-2">
      <p className="text-center text-sm text-slate-900">
        🧑‍💻 All the content is generate by AI and the thumbnail used is from{" "}
        <Link
          href="https://bookcoverzone.com/"
          target="_blank"
          className="font-semibold text-primary underline"
        >
          bookcoverzone
        </Link>
        🛠️🧑‍💻
      </p>
    </div>
    // </FeedbackDialog>
  );
};

export default Info;
