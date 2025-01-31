import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Delete event
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Modal for confirming deletion
        </DialogDescription>
        <div className="text-center space-y-5">
          <div className="">
            <p>Are you sure you want to delete '{selectedEvent?.title}'?</p>
            <p className="font-bold">This action cannot be undone.</p>
          </div>

          <div className="flex justify-center items-center gap-6">
            <Button variant={"outline"} onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={onDelete} variant={"destructive"}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEventModal;
