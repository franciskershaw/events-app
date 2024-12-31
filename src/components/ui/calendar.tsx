import * as React from "react";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CaptionProps, DayPicker, useNavigation } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  disablePast?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  disablePast = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      fromDate={disablePast ? new Date() : undefined}
      classNames={{
        months: "flex justify-center space-y-4",
        month: "space-y-4",
        caption: "flex items-center justify-center w-full gap-4",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full justify-between",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1",
        row: "flex w-full justify-between mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent flex-1",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_today: "bg-accent text-accent-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

function CustomCaption({ displayMonth }: CaptionProps) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: dayjs().month(i).format("MMMM"),
  }));

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = dayjs(displayMonth).subtract(5, "year").add(i, "year").year();
    return { value: year.toString(), label: year.toString() };
  });

  const { goToMonth } = useNavigation();

  return (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={() =>
          goToMonth(dayjs(displayMonth).subtract(1, "month").toDate())
        }
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2">
        <Select
          onValueChange={(value) => {
            const newDate = dayjs(displayMonth).month(parseInt(value)).toDate();
            goToMonth(newDate);
          }}
        >
          <SelectTrigger className="h-7 w-[110px]">
            <SelectValue
              placeholder={months[dayjs(displayMonth).month()].label}
            />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            const newDate = dayjs(displayMonth).year(parseInt(value)).toDate();
            goToMonth(newDate);
          }}
        >
          <SelectTrigger className="h-7 w-[90px]">
            <SelectValue placeholder={dayjs(displayMonth).year().toString()} />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button
        onClick={() => goToMonth(dayjs(displayMonth).add(1, "month").toDate())}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export { Calendar };
