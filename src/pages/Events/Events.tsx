import { useMemo } from "react";

import { useEventsFree } from "../../contexts/SearchEvents/hooks/useEventsFree";
import { SearchProvider } from "../../contexts/SearchEvents/SearchEventsContext";
import { useIsMobile } from "../../hooks/use-mobile";
import { EventsDesktop } from "./desktop/EventsDesktop";
import useGetEventCategories from "./hooks/useGetEventCategories";
import useGetEvents from "./hooks/useGetEvents";
import { EventsMobile } from "./mobile/EventsMobile";

const Events = () => {
  const { events } = useGetEvents();
  const { eventCategories } = useGetEventCategories();
  const isMobile = useIsMobile();

  const eventsFree = useEventsFree({
    eventsDb: events,
    startDate: null,
    endDate: null,
    query: "",
  });

  const eventsAll = useMemo(
    () =>
      [...events, ...eventsFree].sort(
        (a, b) =>
          new Date(a.date.start).getTime() - new Date(b.date.start).getTime()
      ),
    [events, eventsFree]
  );

  return (
    <SearchProvider eventsDb={eventsAll} categories={eventCategories}>
      {isMobile ? <EventsMobile /> : <EventsDesktop />}
    </SearchProvider>
  );
};

export default Events;
