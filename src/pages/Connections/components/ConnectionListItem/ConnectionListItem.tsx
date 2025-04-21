import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import useUpdateConnectionPreferences from "../../hooks/useUpdateConnectionPreferences";
import RemoveConnectionModal from "../ConnectionModals/RemoveConnectionModal";

interface ConnectionListItemProps {
  connection: {
    _id: string;
    name: string;
    hideEvents: boolean;
  };
}

const ConnectionListItem = ({ connection }: ConnectionListItemProps) => {
  const { mutate: updateConnectionVisibility, isPending } =
    useUpdateConnectionPreferences();

  return (
    <div className="rounded-md border bg-background p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* First row on mobile: Name and visibility indicator */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex-shrink-0">
              {connection.hideEvents ? (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Eye className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <h3 className="font-semibold truncate">{connection.name}</h3>
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              ({connection.hideEvents ? "Hidden" : "Visible"})
            </span>
          </div>
          
          {/* Mobile-only visibility status */}
          <div className="text-xs text-muted-foreground sm:hidden">
            {connection.hideEvents ? "Hidden" : "Visible"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => {
              updateConnectionVisibility({
                connectionId: connection._id,
                hideEvents: !connection.hideEvents,
              });
            }}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            disabled={isPending}
          >
            {connection.hideEvents ? "Show events" : "Hide events"}
          </Button>
          <RemoveConnectionModal _id={connection._id} />
        </div>
      </div>
    </div>
  );
};

export default ConnectionListItem;
