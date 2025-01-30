import dayjs from "dayjs";

import { useSearch } from "../../../contexts/SearchEvents/SearchEventsContext";
import { Event } from "../../../types/globalTypes";
import {
  generateMonthColumns,
  getEventsByDay,
  isEventTypeguard,
} from "../helpers/helpers";

export const EventsDesktop = () => {
  const { filteredEvents } = useSearch();

  const events = filteredEvents
    .map((event) => (isEventTypeguard(event) ? event : null))
    .filter((event): event is Event => event !== null); // Get rid of EventFree type errors
  const today = dayjs();

  const firstEventDate = new Date(
    Math.min(...events.map((event) => new Date(event.date.start).getTime()))
  );
  const lastEventDate = new Date(
    Math.max(...events.map((event) => new Date(event.date.start).getTime()))
  );

  const showLocations = true;
  const defaultLocation = "Bristol";

  const eventsByDay = getEventsByDay(events);
  const monthColumns = generateMonthColumns(firstEventDate, lastEventDate);

  return (
    <div
      className="grid gap-4 overflow-x-auto h-screen"
      style={{ gridTemplateColumns: `repeat(${monthColumns.length}, 300px)` }}
    >
      {monthColumns.map((month) => (
        <div
          key={month.format("MMMM YYYY")}
          className="border rounded p-2 bg-white shadow"
        >
          <div className="border border-gray-300 bg-white rounded text-center p-2 mb-2 sticky top-2 z-10 shadow outline outline-8 outline-white/75">
            <h2 className="text-lg font-semibold">
              {month.format("MMMM YYYY")}
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            {Array.from({ length: month.daysInMonth() }).map((_, dayIndex) => {
              const currentDate = month.date(dayIndex + 1);
              const isToday = currentDate.isSame(today, "day");
              const isPast = currentDate.isBefore(today, "day");
              const dateKey = currentDate.format("YYYY-MM-DD");
              const eventData = eventsByDay[dateKey];
              const eventTitles = eventData?.titles.join(", ") || "";
              const eventLocation = eventData?.locations.size
                ? Array.from(eventData.locations).join(", ")
                : "";

              const isWeekend =
                currentDate.day() === 0 || currentDate.day() === 6;

              return (
                <div
                  key={dayIndex}
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
                  {eventLocation &&
                    showLocations &&
                    eventLocation !== defaultLocation && (
                      <div className="text-xs p-0.5 border border-gray-300 rounded ml-auto mr-0.5 whitespace-nowrap">
                        {eventLocation}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
