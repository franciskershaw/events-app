import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { useMemo } from "react";
import { EventDate } from "../../types/globalTypes";

dayjs.extend(advancedFormat);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
});

const useFormattedDate = ({ start, end }: EventDate): string => {
  return useMemo(() => {
    const startDate = dayjs(start).format("ddd Do");
    const endDate = end ? dayjs(end).format("ddd Do") : null;

    if (!endDate || startDate === endDate) {
      return startDate;
    }

    return `${startDate} - ${endDate}`;
  }, [start, end]);
};

export default useFormattedDate;
