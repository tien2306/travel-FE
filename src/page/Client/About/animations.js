import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Đăng ký tính năng cuộn trang với GSAP
gsap.registerPlugin(ScrollTrigger);

export function useAboutAnimation(containerRef) {
  useGSAP(
    () => {
      // gsap.fromTo( Vật_thể, {Trạng_thái_Bắt_đầu}, {Trạng_thái_Kết_thúc} ).
      // Khung ảnh bên trái
      gsap.fromTo(
        ".about__gallery",
        { x: -50, opacity: 0 }, //  ẩn bên trái 50
        {
          x: 0, //  Về lại ban đầu
          opacity: 1, // hiện
          duration: 1, //  Chạy trong vòng 1 giây
          ease: "power3.out", //  Bay ra nhanh rồi hãm phanh chậm dần cực mượt
          scrollTrigger: {
            trigger: ".about__gallery", //  Khi cuộn đến khung ảnh
            start: "top 80%", //  Đỉnh khung ảnh chạm mốc 80% màn hình là chạy
          },
        },
      );

      // Khối chữ tiêu đề và mô tả
      gsap.fromTo(
        [".about__subtitle", ".about__title", ".about__description"], //  Truyền một mảng để gom cả 3 nhóm chữ chạy chung hiệu ứng
        { y: 30, opacity: 0 }, //  ẩn dưới 30px
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2, //  Hiệu ứng xếp hàng! Cứ cách 0.2 giây thì chữ tiếp theo mới bay lên (Subtitle -> Title -> Description)
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about__content", //  Vật làm mốc là toàn bộ vùng chứa chữ
            start: "top 85%", //  Vừa chạm mốc 85% màn hình là kích hoạt xếp hàng bay lên
          },
        },
      );

      // Danh sách các tiện ích đi kèm
      gsap.fromTo(
        ".about__feature-item",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about__features", //  Vật làm mốc là vùng chứa danh sách tiện ích
            start: "top 90%", //  Vừa ló dạng ở sát đáy màn hình (90%) là chạy luôn
          },
        },
      );

      // Nút bấm hành động
      gsap.fromTo(
        ".about__action",
        { y: 20, opacity: 0 }, //  ẩn dưới 20
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.4, //  Chờ thêm 0.4 giây sau khi kích hoạt rồi mới thèm chạy
          ease: "back.out(1.7)", //  Hiệu ứng nảy! Nút bay vọt quá đích một chút rồi mới thụt nhẹ lại nhìn rất đàn hồi
          scrollTrigger: {
            trigger: ".about__action", //  Vật làm mốc là chính cái nút bấm
            start: "top 95%", //  Gần như chạm đáy màn hình là kích hoạt hiệu ứng chờ (delay)
          },
        },
      );
    },
    //  Giới hạn phạm vi tìm kiếm class của GSAP, chỉ quét bên trong khu vực About này
    { scope: containerRef },
  );
}
