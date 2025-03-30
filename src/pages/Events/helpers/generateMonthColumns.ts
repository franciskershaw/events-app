import dayjs from "dayjs";

import { MIN_VISIBLE_MONTHS } from "../../../constants/app";

export const generateMonthColumns = (startDate: Date, endDate: Date) => {
  const start = isNaN(startDate.getTime())
    ? dayjs().startOf("month")
    : dayjs(startDate).startOf("month");
  const end = dayjs(endDate).startOf("month");
  const months = [];

  let current = start;
  let count = 0;

  while (
    current.isBefore(end) ||
    current.isSame(end) ||
    count < MIN_VISIBLE_MONTHS
  ) {
    months.push(current);
    current = current.add(1, "month");
    count++;
  }

  return months;
};
