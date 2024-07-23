import FeedbackDialog from "~/components/feedback";

const Info = () => {
  return (
    <FeedbackDialog>
      <div className="relative w-full bg-rose-400/30 px-4 py-2">
        <p className="cursor-pointer text-center text-sm text-slate-900 transition hover:text-primary hover:underline">
          🧑‍💻 Our site is still under construction. If you find any bugs, don't
          let them go MIA! Send us your feedback. Thanks for helping us improve!
          🛠️🧑‍💻
        </p>
      </div>
    </FeedbackDialog>
  );
};

export default Info;
