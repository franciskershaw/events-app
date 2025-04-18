import dayjs from "dayjs";

import { Event } from "../../../types/globalTypes";

export const getFirstAndLastEventDates = (events: Event[]) => {
  if (events.length === 0) {
    return {
      firstEventDate: dayjs().toDate(),
      lastEventDate: dayjs().add(1, "month").toDate(),
    };
  }

  const startTimes = events.map((event) => dayjs(event.date.start).valueOf());

  const firstEventDate = dayjs(Math.min(...startTimes)).toDate();
  const lastEventDate = dayjs(Math.max(...startTimes)).toDate();

  return { firstEventDate, lastEventDate };
};
