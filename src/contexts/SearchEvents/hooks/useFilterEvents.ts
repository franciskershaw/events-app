import { useMemo } from "react";

import { isEventTypeguard } from "../../../pages/Events/helpers/helpers";
import { Event, EventFree } from "../../../types/globalTypes";
import {
  getNestedValue,
  isDateInRange,
  matchesDateComponents,
  parseDateComponents,
  splitQueryParts,
} from "../helpers";

interface UseFilterEventsProps {
  events: Event[] | EventFree[];
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
  return useMemo(() => {
    const { textQuery, dateQuery } = splitQueryParts(query);
    const startDateComponents = parseDateComponents(dateQuery.start);
    const endDateComponents = dateQuery.end
      ? parseDateComponents(dateQuery.end)
      : null;
    const textKeywords = textQuery.split(/\s+/).filter(Boolean);

    return events.filter((event) => {
      // Match text fields (title, venue, city) against each keyword
      const matchesTextQuery = textKeywords.every((keyword) =>
        ["title", "location.venue", "location.city"].some((key) => {
          const value = getNestedValue(event, key);
          return value?.toString().toLowerCase().includes(keyword);
        })
      );

      // Match event date range
      const eventStartDate = new Date(event.date.start);
      const eventEndDate = new Date(event.date.end || event.date.start);

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
            (eventStartDate <= new Date(dateQuery.end) &&
              eventEndDate >= new Date(dateQuery.start))
          : matchesDateComponents(startDateComponents, eventStartDate) ||
            matchesDateComponents(startDateComponents, eventEndDate);

      // Match manual date range
      const matchesManualDateRange =
        (!startDate || eventEndDate >= startDate) &&
        (!endDate || eventStartDate <= endDate);

      if (showEventsFree) {
        return (
          (textKeywords.length === 0 || matchesTextQuery) &&
          matchesQueryDateRange &&
          matchesManualDateRange
        );
      }

      if (!isEventTypeguard(event)) return false;

      // Match categories
      const categoryId = event.category._id;
      const categoryName = categoryLookup[categoryId];
      const matchesCategoryQuery = textKeywords.some((keyword) =>
        categoryName.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchesCategorySelect =
        !selectedCategory ||
        categoryName.toLowerCase() === selectedCategory.toLowerCase();

      // Match location
      const eventCity = event.location?.city?.toLowerCase() || "";
      const eventVenue = event.location?.venue?.toLowerCase() || "";
      const matchesLocation =
        !selectedLocation ||
        eventCity === selectedLocation.toLowerCase() ||
        eventVenue === selectedLocation.toLowerCase();

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
  ]);
};
