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

  const { title, button } = (() => {
    switch (mode) {
      case "edit":
        return {
          title: "Edit event",
          button: "Save changes",
        };
      case "copy":
      case "copyFromConnection":
        return {
          title: "Copy event",
          button: "Create copy",
        };
      case "addFromFreeEvent":
      case "add":
      default:
        return {
          title: "Add event",
          button: "Add event",
        };
    }
  })();

  return (
    <Dialog open={isEventModalOpen} onOpenChange={closeModal}>
      <DialogContent className="flex flex-col max-h-dvh md:max-h-[90dvh] p-0 bg-background">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{title}</DialogTitle>
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
            {button}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
