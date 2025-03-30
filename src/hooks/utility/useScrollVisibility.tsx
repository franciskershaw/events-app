import { useEffect, useRef, useState } from "react";

export const useScrollVisibility = (threshold = 50, bottomOffset = 100) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isAtBottom =
        documentHeight - (currentScrollY + windowHeight) < bottomOffset;
      setIsNearBottom(isAtBottom);

      if (
        currentScrollY > lastScrollYRef.current &&
        currentScrollY > threshold &&
        !isAtBottom
      ) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollYRef.current || isAtBottom) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold, bottomOffset]);

  return { isVisible, isNearBottom };
};
