// useContactAnimation.js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Đăng ký tính năng cuộn trang với GSAP
// ScrollTrigger là cái tính năng mình muốn đk
gsap.registerPlugin(ScrollTrigger);

export function useContactAnimation(containerRef) {
  useGSAP(
    () => {
      // Header animation
      // gsap.fromTo( Vật_thể, {Trạng_thái_Bắt_đầu}, {Trạng_thái_Kết_thúc} ).
      gsap.fromTo(
        ".contact__header",
        { y: 30, opacity: 0 }, // Trạng thái bắt đầu (nằm tụt xuống dưới 30px và tàng hình)
        {
          y: 0, // Đích đến là vị trí ban đầu (không bị tụt nữa)
          opacity: 1, // Đích đến là hiện rõ nét hoàn toàn
          duration: 0.8, // Thời gian chạy hiệu ứng kéo dài 0.8 giây
          ease: "power2.out", // Kiểu chuyển động lao ra nhanh rồi hãm phanh chậm dần rất êm
          scrollTrigger: {
            trigger: ".contact__header", // vật làm mốc
            start: "top 85%", // Điểm bắt đầu kích hoạt
            // Khi cạnh trên của trigger:.. chạm vào mốc 85% của màn hình, hiệu ứng sẽ CHẠY.
          },
        },
      );

      // Info blocks stagger
      gsap.fromTo(
        ".contact__info-block",
        { x: -30, opacity: 0 }, // Trạng thái bắt đầu (nằm lệch sang bên trái 30px và tàng hình)
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15, // Hiệu ứng gợn sóng! Cứ sau 0.15 giây thì khối tiếp theo mới được bay ra (không bay cùng một lúc)
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact__info-card",
            start: "top 85%",
          },
        },
      );

      // Form panel animation
      gsap.fromTo(
        ".contact__form-panel",
        { x: 50, opacity: 0 }, // Trạng thái bắt đầu (nằm lệch sang bên phải 50px và tàng hình)
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out", // Kiểu chuyển động giống power2 nhưng độ hãm phanh mượt và nghệ thuật hơn một chút
          scrollTrigger: {
            trigger: ".contact__form-panel", //Khi cuộn chuột đến cái khung điền Form
            start: "top 85%",
          },
        },
      );

      // Map animation
      gsap.fromTo(
        ".contact__map-card",
        { scale: 0.95, opacity: 0 }, // Trạng thái bắt đầu (bị thu nhỏ lại còn 95% kích thước thật và tàng hình)
        {
          scale: 1, // Phóng to về đúng kích thước chuẩn 100%
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact__map-card", // Khi cuộn chuột chạm đến khung Bản đồ
            start: "top 90%", // Vừa ló dạng ở cạnh dưới màn hình một chút (mốc 90%) là phóng to ra luôn
          },
        },
      );
    },
    // Giới hạn phạm vi! Dặn GSAP chỉ tìm các class ở trên NẰM BÊN TRONG containerRef này thôi,
    // không tìm lung tung sang trang khác
    { scope: containerRef },
  );
}
