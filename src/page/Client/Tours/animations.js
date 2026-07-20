import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Hook cho Sidebar Filter
export const useSidebarAnimation = (containerRef) => {
  useGSAP(() => {
    gsap.fromTo(
      ".tour-filter__section",
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );
  }, { scope: containerRef });
};

// Hook cho Header Search
export const useSearchAnimation = (containerRef) => {
  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { y: -30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
        },
      }
    );
  }, { scope: containerRef });
};

// Hook cho Tour List / Grid
export const useTourListAnimation = (containerRef, tours, loading) => {
  useGSAP(() => {
    // Chỉ chạy animation khi đã load xong và có dữ liệu
    if (loading || tours.length === 0) return;

    // Animation cho Toolbar
    gsap.fromTo(
      ".tour-results__toolbar",
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    );

    // Animation cho các thẻ Tour (Grid / List) - Kích hoạt riêng cho TỪNG thẻ khi nó vào màn hình
    const cards = gsap.utils.toArray(".tour-card");
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%", // Chỉ chạy khi đỉnh của thẻ tour chạm mức 95% màn hình
          },
        }
      );
    });
  }, { scope: containerRef, dependencies: [tours, loading] });
};
