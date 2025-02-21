import { Event } from "@/types/globalTypes";

import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { getInitials } from "../../../../components/user/UserInitials/UserInitials";
import useIsUserEvent from "../../../../hooks/user/useIsUserEvent";

export const UserEventInitials = ({ event }: { event: Event }) => {
  const isUserEvent = useIsUserEvent(event);

  if (isUserEvent === true) return;

  return (
    <Avatar className="h-6 w-6 bg-primary text-primary-foreground">
      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
        {getInitials(event.createdBy.name)}
      </AvatarFallback>
    </Avatar>
  );
};
