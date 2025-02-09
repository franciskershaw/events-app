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

import useUser from "../../../../hooks/user/useUser";
import ConnectionListItem from "../../../Connections/components/ConnectionListItem/ConnectionListItem";

const ConnectionsModal = () => {
  const { closeModal, isConnectionsModalOpen } = useModals();
  const { user } = useUser();
  const connections = user?.connections;

  return (
    <Dialog open={isConnectionsModalOpen} onOpenChange={closeModal}>
      <DialogContent className="flex flex-col max-h-dvh md:max-h-[90dvh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Connections</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Modal for showing and hiding your connections
        </DialogDescription>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-2">
            {connections?.map((connection) => (
              <ConnectionListItem
                key={connection._id}
                connection={connection}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 px-6 py-4 border-t pb-safe">
          <Button variant="outline" type="button" onClick={closeModal}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionsModal;
