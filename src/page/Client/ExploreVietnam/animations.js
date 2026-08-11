import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Đăng ký tính năng cuộn trang với GSAP
gsap.registerPlugin(ScrollTrigger);

export function useExploreAnimation(containerRef) {
  useGSAP(
    () => {
      // 1. Hiệu ứng tiêu đề
      gsap.fromTo(
        ".explore__header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".explore__header",
            start: "top 85%",
          },
        },
      );

      // 2. Hiệu ứng lưới ảnh
      gsap.fromTo(
        ".explore__column",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15, // Cột 1 -> Cột 2 -> Cột 3 lần lượt hiện lên
          ease: "power3.out", //  Bay ra nhanh rồi hãm phanh chậm dần cực mượt
          scrollTrigger: {
            trigger: ".explore__grid",
            start: "top 80%",
          },
        },
      );
    },
    { scope: containerRef },
  );
}
