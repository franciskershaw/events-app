import { Event } from "@/types/globalTypes";

import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { getInitials } from "../../../../components/user/UserInitials/UserInitials";
import { isUserEvent } from "../../helpers/helpers";

export const UserEventInitials = ({ event }: { event: Event }) => {
  const userEvent = isUserEvent({ event });

  if (userEvent === true) return;

  return (
    <Avatar className="h-6 w-6 bg-primary text-primary-foreground">
      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
        {getInitials(event.createdBy.name)}
      </AvatarFallback>
    </Avatar>
  );
};
