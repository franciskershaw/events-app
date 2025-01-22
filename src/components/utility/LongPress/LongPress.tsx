import React, { useRef, useState } from "react";

interface LongPressProps {
  children: React.ReactNode;
  onLongPress: () => void;
  onClick: () => void;
  delay?: number;
}

const LongPress: React.FC<LongPressProps> = ({
  children,
  onLongPress,
  onClick,
  delay = 500,
}) => {
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const [longPressTriggered, setLongPressTriggered] = useState(false);

  const handleLongPressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setLongPressTriggered(false);

    longPressTimeout.current = setTimeout(() => {
      setLongPressTriggered(true);
      onLongPress();
    }, delay);
  };

  const handleLongPressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  return (
    <div
      onMouseDown={handleLongPressStart}
      onMouseUp={() => {
        handleLongPressEnd();
        if (!longPressTriggered) {
          onClick();
        }
      }}
      onMouseLeave={handleLongPressEnd}
      onTouchStart={handleLongPressStart}
      onTouchEnd={() => {
        handleLongPressEnd();
        if (!longPressTriggered) {
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
};

export default LongPress;
