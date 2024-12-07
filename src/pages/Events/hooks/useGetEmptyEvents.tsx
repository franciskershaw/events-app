import { useMemo } from "react";

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import minMax from "dayjs/plugin/minMax";

dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

const useGetEmptyEvents = (events: any[]) => {
  const emptyEvents = useMemo(() => {
    if (events.length === 0) return [];

    const startDate = dayjs
      .min(events.map((e) => dayjs(e.date.start)))
      ?.startOf("day")!;
    const endDate = dayjs
      .max(events.map((e) => dayjs(e.date.start)))
      ?.startOf("day")!;

    const allDates: { date: { start: string }; isEmpty: boolean }[] = [];
    let currentDate = startDate;

    while (currentDate.isSameOrBefore(endDate, "day")) {
      const existingEvent = events.find((event) =>
        dayjs(event.date.start).isSame(currentDate, "day")
      );

      if (existingEvent) {
        allDates.push({ ...existingEvent, isEmpty: false });
      } else {
        allDates.push({
          date: { start: currentDate.toISOString() },
          isEmpty: true,
        });
      }

      currentDate = currentDate.add(1, "day");
    }

    return allDates;
  }, [events]);

  return emptyEvents;
};

export default useGetEmptyEvents;
