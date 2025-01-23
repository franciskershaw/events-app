import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleLongPressStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      setLongPressTriggered(false);

      longPressTimeout.current = setTimeout(() => {
        setLongPressTriggered(true);
        onLongPress();
      }, delay);
    },
    [onLongPress, delay]
  );

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }, []);

  useEffect(() => {
    const element = containerRef.current;

    if (element) {
      const handleTouchStart = (e: TouchEvent) => {
        handleLongPressStart(e as unknown as React.TouchEvent);
      };

      const handleTouchEnd = () => {
        handleLongPressEnd();
        if (!longPressTriggered) {
          onClick();
        }
      };

      element.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      element.addEventListener("touchend", handleTouchEnd);

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [handleLongPressStart, handleLongPressEnd, longPressTriggered, onClick]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleLongPressStart}
      onMouseUp={() => {
        handleLongPressEnd();
        if (!longPressTriggered) {
          onClick();
        }
      }}
      onMouseLeave={handleLongPressEnd}
    >
      {children}
    </div>
  );
};

export default LongPress;
