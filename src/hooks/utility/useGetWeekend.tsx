import dayjs from "dayjs";

const isWeekend = (start: string): boolean => {
  const day = dayjs(start).day();
  return day === 0 || day === 6;
};

export default isWeekend;
