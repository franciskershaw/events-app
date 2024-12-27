import { useState } from "react";

import { motion } from "framer-motion";

import { useModals } from "@/contexts/ModalsContext";

import { Button } from "../../../components/ui/button";
import { formatDate, formatTime, isWeekend } from "../../../lib/utils";
import { Event } from "../../../types/globalTypes";

const EventCard = ({ event }: { event: Event }) => {
  const { location, title, category, description } = event;
  const [isOpen, setIsOpen] = useState(false);
  const { openEventModal, openDeleteEventModal } = useModals();

  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.date);
  const weekend = isWeekend(event.date.start);

  const toggleBody = () => setIsOpen((prev) => !prev);

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all">
      <div
        className={`flex flex-col gap-2 p-4 rounded-t-lg cursor-pointer ${
          weekend && "border-l-4 border-blue-500"
        }`}
        onClick={toggleBody}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold truncate flex-1">{title}</h2>

          {location?.city && (
            <span className="ml-4 text-gray-700 font-medium">
              📍 {location.city}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">{formattedDate}</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
            {category.name}
          </span>
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="border-t border-gray-200 overflow-hidden"
      >
        <div className="p-4 bg-gray-50 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {location?.venue && (
              <span className="px-2 py-1 bg-gray-200 rounded-md">
                {location.venue}
              </span>
            )}
            <span className="px-2 py-1 bg-gray-200 rounded-md">
              {formattedTime}
            </span>
            <span className="px-2 py-1 bg-gray-200 rounded-md">
              {category.name}
            </span>
          </div>

          {description && (
            <p className="text-gray-700 leading-relaxed">{description}</p>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button size="round">Copy</Button>
            <Button size="round" onClick={() => openEventModal(event)}>
              Edit
            </Button>
            <Button size="round" onClick={() => openDeleteEventModal(event)}>
              Delete
            </Button>
            <Button size="round">Private</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventCard;
