import { useMemo } from "react";

import dayjs from "dayjs";

import { SearchBar } from "../../../../../components/ui/search-bar";
import { useSearch } from "../../../../../contexts/SearchEvents/SearchEventsContext";
import { formatTime } from "../../../../../lib/utils";
import { Event } from "../../../../../types/globalTypes";
import { EmptyStateNoResults } from "../../../components/EmptyStateNoResults/EmptyStateNoResults";
import Filters from "../../../components/Filters/Filters";
import { UserEventInitials } from "../../../components/UserEventInitials/UserEventInitials";

export const EventsSearch = ({
  eventsByDay,
  filters,
}: {
  eventsByDay: Record<string, Event[]>;
  filters: boolean;
}) => {
  const { activeFilterCount, clearAllFilters, query, setQuery } = useSearch();

  const results = useMemo(() => {
    return Object.entries(eventsByDay).map(([date, events]) => ({
      date,
      events,
    }));
  }, [eventsByDay]);

  return (
    <>
      <div className="date-header m-2 mb-0">
        <h2 className="text-lg font-semibold">Search events</h2>
      </div>
      <div className="px-2">
        <SearchBar
          query={query}
          setQuery={setQuery}
          clearFilters={clearAllFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>
      <div className="p-2 pt-0 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 relative">
          {filters && results.length > 0 && (
            <>
              <h3 className="text-md font-semibold mb-2">Results</h3>
              <ul>
                {results.map(({ date, events }) => (
                  <li key={date} className="mb-4">
                    <h4 className="text-sm font-medium">
                      {dayjs(date).format("dddd Do MMMM")}
                    </h4>
                    <ol>
                      {events.map((event) => (
                        <li
                          key={event._id}
                          className="text-sm text-gray-500 list-disc list-outside ml-4"
                        >
                          <div className="flex gap-1 items-center">
                            <UserEventInitials event={event} />
                            <span>
                              {formatTime(event.date) &&
                                `${formatTime(event.date)}: `}
                              {event.title}
                              {event.unConfirmed && "(?)"}
                              {event.location?.venue &&
                                ` @ ${event.location?.venue}`}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ul>
            </>
          )}
          {results.length === 0 && <EmptyStateNoResults />}
        </div>
        <div className="sticky bottom-0 left-0 right-0">
          <hr className="mb-2"></hr>
          <Filters />
        </div>
      </div>
    </>
  );
};
