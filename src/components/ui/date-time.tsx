import * as React from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimeProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
}

const DateTime = React.forwardRef<HTMLInputElement, DateTimeProps>(
  ({ className, value, onChange, name, disabled, ...props }, ref) => {
    const handleDayClick = (selectedDate: Date | undefined) => {
      onChange?.(selectedDate);
    };

    return (
      <div className={cn("flex gap-4", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value}
              onDayClick={handleDayClick}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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