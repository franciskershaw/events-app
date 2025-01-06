import NavbarBottom from "../../components/layout/navigation/EventsNavbarBottom/EventsNavbarBottom";
import EventsNavbarTop from "../../components/layout/navigation/EventsNavbarTop/EventsNavbarTop";
import {
  SearchProvider,
  useSearch,
} from "../../contexts/SearchEvents/SearchEventsContext";
import EventCards from "./components/EventCards";
import useGetEventCategories from "./hooks/useGetEventCategories";
import useGetEvents from "./hooks/useGetEvents";

const Events = () => {
  const { events } = useGetEvents();
  const { eventCategories } = useGetEventCategories();

  return (
    <SearchProvider initialEvents={events} categories={eventCategories}>
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
      <NavbarBottom />
    </>
  );
};

export default Events;
