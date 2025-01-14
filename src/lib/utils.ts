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
  const startDate = dayjs(start).format("dddd Do");
  const endDate = end ? dayjs(end) : null;

  if (!endDate || dayjs(start).isSame(endDate, "day")) {
    return startDate;
  }

  if (dayjs(start).month() !== endDate.month()) {
    return `${startDate} - ${endDate.format("dddd Do MMM")}`;
  }

  return `${startDate} - ${endDate.format("dddd Do")}`;
};

export const formatTime = ({ start, end }: EventDate): string => {
  if (dayjs(start).format("HH:mm") === "00:00") {
    return "";
  }

  const startTime = dayjs(start).format("h:mma");
  const endTime = end ? dayjs(end).format("h:mma") : null;

  if (!end) {
    return startTime;
  }

  if (start === end || dayjs(end).format("HH:mm") === "00:00") {
    return startTime;
  }

  if (dayjs(start).date() !== dayjs(end).date()) {
    return `${startTime} (${dayjs(start).format("MMM Do")}) - ${endTime} (${dayjs(end).format("MMM Do")})`;
  }

  return `${startTime} - ${endTime}`;
};

export const isWeekend = (start: string): boolean => {
  const day = dayjs(start).day();
  return day === 0 || day === 6;
};
