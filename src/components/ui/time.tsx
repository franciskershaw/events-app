import * as React from "react";

import dayjs from "dayjs";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimeProps {
  value?: string | Date;
  onChange?: (time: string) => void;
  className?: string;
  disabled?: boolean;
  triggerWidth?: string;
}

const timePresets = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const Time = ({
  value,
  onChange,
  className,
  disabled,
  triggerWidth = "120px",
}: TimeProps) => {
  // Handle both string time values and Date objects
  const timeValue = React.useMemo(() => {
    if (!value) return "00:00";
    if (value instanceof Date) {
      return dayjs(value).format("HH:mm");
    }
    return value;
  }, [value]);

  const handleTimeChange = (newTime: string) => {
    onChange?.(newTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          style={{ width: triggerWidth }}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {timeValue || "Set time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-3" align="start">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Select time</label>
            <input
              type="time"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Common times</label>
            <div className="grid grid-cols-3 gap-1">
              {timePresets.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTimeChange(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

Time.displayName = "Time";

export { Time, type TimeProps };
