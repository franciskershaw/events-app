import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { EventDate } from "@/types/globalTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

dayjs.extend(advancedFormat);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
});

export const formatDate = ({ start, end }: EventDate): string => {
  const startDate = dayjs(start).format("ddd Do");
  const endDate = end ? dayjs(end).format("ddd Do") : null;

  if (!endDate || startDate === endDate) {
    return startDate;
  }

  return `${startDate} - ${endDate}`;
};

export const formatTime = ({ start, end }: EventDate): string => {
  const startTime = dayjs(start).format("h:mma");
  const endTime = end ? dayjs(end).format("h:mma") : null;

  const startDate = dayjs(start).format("Do");
  const endDate = end ? dayjs(end).format("Do") : null;

  // Only start time (no end time)
  if (!end) {
    return startTime;
  }

  // Same start and end time
  if (start === end) {
    return startTime;
  }

  // Start and end times on the same day
  if (startDate === endDate) {
    return `${startTime} - ${endTime}`;
  }

  // Start and end times on different days
  return `${startDate} ${startTime} - ${endDate} ${endTime}`;
};

export const isWeekend = (start: string): boolean => {
  const day = dayjs(start).day();
  return day === 0 || day === 6;
};
