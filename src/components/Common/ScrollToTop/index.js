import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component xử lý tự động cuộn lên đầu trang mỗi khi chuyển Route.
 *
 * Chỉ theo dõi `location.pathname`, bỏ qua `location.search`.
 * - Khi chuyển trang hoàn toàn (vd: "/" -> "/contact"), pathname đổi -> Cuộn lên 0,0.
 * - Khi bấm phân trang (vd: "/tours?page=1" -> "/tours?page=2"), pathname giữ nguyên -> Bỏ qua.
 * Điều này cho phép trang Tour giữ được tính năng cuộn riêng biệt của nó (cuộn lưng chừng).
 */
export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // 1. Kiểm tra xem có phải đang chuyển qua lại giữa trang chủ "/" và trang "/tours" hay không
    const isNavigatingBetweenHomeAndTours =
      location.pathname === "/" || location.pathname === "/tours";

    // 2. Nếu chuyển giữa 2 trang này thì DỪNG LẠI, không cuộn lên đỉnh đầu nữa
    if (isNavigatingBetweenHomeAndTours) {
      return;
    }

    // 3. Các trang khác (About, Contact, Blog...) thì vẫn cuộn lên đầu như cũ
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}
