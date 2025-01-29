import dayjs from "dayjs";

import { useSearch } from "../../../contexts/SearchEvents/SearchEventsContext";
import { Event } from "../../../types/globalTypes";
import { isEventTypeguard } from "../helpers/helpers";

// TODO: Make shared styles for different sorts of events (past, today, weekends etc) so easy to keep consistent across mobile + desktop

const generateMonthColumns = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate).startOf("month");
  const end = dayjs(endDate).startOf("month");
  const months = [];

  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    months.push(current);
    current = current.add(1, "month");
  }

  return months;
};

const getEventsByDay = (events: Event[]) => {
  return events.reduce<
    Record<string, { titles: string[]; locations: Set<string> }>
  >((acc, event) => {
    const startDate = dayjs(event.date.start);
    const endDate = dayjs(event.date.end);
    const eventTitle = event.unConfirmed ? `${event.title}?` : event.title;
    const eventLocation = event.location?.city ?? "";

    let currentDate = startDate;
    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      const dateKey = currentDate.format("YYYY-MM-DD");

      if (!acc[dateKey]) {
        acc[dateKey] = { titles: [], locations: new Set() };
      }

      acc[dateKey].titles.push(eventTitle);
      if (eventLocation) {
        acc[dateKey].locations.add(eventLocation);
      }

      currentDate = currentDate.add(1, "day");
    }

    return acc;
  }, {});
};

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

  const showLocations = false;
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
                  className={`flex items-center text-sm rounded border ${
                    isToday
                      ? "border-green-500 bg-white font-bold"
                      : isWeekend && isPast
                        ? "border-gray-500"
                        : isWeekend
                          ? "border-blue-500"
                          : "border-gray-300"
                  } ${isPast && !isToday ? "bg-gray-200 text-gray-500" : "bg-white"}`}
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
