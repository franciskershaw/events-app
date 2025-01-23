import { useState } from "react";

import {
  SearchProvider,
  useSearch,
} from "../../contexts/SearchEvents/SearchEventsContext";
import EventCards from "./components/EventCards/EventCards";
import EventsNavbarTop from "./components/EventsNavbarTop/EventsNavbarTop";
import FiltersDrawer from "./components/FIltersDrawer/FiltersDrawer";
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
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  return (
    <>
      <EventsNavbarTop
        query={query}
        setQuery={setQuery}
        activeFilterCount={activeFilterCount}
      />
      {filteredEvents.length === 0 ? (
        <p className="p-4">No events found.</p>
      ) : (
        <EventCards />
      )}
      <FiltersDrawer setActiveFilterCount={setActiveFilterCount} />
    </>
  );
};

export default Events;
