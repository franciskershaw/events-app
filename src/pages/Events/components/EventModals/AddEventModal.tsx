import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModals } from "@/contexts/Modals/ModalsContext";

import AddEventForm from "./AddEventForm";

const AddEventModal = () => {
  const { selectedEvent, closeModal, isEventModalOpen, mode } = useModals();
  const id = selectedEvent?._id || "addEvent";
  return (
    <Dialog open={isEventModalOpen} onOpenChange={closeModal}>
      <DialogContent className="flex flex-col max-h-dvh md:max-h-[90dvh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {mode === "copy"
              ? "Copy event"
              : selectedEvent
                ? "Edit event"
                : "Add event"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Modal for adding a new event
        </DialogDescription>

        <div className="flex-1 overflow-y-auto px-6">
          <AddEventForm formId={id} />
        </div>

        <DialogFooter className="flex flex-col gap-2 px-6 py-4 border-t pb-safe">
          <Button variant="outline" type="button" onClick={closeModal}>
            Cancel
          </Button>
          <Button form={id} type="submit">
            {mode === "copy"
              ? "Create copy"
              : selectedEvent
                ? "Save changes"
                : "Add event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
