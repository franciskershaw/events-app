import * as React from "react";

import { format } from "date-fns";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Time } from "./time";

interface DateTimeProps {
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
  minDate?: Date;
  disablePast?: boolean;
  placeholder?: string;
  showTime?: boolean;
  allowClear?: boolean;
}

const DateTime = React.forwardRef<HTMLInputElement, DateTimeProps>(
  (
    {
      className,
      value,
      placeholder,
      onChange,
      name,
      disabled,
      minDate,
      disablePast,
      showTime = false,
      allowClear = false,
      ...props
    },
    ref
  ) => {
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

    const handleDayClick = (selectedDate: Date | undefined) => {
      if (!selectedDate) {
        onChange?.(undefined);
        return;
      }

      if (value) {
        const newDate = dayjs(selectedDate)
          .hour(dayjs(value).hour())
          .minute(dayjs(value).minute())
          .toDate();
        onChange?.(newDate);
      } else {
        onChange?.(selectedDate);
      }

      setIsCalendarOpen(false);
    };

    const handleTimeChange = (timeString: string) => {
      if (!value) {
        const [hours, minutes] = timeString.split(":").map(Number);
        const newDate = dayjs().hour(hours).minute(minutes).toDate();
        onChange?.(newDate);
        return;
      }

      const [hours, minutes] = timeString.split(":").map(Number);
      const newDate = dayjs(value).hour(hours).minute(minutes).toDate();
      onChange?.(newDate);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
    };

    const defaultMonth = value ? dayjs(value).toDate() : undefined;

    return (
      <div className={cn("block w-full", className)}>
        <div className="relative inline-block">
          {allowClear && value && (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute -top-3 h-6 w-6 rounded-full border-muted-foreground/20 p-0 hover:bg-destructive hover:text-destructive-foreground",
                showTime ? "-right-3" : "right-0 translate-x-1/2"
              )}
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear date</span>
            </Button>
          )}

          <div className="flex gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? (
                    format(value, "PPP")
                  ) : (
                    <span>{placeholder ? placeholder : "Pick a date"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ?? undefined}
                  onDayClick={handleDayClick}
                  initialFocus
                  disabled={disabled}
                  defaultMonth={defaultMonth}
                  fromDate={
                    disablePast && minDate
                      ? dayjs(minDate).isAfter(dayjs().startOf("day"))
                        ? minDate
                        : dayjs().startOf("day").toDate()
                      : disablePast
                        ? dayjs().startOf("day").toDate()
                        : minDate
                  }
                />
              </PopoverContent>
            </Popover>

            {showTime && (
              <Time
                value={value}
                onChange={handleTimeChange}
                disabled={disabled}
              />
            )}

            <input
              ref={ref}
              type="hidden"
              name={name}
              value={value?.toISOString() || ""}
              {...props}
            />
          </div>
        </div>
      </div>
    );
  }
);

DateTime.displayName = "DateTime";

export { DateTime };
