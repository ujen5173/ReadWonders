import React from "react";
import { type TimePickerType } from "~/lib/time-picker";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
  selectType?: "hours" | "minutes";
}

const TimePickerInput = React.forwardRef<
  HTMLButtonElement,
  TimePickerInputProps
>(
  (
    {
      className,
      date = new Date(new Date().setHours(0, 0, 0, 0)),
      setDate,
      picker,
      onLeftFocus,
      onRightFocus,
      selectType,
      ...props
    },
    ref,
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight") onRightFocus?.();
      if (e.key === "ArrowLeft") onLeftFocus?.();
    };

    const handleValueChange = (value: string) => {
      const numValue = parseInt(value, 10);

      if (date) {
        const tempDate = new Date(date);

        if (picker === "hours") {
          tempDate.setHours(numValue);
        } else {
          tempDate.setMinutes(numValue);
        }

        setDate(tempDate);
      }
    };

    const displayValue = React.useMemo(() => {
      if (!date) return "";

      return selectType === "hours"
        ? date.getHours().toString().padStart(2, "0")
        : date.getMinutes().toString().padStart(2, "0");
    }, [date, selectType]);

    return (
      <div className="flex h-10 w-full items-center">
        <Select
          value={
            selectType === "hours"
              ? date?.getHours().toString()
              : date?.getMinutes().toString()
          }
          onValueChange={handleValueChange}
        >
          <SelectTrigger
            ref={ref}
            className="bg-white focus:bg-background focus:text-foreground"
            onKeyDown={handleKeyDown}
          >
            <SelectValue>{displayValue}</SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white">
            <>
              {Array.from(
                { length: selectType === "hours" ? 24 : 12 },
                (_, i) => (
                  <SelectItem
                    key={i}
                    value={i.toString().padStart(2, "0")}
                    className={cn(
                      "block p-2 text-left focus:bg-accent focus:text-accent-foreground",
                      date &&
                        ((selectType === "hours" && date.getHours() === i) ||
                          (selectType === "minutes" &&
                            date.getMinutes() === i)) &&
                        "bg-accent text-accent-foreground",
                    )}
                    onClick={() =>
                      handleValueChange(
                        (selectType === "hours" ? i : i * 5)
                          .toString()
                          .padStart(2, "0"),
                      )
                    }
                  >
                    {(selectType === "hours" ? i : i * 5)
                      .toString()
                      .padStart(2, "0")}
                  </SelectItem>
                ),
              )}
            </>
          </SelectContent>
        </Select>
      </div>
    );
  },
);

TimePickerInput.displayName = "TimePickerInput";

export { TimePickerInput };
