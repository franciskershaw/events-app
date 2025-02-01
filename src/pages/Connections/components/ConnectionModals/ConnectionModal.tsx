import { useState } from "react";

import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useUser from "@/hooks/user/useUser";

import useGenerateConnectionId from "../../hooks/useGenerateConnectionId";

const ConnectionModal = () => {
  const [connectionIdInput, setConnectionIdInput] = useState<string>("");

  const { user } = useUser();
  const { mutate: generateId, isPending } = useGenerateConnectionId();

  const connectionId =
    user?.connectionId?.id && dayjs().isBefore(user.connectionId.expiry)
      ? user.connectionId.id
      : undefined;

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!connectionId) {
      generateId();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Connect with a friend</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Connect with Friends
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Share your events with friends by either generating a code or
            entering theirs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Share Your Code Section */}
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-semibold">Share Your Code</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Generate a temporary code to share with friends who want to
              connect with you
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={onClick}
              disabled={isPending}
              type="button"
            >
              {isPending
                ? "Generating..."
                : connectionId
                  ? connectionId
                  : "Generate Connection Code"}
            </Button>
          </div>

          {/* Enter Someone's Code Section */}
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-semibold">Connect with Someone</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Enter a connection code shared with you to connect with a friend
            </p>
            <div className="space-y-3">
              <Input
                id="connection-id"
                type="text"
                placeholder="Enter connection code"
                className="w-full"
                value={connectionIdInput}
                onChange={(e) => setConnectionIdInput(e.target.value)}
              />
              <Button size="lg" className="w-full">
                Connect
              </Button>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can manage visibility of your events and remove connections at
            any time
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionModal;
