import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { twMerge } from "tailwind-merge";

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
  // Return empty string if start time is midnight (00:00)
  if (dayjs(start).format("HH:mm") === "00:00") {
    return "";
  }

  const startTime = dayjs(start).format("h:mma");
  const endTime = end ? dayjs(end).format("h:mma") : null;

  // Only start time (no end time)
  if (!end) {
    return startTime;
  }

  // Same start and end time or end time is midnight
  if (start === end || dayjs(end).format("HH:mm") === "00:00") {
    return startTime;
  }

  // Start and end times
  return `${startTime} - ${endTime}`;
};

export const isWeekend = (start: string): boolean => {
  const day = dayjs(start).day();
  return day === 0 || day === 6;
};
