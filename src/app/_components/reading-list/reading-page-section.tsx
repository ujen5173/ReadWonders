import { ArrowDown02Icon } from "hugeicons-react";
import ReadingListSection from "./reading-list-section";

const ReadingSection = async () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between gap-4">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-primary">Reading List</h1>
          <ArrowDown02Icon size={20} className="text-primary" />
        </div>
      </div>
      <ReadingListSection perRow={2} />
    </div>
  );
};

export default ReadingSection;
