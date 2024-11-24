import { motion } from "framer-motion";
import { useState } from "react";
import useFormattedDate from "../../../hooks/utility/useFormattedDate";
import { EventCategory, EventDate } from "../../../types/globalTypes";

export interface EventCardProps {
  event: {
    _id: string;
    title: string;
    date: EventDate;
    location: string;
    category: EventCategory;
    createdBy: string;
    sharedWith: string[];
    createdAt: string;
    updatedAt: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleBody = () => setIsOpen((prev) => !prev);

  const date = useFormattedDate(event.date);

  return (
    <div className="event-card">
      <div
        className="event-card-header flex items-center space-x-2 box rounded-md p-2 relative cursor-pointer"
        onClick={toggleBody}
      >
        {/* <div className="absolute rounded-full box top-[-16px] left-[-16px] bg-white h-8 w-8 flex justify-center items-center">
          FK
        </div> */}
        <div className="box p-1 rounded-md">
          <span>{date}</span>
        </div>
        {/* <h2>{event.title}</h2> */}
        <h2>Francis I love you!!</h2>
        {/* <div>{event.location}</div> */}
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
        <h1 className="text-9xl">HELLO</h1>
      </motion.div>
    </div>
  );
};

export default EventCard;
