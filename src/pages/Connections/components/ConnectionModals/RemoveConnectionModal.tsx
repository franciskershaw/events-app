import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useRemoveConnection from "../../hooks/useRemoveConnection";

interface RemoveConnectionModalProps {
  _id: string;
}

const RemoveConnectionModal = ({ _id }: RemoveConnectionModalProps) => {
  const { mutate: removeConnection, isPending } = useRemoveConnection();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Connection</DialogTitle>
          <DialogDescription className="flex flex-col gap-1">
            <span>Are you sure you want to remove this connection?</span>
            <span className="font-bold">
              You will no longer see their events.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => removeConnection({ _id })}
            disabled={isPending}
          >
            {isPending ? "Removing..." : "Remove Connection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveConnectionModal;
