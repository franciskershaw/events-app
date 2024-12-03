import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModals } from "@/contexts/ModalsContext";

const AddEventModal = ({
  open,
  onOpenChange,
  //   closeModal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeModal: () => void;
}) => {
  const { selectedEvent } = useModals();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit event" : "Add event"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Modal for adding a new event
        </DialogDescription>
        <div>Form here</div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;