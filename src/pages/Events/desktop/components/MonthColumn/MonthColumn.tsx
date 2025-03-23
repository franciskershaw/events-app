import { Dayjs } from "dayjs";

import { Event } from "../../../../../types/globalTypes";
import { DayCell } from "../DayCell/DayCell";

interface MonthColumnProps {
  month: Dayjs;
  eventsByDay: Record<string, Event[]>;
  showLocations: boolean;
  defaultLocation: string;
  filters: boolean;
}

export const MonthColumn = ({
  month,
  eventsByDay,
  showLocations = false,
  defaultLocation,
  filters = false,
}: MonthColumnProps) => {
  return (
    <div className="border rounded p-2 bg-background shadow">
      <div className="date-header mb-2">
        <h2 className="text-lg font-semibold">{month.format("MMMM YYYY")}</h2>
      </div>

      <div className="flex flex-col gap-1">
        {Array.from({ length: month.daysInMonth() }).map((_, dayIndex) => {
          const currentDate = month.date(dayIndex + 1);
          const dateKey = currentDate.format("YYYY-MM-DD");
          const eventData = eventsByDay[dateKey];

          return (
            <DayCell
              key={dayIndex}
              currentDate={currentDate}
              eventData={eventData}
              showLocations={showLocations}
              defaultLocation={defaultLocation}
              filters={filters}
            />
          );
        })}
      </div>
    </div>
  );
};
