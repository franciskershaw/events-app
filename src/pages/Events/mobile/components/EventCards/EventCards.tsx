import { useMemo } from "react";

import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";

import { CATEGORY_FREE, NAV_HEIGHT } from "../../../../../constants/app";
import { useScrollVisibility } from "../../../../../hooks/utility/useScrollVisibility";
import { filterTodayEvents, groupEvents } from "../../../helpers/helpers";
import DateScroller from "../DateScroller/DateScroller";
import EventCard from "./EventCard";
import EventFreeCard from "./EventFreeCard";

const EventCards = () => {
  const { filteredEvents } = useSearch();
  const { isVisible: isNavbarVisible, isNearBottom } = useScrollVisibility();

  const filteredEventsWithoutPast = filteredEvents.filter((event) => {
    const eventEndDate = new Date(event.date.end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventEndDate >= today;
  });

  const todayEvents = useMemo(
    () => filterTodayEvents(filteredEvents),
    [filteredEvents]
  );
  const upcomingEvents = useMemo(
    () =>
      groupEvents(
        filteredEventsWithoutPast.filter(
          (event) => !todayEvents.includes(event)
        )
      ),
    [todayEvents, filteredEventsWithoutPast]
  );

  return (
    <div
      className="transition-transform duration-300 w-full max-w-[100vw]"
      style={{
        transform: isNearBottom
          ? "none"
          : `translateY(${isNavbarVisible ? "0px" : `-${NAV_HEIGHT}`})`,
      }}
    >
      {todayEvents.length > 0 && (
        <>
          <DateScroller label="Today" />
          <div className="space-y-2 px-4 py-5 bg-primary-lightest">
            {todayEvents.map((event) =>
              event.category._id === CATEGORY_FREE ? (
                <EventFreeCard key={event._id} event={event} />
              ) : (
                <EventCard key={event._id} event={event} />
              )
            )}
          </div>
        </>
      )}

      {Object.entries(upcomingEvents).map(([month, monthEvents]) => (
        <div key={month}>
          <DateScroller date={monthEvents[0].date.start} />
          <div className="space-y-2 px-4 py-5 bg-primary-lightest">
            {monthEvents.map((event) =>
              event.category._id === CATEGORY_FREE ? (
                <EventFreeCard key={event._id} event={event} />
              ) : (
                <EventCard key={event._id} event={event} />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventCards;
