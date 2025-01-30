import { Dayjs } from "dayjs";

import { DayCard } from "../DayCard/DayCard";

interface MonthColumnProps {
  month: Dayjs;
  today: Dayjs;
  eventsByDay: Record<string, { titles: string[]; locations: Set<string> }>;
  showLocations: boolean;
  defaultLocation: string;
}

export const MonthColumn = ({
  month,
  today,
  eventsByDay,
  showLocations = false,
  defaultLocation,
}: MonthColumnProps) => {
  return (
    <div className="border rounded p-2 bg-white shadow">
      <div className="border border-gray-300 bg-white rounded text-center p-2 mb-2 sticky top-2 z-10 shadow outline outline-8 outline-white/75">
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
              today={today}
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
