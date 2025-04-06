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
    <div className="flex items-center justify-between rounded-md border bg-background p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-2">
        {connection.hideEvents === true ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
        <h3 className="font-semibold">{connection.name}</h3>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            updateConnectionVisibility({
              connectionId: connection._id,
              hideEvents: !connection.hideEvents,
            });
          }}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isPending}
        >
          {connection.hideEvents ? (
            <>
              <span>Show events</span>
            </>
          ) : (
            <>
              <span>Hide events</span>
            </>
          )}
        </Button>
        <RemoveConnectionModal _id={connection._id} />
      </div>
    </div>
  );
};

export default ConnectionListItem;
