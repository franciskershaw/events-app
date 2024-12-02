import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useMemo } from "react";
import { EventDate } from "../../types/globalTypes";

dayjs.extend(advancedFormat);

const useFormattedTime = ({ start, end }: EventDate): string => {
  return useMemo(() => {
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
  }, [start, end]);
};

export default useFormattedTime;
