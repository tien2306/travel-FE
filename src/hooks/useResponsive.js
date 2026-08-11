import { useState, useEffect } from "react";

export function useResponsive(delay = 150) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, delay);
    };

    window.addEventListener("resize", debouncedResize);
    
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return windowWidth;
}
