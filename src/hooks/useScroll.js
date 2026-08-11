import { useState, useEffect } from "react";

export function useScroll() {
  const [scrollY, setScrollY] = useState(
    typeof window !== "undefined" ? window.scrollY : 0
  );

  useEffect(() => {
    let requestAnimationFrameId;

    const handleScroll = () => {
      // Sử dụng requestAnimationFrame để tối ưu hiệu năng cuộn chuột, tránh lag trang
      requestAnimationFrameId = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(requestAnimationFrameId);
    };
  }, []);

  return scrollY;
}
