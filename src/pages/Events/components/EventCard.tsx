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
  console.log(event);

  const date = useFormattedDate(event.date);

  return (
    <div className="event-card box rounded-md p-2 relative">
      <div className="event-card-header flex items-center space-x-2">
        {/* <div className="absolute rounded-full box top-[-16px] left-[-16px] bg-white h-8 w-8 flex justify-center items-center">
          FK
        </div> */}
        <div className="box p-1 rounded-md">
          <span>{date}</span>
        </div>
        <h2>{event.title}</h2>
        {/* <div>{event.location}</div> */}
      </div>
    </div>
  );
};

export default EventCard;
