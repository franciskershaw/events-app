import dayjs, { Dayjs } from "dayjs";

import {
  CATEGORY_HOLIDAY,
  CATEGORY_REMINDER,
} from "../../../../../constants/app";
import { useActiveDay } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import { Event } from "../../../../../types/globalTypes";

interface DayCellProps {
  currentDate: Dayjs;
  eventData?: Event[];
  showLocations: boolean;
  defaultLocation: string;
}

export const DayCell = ({
  currentDate,
  eventData = [],
  showLocations,
  defaultLocation,
}: DayCellProps) => {
  const { activeDay, setActiveDay } = useActiveDay();
  const isSelected = activeDay?.isSame(currentDate, "day");

  const today = dayjs();
  const isToday = currentDate.isSame(today, "day");
  const isPast = currentDate.isBefore(today, "day");
  const isWeekend = currentDate.day() === 0 || currentDate.day() === 6;

  const eventTitles = eventData
    .filter((event) => event.category.name !== CATEGORY_HOLIDAY)
    .map((event, index, array) => (
      <span key={event._id}>
        {event.category.name === CATEGORY_REMINDER ? (
          <i>{event.unConfirmed ? `${event.title}?` : event.title}</i>
        ) : event.unConfirmed ? (
          `${event.title}?`
        ) : (
          event.title
        )}
        {index < array.length - 1 && ", "}{" "}
      </span>
    ));

  const formattedTitles = eventTitles.length > 0 ? <>{eventTitles}</> : null;

  const eventLocationsMap = new Map<string, boolean>();

  eventData.forEach((event) => {
    if (event.location?.city) {
      eventLocationsMap.set(
        event.location.city,
        eventLocationsMap.get(event.location.city) || event.unConfirmed
      );
    }
  });

  const eventLocation = eventLocationsMap.size
    ? Array.from(eventLocationsMap)
        .map(([city, unConfirmed]) => (unConfirmed ? `${city}(?)` : city))
        .join(", ")
    : "";

  return (
    <div
      className={`flex items-center text-sm rounded border event cursor-pointer ${
        isToday
          ? "event--today"
          : isWeekend && isPast
            ? "event--weekend-past"
            : isWeekend
              ? "event--weekend"
              : "event--default"
      } ${isPast && !isToday ? "event--past" : ""} ${isSelected ? "event--selected font-bold" : ""}`}
      onClick={() => setActiveDay(currentDate)}
    >
      <div className="border-r border-gray-300 py-1 text-center flex-shrink-0 w-12 event-date">
        {currentDate.format("ddd D")}
      </div>

      <div className="truncate p-1">{formattedTitles}</div>
      {eventLocation && showLocations && eventLocation !== defaultLocation && (
        <div className="text-xs p-0.5 border border-gray-300 rounded ml-auto mr-0.5 max-w-24 truncate flex-shrink-0">
          {eventLocation}
        </div>
      )}
    </div>
  );
};
