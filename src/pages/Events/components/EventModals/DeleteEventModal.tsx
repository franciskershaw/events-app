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

import useDeleteEvent from "../../hooks/useDeleteEvent";

const DeleteEventModal = () => {
  const { selectedEvent, closeModal, isDeleteEventModalOpen } = useModals();

  const deleteEvent = useDeleteEvent();

  const onDelete = () => {
    if (selectedEvent?._id) {
      deleteEvent.mutate(
        { _id: selectedEvent?._id },
        { onSuccess: closeModal }
      );
    }
  };
  return (
    <Dialog open={isDeleteEventModalOpen} onOpenChange={closeModal}>
      <DialogContent className="text-center md:text-left">
        <DialogHeader>
          <DialogTitle>Delete event</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-1">
          <span>
            Are you sure you want to delete '{selectedEvent?.title}'?{" "}
          </span>
          <span className="font-bold">This action cannot be undone.</span>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onDelete} variant={"destructive"}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEventModal;
