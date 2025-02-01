import { SearchProvider } from "../../contexts/SearchEvents/SearchEventsContext";
import { useViewport } from "../../contexts/Viewport/ViewportContext";
import { EventsDesktop } from "./desktop/EventsDesktop";
import useGetEventCategories from "./hooks/useGetEventCategories";
import useGetEvents from "./hooks/useGetEvents";
import { EventsMobile } from "./mobile/EventsMobile";

const Events = () => {
  const { events } = useGetEvents();
  const { eventCategories } = useGetEventCategories();
  const { isMobile } = useViewport();

  return (
    <SearchProvider eventsDb={events} categories={eventCategories}>
      {isMobile ? <EventsMobile /> : <EventsDesktop />}
    </SearchProvider>
  );
};

export default Events;
