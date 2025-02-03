import { useRef, useState } from "react";

import { isToday } from "date-fns";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, isWeekend } from "@/lib/utils";
import { Event } from "@/types/globalTypes";

import SwipeableIndicator from "../../../../../components/utility/SwipeableIndicator/SwipeableIndicator";
import EventCardActions from "../../../components/EventCardActions/EventCardActions";

const EventCard = ({ event }: { event: Event }) => {
  const { location, title, category, description } = event;
  const [isOpen, setIsOpen] = useState(false);
  const [isSwiped, setIsSwiped] = useState(false);
  const swipeBlockRef = useRef(false);
  const duration = 0.3;

  const toggleBody = () => {
    if (!swipeBlockRef.current && !isSwiped) {
      setIsOpen((prev) => !prev);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setIsSwiped(true);
      setIsOpen(false);
      blockToggleTemporarily();
    },
    onSwipedRight: () => {
      setIsSwiped(false);
      blockToggleTemporarily();
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const blockToggleTemporarily = () => {
    swipeBlockRef.current = true;
    setTimeout(() => {
      swipeBlockRef.current = false;
    }, duration * 1000);
  };

  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.date);
  const weekend = isWeekend(event.date.start);
  const today = isToday(event.date.start);

  const handleClick = () => {
    if (description || location?.venue || formattedTime) {
      toggleBody();
    }
  };

  return (
    <div
      className={`relative border rounded-md shadow-sm bg-white hover:shadow-md transition-all overflow-x-hidden event ${
        weekend && "event--weekend"
      } ${
        today && "event--today"
      } ${event.unConfirmed === true ? "border-dashed" : ""}`}
      {...swipeHandlers}
    >
      <div onClick={handleClick}>
        {/* Main event card */}
        <div
          className={`relative flex flex-col gap-3 p-4 cursor-pointer z-10 ${event.unConfirmed === true ? "opacity-50" : ""}`}
        >
          <SwipeableIndicator orientation="vertical" alignment="right" />
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm truncate flex-1">{title}</h2>
            {location?.city && (
              <span className="ml-4 font-medium text-sm">
                📍 {location.city}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formattedDate}</span>
            <Badge variant="secondary">{category.name}</Badge>
          </div>
        </div>
        {/* Action buttons */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 bg-white bg-opacity-80 z-20"
          style={{ width: "100%" }}
          initial={{ translateX: "100%" }}
          animate={{ translateX: isSwiped ? 0 : "100%" }}
          transition={{ duration }}
        >
          <div className="relative flex items-center justify-center h-full">
            <SwipeableIndicator orientation="vertical" alignment="left" />
            <EventCardActions event={event} />
          </div>
        </motion.div>
      </div>
      {/* Additional event card info */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: duration }}
        className="overflow-hidden rounded-b-md"
      >
        <div className="px-4 pb-4 pt-0 space-y-4">
          {(location?.venue || formattedTime) && (
            <div className="mx-[-1rem] px-4 py-2 bg-gray-200 overflow-x-auto">
              <div className="flex items-center gap-2 text-sm whitespace-nowrap min-w-min">
                {location?.venue && (
                  <Badge variant="secondary">{location.venue}</Badge>
                )}
                {formattedTime && (
                  <Badge variant="secondary">{formattedTime}</Badge>
                )}
              </div>
            </div>
          )}

          {description && (
            <p className="text-sm leading-relaxed">{description}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EventCard;
