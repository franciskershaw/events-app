import dayjs from "dayjs";

import { useSearch } from "../../../contexts/SearchEvents/SearchEventsContext";

export const generateMonthColumns = (startDate: Date, endDate: Date) => {
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

export const EventsDesktop = () => {
  const { filteredEvents } = useSearch();
  const today = dayjs(); // Today's date for comparison

  // Get first and last event dates
  const firstEventDate = new Date(
    Math.min(
      ...filteredEvents.map((event) => new Date(event.date.start).getTime())
    )
  );
  const lastEventDate = new Date(
    Math.max(
      ...filteredEvents.map((event) => new Date(event.date.start).getTime())
    )
  );

  // Group events by day for quick lookup
  const eventsByDay = filteredEvents.reduce(
    (acc, event) => {
      const eventDate = dayjs(event.date.start).format("YYYY-MM-DD");
      acc[eventDate] = acc[eventDate] || [];
      acc[eventDate].push(event.title);
      return acc;
    },
    {} as Record<string, string[]>
  );

  // Generate month columns
  const monthColumns = generateMonthColumns(firstEventDate, lastEventDate);

  return (
    <div
      className="grid gap-4 overflow-x-auto"
      style={{
        gridTemplateColumns: `repeat(${monthColumns.length}, 300px)`, // Set column width
      }}
    >
      {monthColumns.map((month) => (
        <div
          key={month.format("MMMM YYYY")}
          className="border rounded p-2 bg-white shadow"
        >
          <h2 className="text-lg font-semibold text-center mb-2">
            {month.format("MMMM YYYY")}
          </h2>
          <div className="flex flex-col gap-1">
            {Array.from({ length: month.daysInMonth() }).map((_, dayIndex) => {
              const currentDate = month.date(dayIndex + 1); // Get the current date
              const isToday = currentDate.isSame(today, "day");
              const isPast = currentDate.isBefore(today, "day");
              const dateKey = currentDate.format("YYYY-MM-DD");
              const eventTitles = eventsByDay[dateKey]?.join(", ") || "";
              const isWeekend =
                currentDate.day() === 0 || currentDate.day() === 6;

              return (
                <div
                  key={dayIndex}
                  className={`px-2 py-1 text-sm rounded border truncate ${
                    isToday
                      ? "border-blue-500 bg-white font-bold"
                      : isWeekend && isPast
                        ? "border-gray-500"
                        : isWeekend
                          ? "border-green-500"
                          : "border-gray-200"
                  } ${
                    isPast && !isToday
                      ? "bg-gray-200 text-gray-500"
                      : "bg-white"
                  }`}
                >
                  {currentDate.format("ddd D")}
                  {eventTitles && `: ${eventTitles}`}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
