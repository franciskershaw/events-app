import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Size = "sm" | "md" | "lg" | "xl";
type Colour = "default" | "dark";

interface UserInitialsProps {
  size?: Size;
  colour?: Colour;
  name?: string;
}

export const getInitials = (name: string) => {
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
  colour = "default",
  name = "",
}) => {
  const sizeClasses: Record<Size, string> = {
    sm: "h-5 w-5",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-32 w-32",
  };

  const fontSizeClasses: Record<Size, string> = {
    sm: "text-[10px]",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-4xl",
  };

  const colourClasses: Record<Colour, string> = {
    default: "text-primary",
    dark: "bg-primary text-primary-foreground",
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarFallback
        className={`${fontSizeClasses[size]} ${colourClasses[colour]}`}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserInitials;
