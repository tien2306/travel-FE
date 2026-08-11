import React, { useEffect } from "react";
import HeroCarousel from "./HeroCarousel";
import ToursAll from "../Tours/ToursAll";
import Contact from "../Contact";
import About from "../About";
import ExploreVietnam from "../ExploreVietnam";
import MapQuizPromo from "./MapQuizPromo";
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
      // Lưu ý: Không được dùng ScrollTrigger.getAll().kill() ở đây
      // vì React 18 có thể render trang mới trước khi chạy hàm unmount của trang cũ,
      // dẫn đến việc kill nhầm cả các trigger của trang mới (ví dụ trang About).
      // useGSAP sẽ tự động dọn dẹp các trigger của chính nó.
    };
  }, []);

  return (
    <div className="home-page">
      <HeroCarousel />

      <ToursAll />

      <MapQuizPromo />

      <ExploreVietnam />

      <About />

      <Contact />
    </div>
  );
}

export default Home;
