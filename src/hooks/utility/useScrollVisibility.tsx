import { useEffect, useState } from "react";

export const useScrollVisibility = (threshold = 50, bottomOffset = 100) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isAtBottom =
        documentHeight - (currentScrollY + windowHeight) < bottomOffset;
      setIsNearBottom(isAtBottom);

      if (
        currentScrollY > lastScrollY &&
        currentScrollY > threshold &&
        !isAtBottom
      ) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || isAtBottom) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, threshold, bottomOffset]);

  return { isVisible, isNearBottom };
};
