import useUser from "../../../hooks/user/useUser";
import UserInitials from "../UserInitials/UserInitials";

const UsersInitials = () => {
  const { user } = useUser();

  const users = [
    { name: "Franny Kersh" },
    { name: "Micky Kilcoolbobs" },
    { name: "Char The chark" },
    { name: "Bron Blindy Blind" },
  ];

  const firstThreeUsers = users.slice(0, 3);
  const extraUserCount = users.length - 3;

  return (
    <div className="relative">
      <UserInitials size="md" name={user?.user.name} />

      {firstThreeUsers.map((user, index) => {
        const positionClasses = [
          "absolute top-[-8px] right-[-4px]",
          "absolute top-[50%] translate-y-[-50%] right-[-12px]",
          "absolute bottom-[-8px] right-[-4px]",
        ];

        return (
          <div key={index} className={positionClasses[index]}>
            <UserInitials size="sm" name={user.name} />
          </div>
        );
      })}

      {extraUserCount > 0 && (
        <div className="h-5 w-5 rounded-full box p-2 flex justify-center items-center absolute bottom-[-8px] right-[-4px]">
          <span className="text-[10px] uppercase">+{extraUserCount + 1}</span>
        </div>
      )}
    </div>
  );
};

export default UsersInitials;
