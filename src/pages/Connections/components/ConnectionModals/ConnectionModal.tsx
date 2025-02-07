import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ConnectionFormContent from "../ConnectionForm/ConnectionFormContent";

const ConnectionModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">Connect with a friend</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Connect with Friends
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Share your events with friends by either generating a code or entering
            theirs
          </DialogDescription>
        </DialogHeader>
        <ConnectionFormContent inputId="modal-connection-id" />
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionModal;
