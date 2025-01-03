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
  const { eventCategorySelectOptions } = useGetEventCategories();
  const initialEvents = React.useMemo(() => events || [], [events]);

  const categories = React.useMemo(
    () =>
      eventCategorySelectOptions.map((category) => ({
        _id: { $oid: category.value },
        name: category.label,
      })),
    [eventCategorySelectOptions]
  );

  return (
    <SearchProvider initialEvents={initialEvents} categories={categories}>
      <EventsWithSearch />
    </SearchProvider>
  );
};

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
