import { useMemo } from "react";

import { useEventsFree } from "../../contexts/SearchEvents/hooks/useEventsFree";
import { SearchProvider } from "../../contexts/SearchEvents/SearchEventsContext";
import { useIsMobile } from "../../hooks/use-mobile";
import useUser from "../../hooks/user/useUser";
import { Event } from "../../types/globalTypes";
import { EventsDesktop } from "./desktop/EventsDesktop";
import useGetEventCategories from "./hooks/useGetEventCategories";
import useGetEvents from "./hooks/useGetEvents";
import { EventsMobile } from "./mobile/EventsMobile";

const Events = () => {
  const { user } = useUser();
  const { events } = useGetEvents();
  const { eventCategories } = useGetEventCategories();
  const isMobile = useIsMobile();

  const userEvents = events.filter(
    (event: Event) => event.createdBy._id === user?._id
  );

  const eventsFree = useEventsFree({
    events: userEvents,
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
