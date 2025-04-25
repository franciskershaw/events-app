import dayjs from "dayjs";

import { NAV_HEIGHT } from "../../../../../constants/app";

const DateScroller = ({ date, label }: { date?: string; label?: string }) => {
  const formattedDate = date ? dayjs(date).format("MMMM YYYY") : "Today";

  return (
    <div
      className="sticky z-20 bg-primary-light p-2"
      style={{ top: NAV_HEIGHT }}
    >
      <div className="border bg-event rounded text-center p-2">
        <h2 className="text-lg font-semibold">{label || formattedDate}</h2>
      </div>
    </div>
  );
};

export default DateScroller;
