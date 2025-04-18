import * as React from "react";

import dayjs from "dayjs";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimeProps {
  value?: string | Date | null;
  onChange?: (time: string) => void;
  className?: string;
  disabled?: boolean;
  triggerWidth?: string;
}

const Time = ({
  value,
  onChange,
  className,
  disabled,
  triggerWidth = "120px",
}: TimeProps) => {
  const timeValue = React.useMemo(() => {
    if (!value) return { hour: "00", minute: "00" };
    const date =
      value instanceof Date ? value : dayjs(`1970-01-01T${value}`).toDate();
    return {
      hour: dayjs(date).format("HH"),
      minute: dayjs(date).format("mm"),
    };
  }, [value]);

  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    const newTime =
      type === "hour"
        ? `${newValue}:${timeValue.minute}`
        : `${timeValue.hour}:${newValue}`;
    onChange?.(newTime);
  };

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          style={{ width: triggerWidth }}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {timeValue ? `${timeValue.hour}:${timeValue.minute}` : "Set time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex divide-x">
          <ScrollArea className="h-[300px] w-[100px]">
            <div className="p-2">
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <Button
                  key={hour}
                  variant={
                    timeValue.hour === hour.toString().padStart(2, "0")
                      ? "default"
                      : "ghost"
                  }
                  className="w-full h-10"
                  onClick={() =>
                    handleTimeChange("hour", hour.toString().padStart(2, "0"))
                  }
                >
                  {hour.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <ScrollArea className="h-[300px] w-[100px]">
            <div className="p-2">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                <Button
                  key={minute}
                  variant={
                    timeValue.minute === minute.toString().padStart(2, "0")
                      ? "default"
                      : "ghost"
                  }
                  className="w-full h-10"
                  onClick={() =>
                    handleTimeChange(
                      "minute",
                      minute.toString().padStart(2, "0")
                    )
                  }
                >
                  {minute.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

Time.displayName = "Time";

export { Time, type TimeProps };
