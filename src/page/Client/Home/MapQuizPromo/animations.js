import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Đăng ký tính năng cuộn trang với GSAP
gsap.registerPlugin(ScrollTrigger);

export function useMapQuizAnimation(containerRef) {
  useGSAP(
    () => {
      // Hiệu ứng trượt lên mượt mà (Fade-up) cho khối Marquee
      // gsap.fromTo( Vật_thể, {Trạng_thái_Bắt_đầu}, {Trạng_thái_Kết_thúc} ).
      gsap.fromTo(
        containerRef.current,
        { y: 30, opacity: 0 }, // Bắt đầu: Tụt xuống dưới 30px và tàng hình
        {
          y: 0, // Đích đến: Trượt ngược lên vị trí gốc
          opacity: 1, // Đích đến: Hiện rõ 100%
          duration: 0.8, // Thời gian chạy hiệu ứng kéo dài 0.8 giây
          ease: "power3.out", // Gia tốc: Bay ra nhanh rồi hãm phanh lại từ từ lúc cuối cho mượt
          scrollTrigger: {
            trigger: containerRef.current, // Vật làm mốc để camera canh me
            start: "top 85%", // Kích hoạt khi ĐỈNH của khối chạm vạch 85% chiều cao màn hình (từ trên xuống)
          },
        },
      );
    },
    // Giới hạn phạm vi tìm kiếm class của GSAP, chỉ quét bên trong khu vực này
    { scope: containerRef }
  );
}
