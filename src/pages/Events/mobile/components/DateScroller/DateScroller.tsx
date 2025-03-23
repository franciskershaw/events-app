import dayjs from "dayjs";

import { NAV_HEIGHT } from "../../../../../constants/app";

const DateScroller = ({ date, label }: { date?: string; label?: string }) => {
  const formattedDate = date ? dayjs(date).format("MMMM YYYY") : "Today";

  return (
    <div className="sticky z-20 bg-primary-light" style={{ top: NAV_HEIGHT }}>
      <div className="flex items-center justify-center space-x-2 p-2">
        <hr className="w-12 h-1 bg-primary-foreground rounded-full border-none"></hr>
        <div className="text-lg tracking-widest uppercase text-primary-foreground">
          {label || formattedDate}
        </div>
        <hr className="w-12 h-1 bg-primary-foreground rounded-full border-none"></hr>
      </div>
    </div>
  );
};

export default DateScroller;
