import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ConnectionModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [connectionId, setConnectionId] = useState<string>("");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Share your events!</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Modal for adding a new connection and sharing your connection ID with
          others.
        </DialogDescription>
        <div className="space-y-4">
          <Button size="lg" className="w-full">
            Generate Connection ID
          </Button>
          <p className="text-sm text-start">
            Connection with others allows them to see your events and add them
            to their calendar, but you can make certain events private and
            remove connections if you wish.
          </p>
          <div className="space-y-2">
            <DialogTitle className="text-xl text-center">
              Enter a connection ID to connect
            </DialogTitle>
            <p className="text-sm text-start">
              Add someone's connection ID to connect with them.
            </p>

            <Input
              id="connection-id"
              type="text"
              placeholder="Enter our connection ID"
              className="w-full"
              value={connectionId}
              onChange={(e) => setConnectionId(e.target.value)}
            />
            <Button size="lg" className="w-full">
              Add Connection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionModal;
