import { useState } from "react";

import dayjs from "dayjs";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUser from "@/hooks/user/useUser";

import useConnectUsers from "../../hooks/useConnectUsers";
import useGenerateConnectionId from "../../hooks/useGenerateConnectionId";

interface ConnectionFormContentProps {
  inputId: string;
  className?: string;
}

const ConnectionFormContent = ({
  inputId,
  className,
}: ConnectionFormContentProps) => {
  const [connectionIdInput, setConnectionIdInput] = useState<string>("");

  const { user } = useUser();
  const { mutate: generateId, isPending } = useGenerateConnectionId();
  const { mutate: connectUsers, isPending: isConnecting } = useConnectUsers();

  const connectionId =
    user?.connectionId?.id && dayjs().isBefore(user.connectionId.expiry)
      ? user.connectionId.id
      : undefined;

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Connection code copied to clipboard!");
    } catch {
      toast.error("Failed to copy code to clipboard");
    }
  };

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (connectionId) {
      await copyToClipboard(connectionId);
    } else {
      generateId(undefined, {
        onSuccess: (data) => {
          copyToClipboard(data.id);
        },
      });
    }
  };

  return (
    <div className={className}>
      <div className="grid gap-6">
        {/* Share Your Code Section */}
        <div className="rounded-lg bg-event border border-highlight-light p-4 shadow-sm">
          <h3 className="mb-2 font-semibold">Share Your Code</h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Generate a temporary code to share with friends who want to connect
            with you
          </p>
          <Button
            size="lg"
            className="w-full"
            onClick={onClick}
            disabled={isPending}
            type="button"
          >
            {isPending ? (
              "Generating..."
            ) : connectionId ? (
              <span className="flex items-center gap-2 justify-center">
                {connectionId}
                <Copy className="h-4 w-4" />
              </span>
            ) : (
              "Generate Connection Code"
            )}
          </Button>
        </div>

        {/* Enter Someone's Code Section */}
        <div className="rounded-lg bg-event border border-highlight-light p-4 shadow-sm">
          <h3 className="mb-2 font-semibold">Connect with Someone</h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Enter a connection code shared with you to connect with a friend
          </p>
          <div className="space-y-3">
            <Input
              id={inputId}
              type="text"
              placeholder="Enter connection code"
              className="w-full"
              value={connectionIdInput}
              onChange={(e) => setConnectionIdInput(e.target.value)}
            />
            <Button
              disabled={isConnecting}
              size="lg"
              className="w-full"
              onClick={() => connectUsers(connectionIdInput)}
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          You can manage visibility of your events and remove connections at any
          time
        </p>
      </div>
    </div>
  );
};

export default ConnectionFormContent;
