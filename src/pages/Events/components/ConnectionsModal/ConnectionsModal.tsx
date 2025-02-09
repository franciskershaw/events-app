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

const ConnectionsModal = () => {
  const { closeModal, isConnectionsModalOpen } = useModals();

  return (
    <Dialog open={isConnectionsModalOpen} onOpenChange={closeModal}>
      <DialogContent className="flex flex-col max-h-dvh md:max-h-[90dvh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>hello</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Modal for adding a new event
        </DialogDescription>

        <div className="flex-1 overflow-y-auto px-6">boop</div>

        <DialogFooter className="flex flex-col gap-2 px-6 py-4 border-t pb-safe">
          <Button variant="outline" type="button" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit">hello</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionsModal;
