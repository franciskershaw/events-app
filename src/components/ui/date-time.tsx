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
  value?: Date | null | undefined;
  onChange?: (date: Date | null | undefined) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
  minDate?: Date;
  toDate?: Date;
  disablePast?: boolean;
  placeholder?: string;
  showTime?: boolean;
  allowClear?: boolean;
  defaultValue?: Date;
  id?: string;
}

const DateTime = React.forwardRef<HTMLInputElement, DateTimeProps>(
  (
    {
      className,
      value,
      defaultValue,
      placeholder,
      onChange,
      name,
      id,
      disabled,
      minDate,
      toDate,
      disablePast,
      showTime = false,
      allowClear = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<
      Date | null | undefined
    >(defaultValue);
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

    const effectiveValue = value !== undefined ? value : internalValue;

    const handleDayClick = (selectedDate: Date | undefined) => {
      if (!selectedDate) {
        onChange?.(undefined);
        setInternalValue(undefined);
        return;
      }

      const newDate = effectiveValue
        ? dayjs(selectedDate)
            .hour(dayjs(effectiveValue).hour())
            .minute(dayjs(effectiveValue).minute())
            .toDate()
        : selectedDate;

      onChange?.(newDate);
      setInternalValue(newDate);
      setIsCalendarOpen(false);
    };

    const handleTimeChange = (timeString: string) => {
      const [hours, minutes] = timeString.split(":").map(Number);
      const newDate = effectiveValue
        ? dayjs(effectiveValue).hour(hours).minute(minutes).toDate()
        : dayjs(minDate || new Date())
            .hour(hours)
            .minute(minutes)
            .toDate();

      onChange?.(newDate);
      setInternalValue(newDate);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange?.(null);
      setInternalValue(null);
    };

    const defaultMonth = effectiveValue
      ? dayjs(effectiveValue).toDate()
      : undefined;

    const getInputValue = () => {
      if (!effectiveValue) return "";
      return effectiveValue.toISOString();
    };

    return (
      <div className={cn("block w-full", className)}>
        <div className="relative w-full">
          {allowClear && effectiveValue && (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute -top-3 h-6 w-6 rounded-full border-muted-foreground/20 p-0",
                showTime ? "-right-3" : "right-0 translate-x-1/2"
              )}
              onClick={handleClear}
              type="button"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear date</span>
            </Button>
          )}

          <div className="flex gap-2 flex-wrap min-w-0">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={id}
                  variant={"outline"}
                  className={cn(
                    "flex-1 min-w-[140px] justify-start text-left font-normal truncate",
                    !effectiveValue && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 md:mr-0 h-4 w-4 flex-shrink-0" />
                  {effectiveValue ? (
                    <div className="truncate">
                      <span className="inline max-[380px]:hidden">
                        {format(effectiveValue, "PPP")}
                      </span>
                      <span className="hidden max-[380px]:inline">
                        {format(effectiveValue, "dd/MM/yy")}
                      </span>
                    </div>
                  ) : (
                    <span className="truncate">
                      {placeholder ? placeholder : "Pick a date"}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={effectiveValue ?? undefined}
                  onDayClick={handleDayClick}
                  initialFocus
                  disabled={disabled}
                  defaultMonth={defaultMonth}
                  toDate={toDate}
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
                value={effectiveValue}
                onChange={handleTimeChange}
                disabled={disabled}
                className="flex-shrink-0"
              />
            )}

            <input
              ref={ref}
              type="hidden"
              name={name}
              value={getInputValue()}
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
