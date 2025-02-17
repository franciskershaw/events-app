import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";

import { useScrollVisibility } from "../../../../../hooks/utility/useScrollVisibility";
import { filterTodayEvents, groupEvents } from "../../../helpers/helpers";
import DateScroller from "../DateScroller/DateScroller";
import EventCard from "./EventCard";

const EventCards = () => {
  const { filteredEvents } = useSearch();
  const isNavbarVisible = useScrollVisibility();

  const todayEvents = filterTodayEvents(filteredEvents);
  const upcomingEvents = groupEvents(
    filteredEvents.filter((event) => !todayEvents.includes(event))
  );

  return (
    <div
      className={`transition-transform duration-300 ${isNavbarVisible ? "translate-y-[0px]" : "-translate-y-[84px]"}`}
    >
      {todayEvents.length > 0 && (
        <>
          <DateScroller label="Today" />
          <div className="space-y-2 px-4 py-5 bg-blue-100">
            {/* {todayEvents.map((event) =>
              showEventsFree ? (
                <EventFreeCard key={event._id} event={event as EventFree} />
              ) : isEventTypeguard(event) ? (
                <EventCard key={event._id} event={event} />
              ) : null
            )} */}
            {todayEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      )}

      {Object.entries(upcomingEvents).map(([month, monthEvents]) => (
        <div key={month}>
          <DateScroller date={monthEvents[0].date.start} />
          {/* <div className="space-y-2 px-4 py-5 bg-blue-100">
            {monthEvents.map((event) =>
              showEventsFree ? (
                <EventFreeCard key={event._id} event={event as EventFree} />
              ) : isEventTypeguard(event) ? (
                <EventCard key={event._id} event={event} />
              ) : null
            )}
          </div> */}
          <div className="space-y-2 px-4 py-5 bg-blue-100">
            {monthEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventCards;
