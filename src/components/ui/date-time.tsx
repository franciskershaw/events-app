import * as React from "react";

import { format } from "date-fns";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";

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

    const defaultMonth = value ? dayjs(value).toDate() : undefined;

    return (
      <div className={cn("flex gap-2", className)}>
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
          <Time value={value} onChange={handleTimeChange} disabled={disabled} />
        )}

        <input
          ref={ref}
          type="hidden"
          name={name}
          value={value?.toISOString() || ""}
          {...props}
        />
      </div>
    );
  }
);

DateTime.displayName = "DateTime";

export { DateTime };
