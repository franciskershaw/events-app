import { isToday } from "date-fns";
import { FaLocationDot } from "react-icons/fa6";

import { formatDate, isWeekend } from "@/lib/utils";
import { Event } from "@/types/globalTypes";

import { useModals } from "../../../../../contexts/Modals/ModalsContext";

const EventFreeCard = ({ event }: { event: Event }) => {
  const { openEventModal } = useModals();
  const formattedDate = formatDate(event.date);
  const weekend = isWeekend(event.date.start);
  const today = isToday(event.date.start);

  return (
    <div
      className={`border rounded-md shadow-sm bg-event hover:shadow-md transition-all cursor-pointer ${
        weekend && "event--weekend"
      } ${today ? "event--today" : "mx-2"}`}
      onClick={() =>
        openEventModal(
          {
            _id: "",
            title: "",
            date: { start: event.date.start, end: "" },
            category: { _id: "", name: "", icon: "" },
            location: {
              venue: "",
              city: event.location?.city ? event.location?.city : "",
            },
            createdBy: { _id: "", name: "" },
            createdAt: new Date(),
            updatedAt: new Date(),
            unConfirmed: false,
            private: false,
          },
          "addFromFreeEvent"
        )
      }
    >
      <div className="flex items-center justify-between text-sm px-4 py-2">
        <span>{formattedDate}</span>
        {event.location?.city && (
          <span className="ml-4 font-medium text-sm max-w-[50%] truncate flex items-center gap-1">
            <FaLocationDot /> {event.location.city}
          </span>
        )}
      </div>
    </div>
  );
};

export default EventFreeCard;
