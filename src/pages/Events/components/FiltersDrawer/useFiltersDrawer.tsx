import { useEffect, useMemo, useState } from "react";

import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import dayjs from "dayjs";

import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";

import { isEventTypeguard } from "../../helpers/helpers";

const useFiltersDrawer = (setActiveFilterCount: (count: number) => void) => {
  const {
    query,
    setQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedCategory,
    setSelectedCategory,
    categories,
    selectedLocation,
    setSelectedLocation,
    locations,
    filteredEvents,
    showEventsFree,
    setShowEventsFree,
  } = useSearch();

  // Counts number of active filters for search bar placeholder
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query) count++;
    if (startDate) count++;
    if (endDate) count++;
    if (selectedCategory) count++;
    if (selectedLocation) count++;
    if (showEventsFree) count++;
    return count;
  }, [
    query,
    startDate,
    endDate,
    selectedCategory,
    selectedLocation,
    showEventsFree,
  ]);

  useEffect(() => {
    setActiveFilterCount(activeFilterCount);
  }, [activeFilterCount, setActiveFilterCount]);

  // Handles D, W and M button functionality
  const [offset, setOffset] = useState(0);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const dateButtons = useMemo(() => {
    const now = new Date();
    return [
      {
        label: "D",
        getDates: () => ({
          startDate: startOfDay(addDays(now, offset)),
          endDate: endOfDay(addDays(now, offset)),
        }),
      },
      {
        label: "W",
        getDates: () => ({
          startDate: startOfWeek(addDays(now, offset * 7), { weekStartsOn: 1 }),
          endDate: endOfWeek(addDays(now, offset * 7), { weekStartsOn: 1 }),
        }),
      },
      {
        label: "M",
        getDates: () => ({
          startDate: startOfMonth(addMonths(now, offset)),
          endDate: endOfMonth(addMonths(now, offset)),
        }),
      },
    ];
  }, [offset]);

  useEffect(() => {
    if (activeButton) {
      const button = dateButtons.find((b) => b.label === activeButton);
      if (button) {
        const { startDate, endDate } = button.getDates();
        setStartDate(startDate);
        setEndDate(endDate);
      }
    }
  }, [activeButton, offset, dateButtons]);

  // const { eventCategorySelectOptions } = useGetEventCategories();
  // const categories = useMemo(() => {
  //   return [
  //     ...eventCategorySelectOptions.map((option) => ({
  //       label: option.label,
  //       value: option.label,
  //     })),
  //   ];
  // }, [eventCategorySelectOptions]);

  const handleStartDateChange = (date: Date | null | undefined) => {
    setStartDate(date || null);
  };

  const handleEndDateChange = (date: Date | null | undefined) => {
    setEndDate(date || null);
  };

  const clearAllFilters = () => {
    setQuery("");
    setStartDate(null);
    setEndDate(null);
    setSelectedCategory("");
    setSelectedLocation("");
    setShowEventsFree(false);
    setOffset(0);
    setActiveButton(null);
  };

  // Remove specific filters
  const removeFilter = (type: string) => {
    switch (type) {
      case "query":
        setQuery("");
        break;
      case "startDate":
        setStartDate(null);
        break;
      case "endDate":
        setEndDate(null);
        break;
      case "category":
        setSelectedCategory("");
        break;
      case "location":
        setSelectedLocation("");
        break;
      case "freeDays":
        setShowEventsFree(false);
        break;
      default:
        break;
    }
  };

  const appliedFilters = useMemo(() => {
    const filters: { label: string; type: string }[] = [];

    if (query) {
      filters.push({ label: `"${query}"`, type: "query" });
    }

    if (startDate) {
      filters.push({
        label: `From: ${dayjs(startDate).format("DD/MM/YYYY")}`,
        type: "startDate",
      });
    }

    if (endDate) {
      filters.push({
        label: `To: ${dayjs(endDate).format("DD/MM/YYYY")}`,
        type: "endDate",
      });
    }

    if (selectedCategory) {
      filters.push({
        label: `Category: ${selectedCategory}`,
        type: "category",
      });
    }

    if (selectedLocation) {
      filters.push({
        label: `Location: ${selectedLocation}`,
        type: "location",
      });
    }

    if (showEventsFree) {
      filters.push({
        label: `Free days`,
        type: "freeDays",
      });
    }

    return filters;
  }, [
    query,
    startDate,
    endDate,
    selectedCategory,
    selectedLocation,
    showEventsFree,
  ]);

  const createMessage = () => {
    const eventsNum = filteredEvents.length;

    if (eventsNum === 0) {
      return "";
    }

    const formatDate = (dateString: string) => {
      return format(new Date(dateString), "EEE do MMM");
    };

    const firstDate = formatDate(filteredEvents[0].date.start);
    const lastDate = formatDate(filteredEvents[eventsNum - 1].date.start);

    const getCategoryText = (category: string, count: number) => {
      const lowerCaseCategory = category.toLowerCase();
      return `${lowerCaseCategory}${
        !lowerCaseCategory.endsWith("s") && count > 1 ? "s" : ""
      }`;
    };

    const formatEvents = () =>
      filteredEvents
        .map((event) => {
          if (isEventTypeguard(event)) {
            return `- ${formatDate(event.date.start)}: ${event.title}${
              event.location?.venue ? ` @ ${event.location.venue}` : ""
            }`;
          }
          return null;
        })
        .join("\n");

    if (showEventsFree) {
      const eventsFree = filteredEvents
        .map((event) => `- ${formatDate(event.date.start)}`)
        .join("\n");

      // Free events - "I am free on 2 days between Sat 22nd Jan and Fri 2nd Feb:"
      return `I am free on ${eventsNum} day${eventsNum > 1 ? "s" : ""} between ${firstDate} and ${lastDate}: \n${eventsFree}`;
    } else {
      const events = formatEvents();

      // Events - "I have 3 plans between Sat 22nd Jan and Fri 2nd Feb:"
      let baseMessage = `I have ${eventsNum} plan${eventsNum > 1 ? "s" : ""} between ${firstDate} and ${lastDate}:`;

      // Events with category - "I have 3 gigs between Sat 22nd Jan and Fri 2nd Feb:"
      if (selectedCategory) {
        baseMessage = `I have ${eventsNum} ${getCategoryText(selectedCategory, eventsNum)} between ${firstDate} and ${lastDate}:`;
      }

      // Events with category and location - "I have 3 gigs in Bristol between Sat 22nd Jan and Fri 2nd Feb:"
      if (selectedCategory && selectedLocation) {
        baseMessage = `I have ${eventsNum} ${getCategoryText(selectedCategory, eventsNum)} in ${selectedLocation} between ${firstDate} and ${lastDate}:`;
      }

      return `${baseMessage}\n${events}`;
    }
  };

  return {
    filteredEvents,
    locations,
    categories,
    appliedFilters,
    clearAllFilters,
    removeFilter,
    handleStartDateChange,
    handleEndDateChange,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    showEventsFree,
    setShowEventsFree,
    dateButtons,
    offset,
    setOffset,
    activeButton,
    setActiveButton,
    createMessage,
  };
};

export default useFiltersDrawer;
