import React, { useEffect } from "react";
import HeroCarousel from "./HeroCarousel";
import Tour from "../Tours";
import Contact from "../Contact";
import About from "../About";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Home() {
  // Tự động refresh ScrollTrigger khi layout thay đổi (do load ảnh/dữ liệu)
  useEffect(() => {
    // Khởi tạo một Đối tượng từ ResizeObserver
    // ResizeObserver là một API trong JavaScript dùng để theo dõi sự thay đổi kích thước hiển thị html
    // khi kích thước thay đổi nó chạy vào hàm `() => {}`
    // Các phương thức thường dùng
    // observer.observe(element): Bắt đầu theo dõi một phần tử cụ thể.
    // observer.unobserve(element): Ngừng theo dõi phần tử.
    // observer.disconnect(): Dừng theo dõi tất cả các phần tử đã đăng ký.
    // observer.disconnect(); khi người dùng rời khỏi trang này ko theo dõi nữa
    const observer = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      // Xóa sạch toàn bộ mốc cuộn cũ lửng lơ trong bộ nhớ khi rời trang Home
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="home-page">
      <HeroCarousel />

      <Tour />

      <About />

      <Contact />
    </div>
  );
}

export default Home;
