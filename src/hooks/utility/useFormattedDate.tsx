import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import { useMemo } from "react";
import { EventDate } from "../../types/globalTypes";

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
});

const useFormattedDate = ({ start, end }: EventDate): string => {
  return useMemo(() => {
    const startDate = dayjs(start).format("ddd D");
    const endDate = end ? dayjs(end).format("ddd D") : null;

    if (!endDate || startDate === endDate) {
      return startDate;
    }

    return `${startDate} - ${endDate}`;
  }, [start, end]);
};

export default useFormattedDate;
