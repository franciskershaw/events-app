import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import useFormattedDate from "../../../hooks/utility/useFormattedDate";
import useFormattedTime from "../../../hooks/utility/useFormattedTime";
import useGetWeekend from "../../../hooks/utility/useGetWeekend";
import {
  EventCategory,
  EventDate,
  EventLocation,
} from "../../../types/globalTypes";

export interface EventCardProps {
  event: {
    _id: string;
    title: string;
    date: EventDate;
    location: EventLocation;
    category: EventCategory;
    createdBy: string;
    sharedWith: string[];
    createdAt: string;
    description?: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const {
    location,
    title,
    category,
    createdBy,
    sharedWith,
    createdAt,
    description,
  } = event;

  const [isOpen, setIsOpen] = useState(false);
  const toggleBody = () => setIsOpen((prev) => !prev);

  const date = useFormattedDate(event.date);
  const time = useFormattedTime(event.date);
  const isWeekend = useGetWeekend(event.date.start);

  return (
    <div className="event-card">
      {/* TOZO: Work out best way to truncate information in header */}
      <div
        className={`event-card-header flex items-center space-x-2 box rounded-md p-2 relative cursor-pointer ${isWeekend && "border-4"}`}
        onClick={toggleBody}
      >
        {/* TOZO: Write get user and initials */}
        {/* <div className="absolute rounded-full box top-[-16px] left-[-16px] bg-white h-8 w-8 flex justify-center items-center">
          FK
        </div> */}
        <div className="box p-1 rounded-md min-w-[75px] text-center whitespace-nowrap">
          <p>{date}</p>
        </div>
        <h2 className="truncate">{title}</h2>
        {location && location.city && (
          <div className="absolute box rounded-md top-[-22px] right-[-16px] bg-white p-0.5">
            <p>{location.city}</p>
          </div>
        )}
      </div>
      <motion.div
        className="event-card-body box mx-2 border-t-0 rounded-md rounded-t-none overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{
          height: { duration: 0.3 },
          opacity: { duration: isOpen ? 0.1 : 0.3 },
        }}
      >
        {/* Meta */}
        <div className="flex space-x-1 p-1 w-full overflow-x-auto whitespace-nowrap bg-gray-200">
          {location && location.venue && (
            <div className="box rounded-md p-1">
              <p>{location.venue}</p>
            </div>
          )}
          <div className="box rounded-md p-1">
            <p>{time}</p>
          </div>
          <div className="box rounded-md p-1">
            <p>{category.name}</p>
          </div>
        </div>
        <div className="p-2 space-y-2">
          {/* Description */}
          {description && (
            <div className="box rounded-md p-1">
              <p>{description}</p>
            </div>
          )}
          {/* Buttons */}
          <div className="flex justify-center space-x-2">
            <Button size="round">Copy</Button>
            <Button size="round">Edit</Button>
            <Button size="round">Delete</Button>
            <Button size="round">Private</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventCard;
