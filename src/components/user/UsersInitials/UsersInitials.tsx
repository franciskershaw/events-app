import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useModals } from "../../../contexts/Modals/ModalsContext";
import useUser from "../../../hooks/user/useUser";
import UserInitials from "../UserInitials/UserInitials";

const UsersInitials = () => {
  const { user } = useUser();
  const { openConnectionsModal } = useModals();

  const connections = user?.connections.filter((user) => !user.hideEvents);

  const firstThreeUsers = connections ? connections.slice(0, 3) : [];
  const extraUserCount = connections ? connections.length - 3 : 0;

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => openConnectionsModal()}
    >
      <UserInitials size="md" name={user?.name} />

      {firstThreeUsers.map((user, index) => {
        const positionClasses = [
          "absolute top-[-8px] left-[-4px]",
          "absolute top-[50%] translate-y-[-50%] left-[-12px]",
          "absolute bottom-[-8px] left-[-4px]",
        ];

        return (
          <div key={index} className={positionClasses[index]}>
            <UserInitials size="sm" name={user.name} colour="dark" />
          </div>
        );
      })}

      {extraUserCount > 0 && (
        <Avatar className="h-5 w-5 bg-primary text-primary-foreground absolute bottom-[-8px] left-[-4px]">
          <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
            +{extraUserCount + 1}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default UsersInitials;
