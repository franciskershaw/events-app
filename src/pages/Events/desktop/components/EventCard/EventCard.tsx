import { useState } from "react";

import { motion } from "framer-motion";

import { Event } from "@/types/globalTypes";

import { formatDate, formatTime } from "../../../../../lib/utils";
import EventCardActions from "../../../components/EventCardActions/EventCardActions";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  let hoverTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      setIsHovered(true);
    }, 250);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      setIsHovered(false);
    }, 500);
  };

  return (
    <li
      className="border-b p-2 cursor-pointer relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        {formatTime(event.date) && <span>{formatTime(event.date)}: </span>}
        {/* TODO: Go through category icons and map to React icon elements */}
        {/* <span>{event.category.icon}</span> */}
        <span>{event.title}</span>
        {event.unConfirmed && <span>(?)</span>}

        <div className="text-xs text-gray-500">
          {formatDate(event.date) && <span>{formatDate(event.date)} | </span>}
          <span>{event.category.name}</span>
          {event.location?.venue && <span> | {event.location?.venue}</span>}
          {event.location?.venue && <span> | {event.location?.city}</span>}
        </div>
        {event.description && (
          <div className="text-xs text-gray-500 italic mt-1">
            {event.description}
          </div>
        )}
      </div>
      <motion.div
        className="absolute top-0 bottom-0 left-0 right-0 transform -translate-y-full flex items-center justify-center bg-white bg-opacity-80"
        initial={{ x: 50, opacity: 0 }}
        animate={{
          x: isHovered ? 0 : 50,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <EventCardActions event={event} />
      </motion.div>
    </li>
  );
};

export default EventCard;
