import { useEffect, useMemo } from "react";

import dayjs from "dayjs";

import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";

import useGetEventCategories from "../../hooks/useGetEventCategories";

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
    selectedLocation,
    setSelectedLocation,
    filteredEvents,
    locations,
    showEventsFree,
    setShowEventsFree,
  } = useSearch();

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

  const { eventCategorySelectOptions } = useGetEventCategories();
  const categories = useMemo(() => {
    return [
      ...eventCategorySelectOptions.map((option) => ({
        label: option.label,
        value: option.label,
      })),
    ];
  }, [eventCategorySelectOptions]);

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
  };
};

export default useFiltersDrawer;
