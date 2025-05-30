import { FaRegCalendar } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DateTime } from "@/components/ui/date-time";
import LongPress from "@/components/utility/LongPress/LongPress";
import { CATEGORY_FREE } from "@/constants/app";
import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";
import useFilters from "@/pages/Events/components/global/Filters/useFilters";

const Filters = () => {
  const {
    appliedFilters,
    removeFilter,
    handleStartDateChange,
    handleEndDateChange,
    dateButtons,
    buttonText,
    buttonStatus,
    handleCopyEventClick,
    getIcon,
  } = useFilters();

  const {
    filteredEvents,
    showEventsFree,
    setShowEventsFree,
    locations,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    offset,
    setOffset,
    activeButton,
    setActiveButton,
    clearAllFilters,
  } = useSearch();

  const freeEventsCount = filteredEvents.filter(
    (e) => e.category.name === CATEGORY_FREE
  ).length;
  const totalEventsCount = filteredEvents.length;

  return (
    <>
      {appliedFilters.length > 0 && (
        <>
          <div className="text-sm text-center mb-2">
            {showEventsFree
              ? `Showing ${freeEventsCount} free day${freeEventsCount !== 1 ? "s" : ""}`
              : `Showing ${totalEventsCount} result${totalEventsCount !== 1 ? "s" : ""}`}
            .{" "}
            <button
              className="text-highlight hover:underline"
              onClick={clearAllFilters}
            >
              Clear filters ✕
            </button>
          </div>
          <div className="mx-[-1rem] px-4 py-2 mb-4 bg-muted overflow-x-auto">
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
      <div className="flex flex-col justify-center items-center space-y-4 pb-4 md:pb-0">
        <div className="w-full grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-2 lg:grid-cols-2">
          <Combobox
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories}
            placeholder="Categories"
          />
          <Combobox
            value={selectedLocation}
            onChange={setSelectedLocation}
            options={locations}
            placeholder="Locations"
          />
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
              <LongPress
                onLongPress={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setOffset(0);
                  setActiveButton(null);
                }}
                onClick={() => {
                  setOffset((offset) =>
                    activeButton === button.label ? offset + 1 : 0
                  );
                  setActiveButton(button.label);
                }}
              >
                <Button
                  size="round"
                  variant={
                    activeButton === button.label ? "default" : "outline"
                  }
                >
                  {button.label}
                </Button>
              </LongPress>
              {offset > 0 && activeButton === button.label && (
                <div className="text-xs absolute bg-primary border rounded-full w-5 h-5 top-[-4px] right-[-4px] flex justify-center items-center">
                  +{offset}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 md:flex-col md:w-full lg:flex-row">
          <Button
            size="default"
            variant={showEventsFree ? "default" : "outline"}
            onClick={() => setShowEventsFree(!showEventsFree)}
            className="min-w-40 md:hidden"
          >
            <FaRegCalendar />
            {showEventsFree ? "Hide" : "Show"} free days
          </Button>
          <Button
            size="default"
            variant={buttonStatus}
            onClick={handleCopyEventClick}
            className="min-w-40 md:min-w-0 md:w-full"
          >
            {getIcon()}
            {buttonText}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Filters;
