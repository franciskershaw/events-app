import { useEffect, useMemo, useState } from "react";

import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import dayjs from "dayjs";
import { FaCheck, FaRegCopy, FaTimes } from "react-icons/fa";

import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";

import useCreateMessage from "../../../hooks/useCreateMessage";

const useFiltersDrawer = () => {
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
    showEventsFree,
    setShowEventsFree,
    offset,
    activeButton,
    clearAllFilters,
  } = useSearch();

  // Updates active filter number for search bar placeholder

  // Manages applied date ranges
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
  }, [activeButton, offset, dateButtons, setStartDate, setEndDate]);

  // Handles date changes
  const handleStartDateChange = (date: Date | null | undefined) => {
    setStartDate(date || null);
  };

  const handleEndDateChange = (date: Date | null | undefined) => {
    setEndDate(date || null);
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

  // Pushes applied filters to filters UI
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

  // Sets UI and message for copy events
  const [buttonText, setButtonText] = useState("Copy event text");
  const [buttonStatus, setButtonStatus] = useState<
    "default" | "success" | "error"
  >("default");

  const message = useCreateMessage({
    filteredEvents,
    startDate,
    endDate,
    selectedCategory,
    selectedLocation,
    showEventsFree,
  });

  const handleCopyEventClick = () => {
    if (!message) {
      setButtonStatus("error");
      setButtonText("No events");
      resetButton();
      return;
    }

    navigator.clipboard
      .writeText(message)
      .then(() => {
        setButtonStatus("success");
        setButtonText("Events copied");
        resetButton();
      })
      .catch(() => {
        setButtonStatus("error");
        setButtonText("Failed to copy");
        resetButton();
      });
  };

  const resetButton = () => {
    setTimeout(() => {
      setButtonStatus("default");
      setButtonText("Copy event text");
    }, 2000);
  };

  const getIcon = () => {
    switch (buttonStatus) {
      case "error":
        return <FaTimes />;
      case "success":
        return <FaCheck />;
      default:
        return <FaRegCopy />;
    }
  };

  return {
    appliedFilters,
    clearAllFilters,
    removeFilter,
    handleStartDateChange,
    handleEndDateChange,
    dateButtons,
    buttonText,
    buttonStatus,
    handleCopyEventClick,
    getIcon,
  };
};

export default useFiltersDrawer;
