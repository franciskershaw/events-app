import { useMemo } from "react";

import dayjs from "dayjs";
import { FaChevronUp, FaRegCalendar } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateTime } from "@/components/ui/date-time";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";

import useGetEventCategories from "../../../../pages/Events/hooks/useGetEventCategories";
import { BasicSelect } from "../../../ui/select";

const EventsNavbarBottom = () => {
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
    locations,
  } = useSearch();

  const { eventCategorySelectOptions } = useGetEventCategories();
  const categories = useMemo(() => {
    return [
      ...eventCategorySelectOptions.map((option) => ({
        label: option.label,
        value: option.label,
      })),
    ];
  }, [eventCategorySelectOptions]);

  // Handlers for date changes
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

    return filters;
  }, [query, startDate, endDate, selectedCategory, selectedLocation]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div
          className="fixed bottom-0 left-0 right-0 h-6 bg-gray-100 rounded-t-lg z-30 flex justify-center items-center cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <FaChevronUp className="text-gray-400" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription className="sr-only">
            Adjust date ranges and view options
          </DrawerDescription>
        </DrawerHeader>
        {appliedFilters.length > 0 && (
          <div className="mx-[-1rem] px-4 py-2 mb-4 bg-gray-200 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm whitespace-nowrap min-w-min">
              {appliedFilters.map((filter, index) => (
                <button onClick={() => removeFilter(filter.type)} key={index}>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {filter.label}
                    <span className="ml-0.5">✕</span>
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col justify-center items-center space-y-4 pb-4">
          <div className="grid grid-cols-2 gap-2 w-full">
            <BasicSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories}
              placeholder="Categories"
            />
            <BasicSelect
              value={selectedLocation}
              onChange={setSelectedLocation}
              options={locations}
              placeholder="Locations"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <DateTime
              placeholder="Start date"
              value={startDate || null}
              onChange={handleStartDateChange}
            />
            <DateTime
              placeholder="End date"
              value={endDate || null}
              onChange={handleEndDateChange}
              minDate={startDate || undefined}
            />
          </div>
          <div className="flex gap-2">
            <Button size="round" onClick={() => setQuery("today")}>
              D
            </Button>
            <Button size="round" onClick={() => setQuery("this week")}>
              W
            </Button>
            <Button size="round" onClick={() => setQuery("this month")}>
              M
            </Button>
            <Button size="round">
              <FaRegCalendar />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EventsNavbarBottom;
