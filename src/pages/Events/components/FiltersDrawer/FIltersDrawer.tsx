import { useRef } from "react";

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

import { Combobox } from "../../../../components/ui/combobox";
import { useSearch } from "../../../../contexts/SearchEvents/SearchEventsContext";
import useFiltersDrawer from "./useFiltersDrawer";

export interface FiltersDrawerProps {
  setActiveFilterCount: (count: number) => void;
}

const FiltersDrawer = ({ setActiveFilterCount }: FiltersDrawerProps) => {
  const {
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
    dateButtons,
    offset,
    setOffset,
    activeButton,
    setActiveButton,
  } = useFiltersDrawer(setActiveFilterCount);
  const { showEventsFree, setShowEventsFree } = useSearch();

  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLongPressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    longPressTimeout.current = setTimeout(() => {
      console.log("Long press!");
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

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
          <>
            <div className="text-sm text-center mb-2">
              Showing {filteredEvents.length} result
              {filteredEvents.length !== 1 ? "s" : ""}.{" "}
              <button
                className="text-blue-500 hover:underline"
                onClick={clearAllFilters}
              >
                Clear filters ✕
              </button>
            </div>
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
          </>
        )}
        <div className="flex flex-col justify-center items-center space-y-4 pb-4">
          <div className="grid grid-cols-2 gap-4 w-full">
            <Combobox
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories}
              placeholder="Categories"
              role="add"
              disabled={showEventsFree}
            />
            <Combobox
              value={selectedLocation}
              onChange={setSelectedLocation}
              options={locations}
              placeholder="Locations"
              disabled={showEventsFree}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
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
            {dateButtons.map((button) => (
              <div className="relative" key={button.label}>
                <Button
                  size="round"
                  variant={
                    activeButton === button.label ? "outline" : "default"
                  }
                  onClick={() => {
                    setOffset((prevOffset) =>
                      activeButton === button.label ? prevOffset + 1 : 0
                    );
                    setActiveButton(button.label);
                  }}
                  onMouseDown={(e) => handleLongPressStart(e)}
                  onMouseUp={handleLongPressEnd}
                  onTouchStart={(e) => handleLongPressStart(e)}
                  onTouchEnd={handleLongPressEnd}
                >
                  {button.label}
                </Button>
                {offset > 0 && activeButton === button.label && (
                  <div className="text-xs absolute bg-white border rounded-full w-5 h-5 top-[-4px] right-[-4px] flex justify-center items-center">
                    +{offset}
                  </div>
                )}
              </div>
            ))}
            <Button
              size="round"
              variant={showEventsFree ? "outline" : "default"}
              onClick={() => setShowEventsFree(!showEventsFree)}
            >
              <FaRegCalendar />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FiltersDrawer;
