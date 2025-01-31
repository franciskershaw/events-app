import {
  SearchProvider,
  useSearch,
} from "../../contexts/SearchEvents/SearchEventsContext";
import EventCards from "./components/EventCards/EventCards";
import EventsNavbarTop from "./components/EventsNavbarTop/EventsNavbarTop";
import FiltersDrawer from "./components/FiltersDrawer/FiltersDrawer";
import useGetEventCategories from "./hooks/useGetEventCategories";
import useGetEvents from "./hooks/useGetEvents";

const Events = () => {
  const { events } = useGetEvents();
  const { eventCategories } = useGetEventCategories();

  return (
    <SearchProvider eventsDb={events} categories={eventCategories}>
      <EventsWithSearch />
    </SearchProvider>
  );
};

const EventsWithSearch = () => {
  const { query, setQuery, filteredEvents } = useSearch();

  return (
    <>
      <EventsNavbarTop query={query} setQuery={setQuery} />
      {filteredEvents.length === 0 ? (
        <p className="p-4">No events found.</p>
      ) : (
        <EventCards />
      )}
      <FiltersDrawer />
    </>
  );
};

export default Events;
