import React from "react";

type Size = "sm" | "md" | "lg";

interface UserInitialsProps {
  size?: Size;
  name?: string;
}

const getInitials = (name: string) => {
  if (!name) return "";

  return name
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

const UserInitials: React.FC<UserInitialsProps> = ({
  size = "md",
  name = "",
}) => {
  const sizeClasses: Record<Size, string> = {
    sm: "h-5 w-5",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const fontSizeClasses: Record<Size, string> = {
    sm: "text-[10px]",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full box p-2 flex justify-center items-center`}
    >
      <span className={`${fontSizeClasses[size]} uppercase`}>
        {getInitials(name)}
      </span>
    </div>
  );
};

export default UserInitials;
