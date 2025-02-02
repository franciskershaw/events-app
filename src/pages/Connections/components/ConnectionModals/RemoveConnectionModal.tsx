import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useRemoveConnection from "../../hooks/useRemoveConnection";

const RemoveConnectionModal = ({ _id }: { _id: string }) => {
  const removeConnection = useRemoveConnection();

  const onDelete = () => {
    if (_id) {
      removeConnection.mutate({ _id });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Remove Connection
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Modal for confirming removal of connection
        </DialogDescription>
        <div className="text-center space-y-5">
          <div className="">
            <p>Are you sure you want to remove this connection?</p>
          </div>

          <div className="flex justify-center items-center gap-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={onDelete} variant="destructive">
              Remove
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveConnectionModal;
