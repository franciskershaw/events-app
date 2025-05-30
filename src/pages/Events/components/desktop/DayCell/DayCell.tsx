import dayjs, { Dayjs } from "dayjs";

import { useSidebarContent } from "@/contexts/Sidebar/desktop/SidebarContentContext";

import {
  CATEGORY_HOLIDAY,
  CATEGORY_REMINDER,
} from "../../../../../constants/app";
import { useActiveDay } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import useUser from "../../../../../hooks/user/useUser";
import { Event } from "../../../../../types/globalTypes";

interface DayCellProps {
  currentDate: Dayjs;
  eventData?: Event[];
  showLocations: boolean;
  defaultLocation: string;
  filters: boolean;
}

export const DayCell = ({
  currentDate,
  eventData = [],
  showLocations,
  defaultLocation,
  filters,
}: DayCellProps) => {
  const { activeDay, setActiveDay } = useActiveDay();
  const isSelected = activeDay?.isSame(currentDate, "day");
  const { user } = useUser();
  const { setSidebarContent, sidebarContent } = useSidebarContent();

  const today = dayjs();
  const isToday = currentDate.isSame(today, "day");
  const isPast = currentDate.isBefore(today, "day");
  const isWeekend = currentDate.day() === 0 || currentDate.day() === 6;

  const userEvents = eventData
    .filter((event) => event.category.name !== CATEGORY_HOLIDAY)
    .filter((event) => user?._id === event.createdBy._id);

  const otherUsersEvents = eventData
    .filter((event) => event.category.name !== CATEGORY_HOLIDAY)
    .filter((event) => user?._id !== event.createdBy._id);

  const userEventTitles = userEvents.map((event, index, array) => (
    <span key={event._id}>
      {event.category.name === CATEGORY_REMINDER ? (
        <i>{event.unConfirmed ? `${event.title}?` : event.title}</i>
      ) : event.unConfirmed ? (
        `${event.title}(?)`
      ) : (
        event.title
      )}
      {index < array.length - 1 && ", "}
    </span>
  ));

  const otherUserEventTitles = otherUsersEvents.map((event, index, array) => (
    <span key={event._id} className="italic">
      {event.unConfirmed ? `${event.title}?` : event.title}
      {index < array.length - 1 && ", "}
    </span>
  ));

  const eventTitles = (
    <>
      {userEventTitles}
      {userEventTitles.length > 0 && otherUserEventTitles.length > 0 && ", "}
      {otherUserEventTitles}
    </>
  );

  const eventLocationsMap = new Map<string, boolean>();

  eventData
    .filter((event) => user?._id === event.createdBy._id)
    .forEach((event) => {
      if (event.location?.city && event.location.city !== defaultLocation) {
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
        filters
          ? eventData.length > 0
            ? "event--today"
            : "event--past"
          : isToday
            ? "event--today"
            : isWeekend && isPast
              ? "event--weekend-past"
              : isWeekend
                ? "event--weekend"
                : "event--default"
      } ${isPast && !isToday ? "event--past" : ""} ${isSelected ? "event--selected font-bold" : ""}`}
      onClick={() => {
        setActiveDay(currentDate);
        if (sidebarContent === "search") {
          setSidebarContent("events");
        }
      }}
    >
      <div className="border-r py-1 text-center flex-shrink-0 w-12 event-date">
        {currentDate.format("ddd D")}
      </div>

      <div className="truncate p-1">{eventTitles}</div>
      {eventLocation && showLocations && (
        <div className="text-xs p-0.5 border rounded ml-auto mr-0.5 max-w-24 truncate flex-shrink-0">
          {eventLocation}
        </div>
      )}
    </div>
  );
};
