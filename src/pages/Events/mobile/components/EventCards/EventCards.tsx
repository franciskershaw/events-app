import { useMemo } from "react";

import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";

import { CATEGORY_FREE } from "../../../../../constants/app";
import { useScrollVisibility } from "../../../../../hooks/utility/useScrollVisibility";
import { filterTodayEvents, groupEvents } from "../../../helpers/helpers";
import DateScroller from "../DateScroller/DateScroller";
import EventCard from "./EventCard";
import EventFreeCard from "./EventFreeCard";

const EventCards = () => {
  const { filteredEvents } = useSearch();
  const isNavbarVisible = useScrollVisibility();

  const todayEvents = useMemo(
    () => filterTodayEvents(filteredEvents),
    [filteredEvents]
  );
  const upcomingEvents = useMemo(
    () =>
      groupEvents(
        filteredEvents.filter((event) => !todayEvents.includes(event))
      ),
    [todayEvents, filteredEvents]
  );

  return (
    <div
      className={`transition-transform duration-300 w-full max-w-[100vw] ${
        isNavbarVisible ? "translate-y-[0px]" : "-translate-y-[84px]"
      }`}
    >
      {todayEvents.length > 0 && (
        <>
          <DateScroller label="Today" />
          <div className="space-y-2 px-4 py-5 bg-blue-100">
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
          <div className="space-y-2 px-4 py-5 bg-blue-100">
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
