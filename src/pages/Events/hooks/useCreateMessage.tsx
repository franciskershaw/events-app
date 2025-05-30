import { useMemo } from "react";

import { format } from "date-fns";
import dayjs from "dayjs";

import { Event } from "@/types/globalTypes";

import { CATEGORY_FREE, LOCATION_DEFAULT } from "../../../constants/app";

interface UseCreateMessageProps {
  filteredEvents: Event[];
  startDate: Date | null;
  endDate: Date | null;
  selectedCategory: string;
  selectedLocation: string;
  showEventsFree: boolean;
}

const useCreateMessage = ({
  filteredEvents,
  startDate,
  endDate,
  selectedCategory,
  selectedLocation,
  showEventsFree,
}: UseCreateMessageProps) => {
  const createMessage = useMemo(() => {
    const eventsNum = filteredEvents.length;
    const freeEventsNum = filteredEvents.filter(
      (e) => e.category.name === CATEGORY_FREE
    ).length;

    if (eventsNum === 0) {
      return "";
    }

    const formatDate = (dateString: string) => {
      return format(new Date(dateString), "EEE do MMM");
    };

    const firstDate = startDate
      ? dayjs(startDate).format("Do MMM")
      : formatDate(filteredEvents[0].date.start);
    const lastDate = endDate
      ? dayjs(endDate).format("Do MMM")
      : formatDate(filteredEvents[eventsNum - 1].date.start);

    const getCategoryText = (category: string, count: number) => {
      const lowerCaseCategory = category.toLowerCase();
      return `${lowerCaseCategory}${
        !lowerCaseCategory.endsWith("s") && count > 1 ? "s" : ""
      }`;
    };

    const formatEvents = () =>
      filteredEvents
        .map((event) => {
          return `- ${formatDate(event.date.start)}: ${event.title}${
            event.location?.venue ? ` @ ${event.location.venue}` : ""
          }`;
        })
        .join("\n");

    if (showEventsFree) {
      const eventsFree = filteredEvents
        .filter((e) => e.category.name === CATEGORY_FREE)
        .map((event) => {
          const date = formatDate(event.date.start);
          const city = event.location?.city;

          return `- ${date}${city && city !== LOCATION_DEFAULT ? ` (${city})` : ""}`;
        })
        .join("\n");

      // Free events
      return `I am free on ${freeEventsNum} day${freeEventsNum > 1 ? "s" : ""} between ${firstDate} and ${lastDate}: \n${eventsFree}`;
    } else {
      const events = formatEvents();

      // Events
      let baseMessage = `I have ${eventsNum} plan${
        eventsNum > 1 ? "s" : ""
      } between ${firstDate} and ${lastDate}:`;

      if (selectedCategory) {
        baseMessage = `I have ${eventsNum} ${getCategoryText(
          selectedCategory,
          eventsNum
        )} between ${firstDate} and ${lastDate}:`;
      }

      if (selectedCategory && selectedLocation) {
        baseMessage = `I have ${eventsNum} ${getCategoryText(
          selectedCategory,
          eventsNum
        )} in ${selectedLocation} between ${firstDate} and ${lastDate}:`;
      }

      return `${baseMessage}\n${events}`;
    }
  }, [
    filteredEvents,
    startDate,
    endDate,
    selectedCategory,
    selectedLocation,
    showEventsFree,
  ]);

  return createMessage;
};

export default useCreateMessage;
