import { Dayjs } from "dayjs";

import { Event } from "../../../../../types/globalTypes";
import { DayCard } from "../DayCard/DayCard";

interface MonthColumnProps {
  month: Dayjs;
  eventsByDay: Record<string, Event[]>;
  showLocations: boolean;
  defaultLocation: string;
}

export const MonthColumn = ({
  month,
  eventsByDay,
  showLocations = false,
  defaultLocation,
}: MonthColumnProps) => {
  return (
    <div className="border rounded p-2 bg-white shadow">
      <div className="date-header mb-2">
        <h2 className="text-lg font-semibold">{month.format("MMMM YYYY")}</h2>
      </div>

      <div className="flex flex-col gap-1">
        {Array.from({ length: month.daysInMonth() }).map((_, dayIndex) => {
          const currentDate = month.date(dayIndex + 1);
          const dateKey = currentDate.format("YYYY-MM-DD");
          const eventData = eventsByDay[dateKey];

          return (
            <DayCard
              key={dayIndex}
              currentDate={currentDate}
              eventData={eventData}
              showLocations={showLocations}
              defaultLocation={defaultLocation}
            />
          );
        })}
      </div>
    </div>
  );
};
