import { formatDate, isWeekend } from "@/lib/utils";
import { EventFree } from "@/types/globalTypes";

import { Badge } from "../../../../components/ui/badge";
import { useModals } from "../../../../contexts/Modals/ModalsContext";

const EventFreeCard = ({ event }: { event: EventFree }) => {
  const { openEventModal } = useModals();
  const formattedDate = formatDate(event.date);
  const weekend = isWeekend(event.date.start);

  return (
    <div
      className={`border rounded-md shadow-sm bg-white hover:shadow-md transition-all cursor-pointer ${
        weekend ? "border-blue-500" : "border-gray-200"
      }`}
      onClick={() =>
        openEventModal(
          {
            _id: "",
            title: "",
            date: { start: event.date.start, end: "" },
            category: { _id: "", name: "", icon: "" },
            sharedWith: "",
            createdBy: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          "addFromFreeEvent"
        )
      }
    >
      <div className="flex items-center justify-between text-sm px-4 py-2">
        <span className="text-muted-foreground">{formattedDate}</span>
        <Badge variant="secondary">Free</Badge>
      </div>
    </div>
  );
};

export default EventFreeCard;
