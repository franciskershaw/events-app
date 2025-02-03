import { Button } from "@/components/ui/button";
import { useModals } from "@/contexts/Modals/ModalsContext";
import { Event } from "@/types/globalTypes";

import useToggleConfirmEvent from "../../hooks/useToggleConfirmEvent";

interface EventCardActionsProps {
  event: Event;
}

const EventCardActions = ({ event }: EventCardActionsProps) => {
  const { openEventModal, openDeleteEventModal } = useModals();
  const { mutate: toggleEventConfirmation } = useToggleConfirmEvent();

  return (
    <div className="flex gap-2">
      {event.unConfirmed && (
        <Button
          size="round"
          onClick={() =>
            toggleEventConfirmation({
              eventId: event._id,
              unConfirmed: event.unConfirmed,
            })
          }
        >
          Confirm
        </Button>
      )}
      <Button
        size="round"
        onClick={() => openEventModal({ ...event, _id: "" }, "copy")}
      >
        Copy
      </Button>
      <Button size="round" onClick={() => openEventModal(event, "edit")}>
        Edit
      </Button>
      <Button size="round" onClick={() => openDeleteEventModal(event)}>
        Delete
      </Button>
    </div>
  );
};

export default EventCardActions;
