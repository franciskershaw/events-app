import { ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  type?: "h1" | "h2" | "h3" | "h4";
  fontWeight?:
    | "font-thin"
    | "font-extralight"
    | "font-light"
    | "font-normal"
    | "font-medium"
    | "font-semibold"
    | "font-bold"
    | "font-extrabold"
    | "font-black";
  className?: string;
}

const Heading = ({
  children,
  type = "h1",
  fontWeight = "font-normal",
  className = "",
}: HeadingProps) => {
  const headingStyles = {
    h1: "text-2xl md:text-3xl",
    h2: "text-xl md:text-2xl",
    h3: "text-lg md:text-xl",
    h4: "text-base md:text-lg",
  };

  const Tag = type;
  const styles = `${headingStyles[type]} ${fontWeight} ${className}`;

  return <Tag className={styles}>{children}</Tag>;
};

export default Heading;
