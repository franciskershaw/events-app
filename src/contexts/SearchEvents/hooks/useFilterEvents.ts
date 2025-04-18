import { useMemo } from "react";

import dayjs from "dayjs";

import { CATEGORY_FREE } from "../../../constants/app";
import useUser from "../../../hooks/user/useUser";
import { filterUserEvents } from "../../../pages/Events/helpers/filterUserEvents";
import { Event } from "../../../types/globalTypes";
import {
  getNestedValue,
  isDateInRange,
  matchesDateComponents,
  parseDateComponents,
  splitQueryParts,
} from "../helpers";

interface UseFilterEventsProps {
  events: Event[];
  query: string;
  startDate: Date | null;
  endDate: Date | null;
  showEventsFree: boolean;
  selectedCategory: string;
  selectedLocation: string;
  categoryLookup: Record<string, string>;
}

export const useFilterEvents = ({
  events,
  query,
  startDate,
  endDate,
  showEventsFree,
  selectedCategory,
  selectedLocation,
  categoryLookup,
}: UseFilterEventsProps) => {
  const { user } = useUser();

  return useMemo(() => {
    const { textQuery, dateQuery } = splitQueryParts(query);
    const startDateComponents = parseDateComponents(dateQuery.start);
    const endDateComponents = dateQuery.end
      ? parseDateComponents(dateQuery.end)
      : null;
    const textKeywords = textQuery.split(/\s+/).filter(Boolean);

    let filteredEvents = [...events];
    filteredEvents = filterUserEvents(filteredEvents, user);

    return filteredEvents.filter((event) => {
      // Include/exclude free events
      const isEventFree = event.category._id === CATEGORY_FREE;
      if (!showEventsFree && isEventFree) return false;

      // Match text fields (title, venue, city) against each keyword
      const matchesTextQuery = textKeywords.every((keyword) =>
        ["title", "location.venue", "location.city"].some((key) => {
          const value = getNestedValue(event, key);
          return value?.toString().toLowerCase().includes(keyword);
        })
      );

      // Match event date range
      const eventStartDate = dayjs(event.date.start).toDate();
      const eventEndDate = dayjs(event.date.end || event.date.start).toDate();

      // Match parsed date range from query
      const matchesQueryDateRange =
        endDateComponents && startDateComponents
          ? isDateInRange(
              eventStartDate,
              startDateComponents,
              endDateComponents
            ) ||
            isDateInRange(
              eventEndDate,
              startDateComponents,
              endDateComponents
            ) ||
            (eventStartDate <= dayjs(dateQuery.end).toDate() &&
              eventEndDate >= dayjs(dateQuery.start).toDate())
          : matchesDateComponents(startDateComponents, eventStartDate) ||
            matchesDateComponents(startDateComponents, eventEndDate);

      // Match manual date range
      const matchesManualDateRange =
        (!startDate || eventEndDate >= startDate) &&
        (!endDate || eventStartDate <= endDate);

      // Match location
      const eventCity = event.location?.city?.toLowerCase() || "";
      const eventVenue = event.location?.venue?.toLowerCase() || "";
      const matchesLocation =
        !selectedLocation ||
        eventCity === selectedLocation.toLowerCase() ||
        eventVenue === selectedLocation.toLowerCase();

      // Match categories
      const categoryId = event.category._id;
      const categoryName = categoryLookup[categoryId] || CATEGORY_FREE;
      const matchesCategoryQuery = textKeywords.some((keyword) =>
        categoryName.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchesCategorySelect =
        !selectedCategory ||
        categoryName.toLowerCase() === selectedCategory.toLowerCase();

      return (
        (textKeywords.length === 0 ||
          matchesTextQuery ||
          matchesCategoryQuery) &&
        matchesCategorySelect &&
        matchesLocation &&
        matchesQueryDateRange &&
        matchesManualDateRange
      );
    });
  }, [
    events,
    query,
    startDate,
    endDate,
    showEventsFree,
    selectedCategory,
    selectedLocation,
    categoryLookup,
    user,
  ]);
};
