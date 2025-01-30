import { Dayjs } from "dayjs";

interface DayCardProps {
  currentDate: Dayjs;
  today: Dayjs;
  eventData?: { titles: string[]; locations: Set<string> };
  showLocations: boolean;
  defaultLocation: string;
}

export const DayCard = ({
  currentDate,
  today,
  eventData,
  showLocations,
  defaultLocation,
}: DayCardProps) => {
  const isToday = currentDate.isSame(today, "day");
  const isPast = currentDate.isBefore(today, "day");
  const isWeekend = currentDate.day() === 0 || currentDate.day() === 6;

  const eventTitles = eventData?.titles.join(", ") || "";
  const eventLocation = eventData?.locations.size
    ? Array.from(eventData.locations).join(", ")
    : "";

  return (
    <div
      className={`flex items-center text-sm rounded border event ${
        isToday
          ? "event--today"
          : isWeekend && isPast
            ? "event--weekend-past"
            : isWeekend
              ? "event--weekend"
              : "event--default"
      } ${isPast && !isToday ? "event--past" : ""}`}
    >
      <div className="border-r border-gray-300 py-1 text-center flex-shrink-0 w-12">
        {currentDate.format("ddd D")}
      </div>

      <div className="truncate p-1">{eventTitles}</div>
      {eventLocation && showLocations && eventLocation !== defaultLocation && (
        <div className="text-xs p-0.5 border border-gray-300 rounded ml-auto mr-0.5 whitespace-nowrap">
          {eventLocation}
        </div>
      )}
    </div>
  );
};
