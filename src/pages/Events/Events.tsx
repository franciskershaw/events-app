import { useMemo } from "react";

import { LoadingOverlay } from "@/components/ui/loading-overlay";
import usePageTitle from "@/hooks/utility/usePageTitle";

import { useEventsFree } from "../../contexts/SearchEvents/hooks/useEventsFree";
import { SearchProvider } from "../../contexts/SearchEvents/SearchEventsContext";
import useUser from "../../hooks/user/useUser";
import { useIsMobile } from "../../hooks/utility/use-mobile";
import { Event } from "../../types/globalTypes";
import { EventsDesktop } from "./components/desktop/EventsDesktop";
import { EventsMobile } from "./components/mobile/EventsMobile";
import { generateRecurringEvents } from "./helpers/generateRecurringEvents";
import { getFirstAndLastEventDates } from "./helpers/getFirstAndLastEventDates";
import useGetEventCategories from "./hooks/useGetEventCategories";
import useGetEvents from "./hooks/useGetEvents";

const Events = () => {
  const { user } = useUser();
  const { events, fetchingEvents } = useGetEvents();
  const { eventCategories } = useGetEventCategories();
  const isMobile = useIsMobile();

  usePageTitle("Events");

  const userEvents = events.filter(
    (event: Event) => event.createdBy._id === user?._id
  );

  const eventsFree = useEventsFree({
    events: userEvents,
    startDate: null,
    endDate: null,
    query: "",
  });

  const { lastEventDate } = getFirstAndLastEventDates(userEvents);

  const eventsAll = useMemo(() => {
    const allEvents = [...events, ...eventsFree].flatMap((event) =>
      generateRecurringEvents(event, lastEventDate)
    );

    return allEvents.sort(
      (a, b) =>
        new Date(a.date.start).getTime() - new Date(b.date.start).getTime()
    );
  }, [events, eventsFree, lastEventDate]);

  if (fetchingEvents && !events.length) {
    return <LoadingOverlay />;
  }

  return (
    <SearchProvider eventsDb={eventsAll} categories={eventCategories}>
      {isMobile ? <EventsMobile /> : <EventsDesktop />}
    </SearchProvider>
  );
};

export default Events;
