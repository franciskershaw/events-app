import { format } from "date-fns";

import { Event } from "@/types/globalTypes";

interface UseShareEventProps {
  event: Event;
}

const useShareEvent = ({ event }: UseShareEventProps) => {
  const eventTime = format(new Date(event.date.start), "h:mmaaa");
  const eventDay = format(new Date(event.date.start), "EEEE do MMM");

  let message = `I'm going to ${event.title}`;

  if (event.location?.venue) {
    message += ` at ${event.location.venue}`;
  }

  message += ` at ${eventTime} on ${eventDay}`;

  return message;
};

export default useShareEvent;
