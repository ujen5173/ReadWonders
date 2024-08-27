import { X } from "lucide-react";
import {
  forwardRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Input, type InputProps } from "./input";

type InputTagsProps = InputProps & {
  value?: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value = [], onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("");

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e),
        ]);

        onChange(Array.from(newDataPoints).slice(0, 17));
        setPendingDataPoint("");
      }
    };

    return (
      <>
        <div className="flex flex-1">
          <Input
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (value.length < 17) {
                  addPendingDataPoint();
                }
              }
            }}
            placeholder="Add tags to improve search results"
            disabled={value.length >= 17}
            className="rounded-r-none text-base outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            {...props}
            ref={ref}
          />

          <Button
            type="button"
            onClick={() => {
              if (value.length < 17) {
                addPendingDataPoint();
              }
            }}
            variant="outline"
            className="rounded-l-none border border-l-0"
          >
            Add
          </Button>
        </div>

        <div className="flex min-h-[2.5rem] flex-wrap items-center gap-2 overflow-y-auto rounded-md border bg-white p-2">
          {value.length > 0 ? (
            value.map((item, idx) => (
              <Badge key={idx} variant="outline">
                {item}
                <button
                  type="button"
                  className="ml-2 w-3"
                  onClick={() => {
                    onChange(value.filter((i) => i !== item));
                  }}
                >
                  <X className="w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-gray-500">No tags added</span>
          )}
        </div>
      </>
    );
  },
);

InputTags.displayName = "InputTags";
