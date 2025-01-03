import React from "react";

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
  const { eventCategorySelectOptions } = useGetEventCategories(); // Fetch categories
  const initialEvents = React.useMemo(() => events || [], [events]);

  // Transform categories to match the expected structure
  const categories = React.useMemo(
    () =>
      eventCategorySelectOptions.map((category) => ({
        _id: { $oid: category.value }, // Transform value into _id.$oid
        name: category.label, // Transform label into name
      })),
    [eventCategorySelectOptions]
  );

  return (
    <SearchProvider initialEvents={initialEvents} categories={categories}>
      <EventsWithSearch />
    </SearchProvider>
  );
};

// Use search context for filtering
const EventsWithSearch = () => {
  const { query, setQuery, filteredEvents } = useSearch();

  return (
    <>
      <EventsNavbarTop query={query} setQuery={setQuery} />
      <div className="p-4">
        {filteredEvents.length === 0 ? <p>No events found.</p> : <EventCards />}
      </div>
    </>
  );
};

export default Events;
