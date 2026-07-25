import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { params as defaultParams } from "../constants/api";

export function useFilterParams() {
  // searchParams là kết quả trả về từ Hook useSearchParams() của thư viện react-router-dom.
  // Nó không phải là một chuỗi chữ (String), cũng không phải là một Object JavaScript bình thường.
  // Nó trả về một đối tượng đặc biệt (được gọi là URLSearchParams instance).
  // Nhiệm vụ của nó: Đại diện cho tất cả các cặp tham số nằm sau dấu chấm hỏi ? trên thanh địa chỉ URL.
  // Ví dụ thực tế: Nếu URL trình duyệt đang là http://localhost:3000/tours?page=2&limit=10&search=ha-long,
  // thì searchParams chính là thực thể đang nắm giữ bộ ba dữ liệu: page=2, limit=10, và search=ha-long.
  // Đặc điểm: Vì nó là đối tượng đặc biệt, bạn không thể dùng các lệnh bình thường như searchParams.page để lấy dữ liệu được.
  // Thay vào đó, nó cung cấp cho bạn các hàm đi kèm để tương tác như:
  // get("page") Trả về "2"
  // .has("limit") rả về true (kiểm tra xem có tồn tại tham số đó không)
  // .forEach()  Hàm duyệt qua từng tham số (key, value).
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. Chuyển đổi URL params thành một object Javascript dễ đọc
  const params = useMemo(() => {
    const p = { ...defaultParams };

    // Dùng .forEach để duyệt qua từng tham số trên URL
    searchParams.forEach((value, key) => {
      // Nếu key thuộc danh sách cần ép kiểu số nguyên
      if (
        key === "page" ||
        key === "limit" ||
        key === "minPrice" ||
        key === "maxPrice"
      ) {
        p[key] = parseInt(value); // Ép kiểu chữ thành số (Vd: "2" -> 2)
      } else {
        p[key] = value; // Giữ nguyên kiểu chữ (Vd: "vinh-ha-long")
      }
    });
    return p;
  }, [searchParams]); // Chỉ chạy lại đống logic này khi người dùng chuyển trang hoặc đổi bộ lọc (URL thay đổi)

  const updateParams = (newValues) => {
    // new dùng để khởi tạo một đối tượng mới hoàn toàn.
    // URLSearchParams là một công cụ có sẵn (gọi là Class hoặc API) được trình duyệt Web cung cấp sẵn cho chúng ta.
    // Nhiệm vụ: giúp lập trình viên xử lý chuỗi chữ nằm sau dấu chấm hỏi ? trên thanh địa chỉ (Query String) một cách dễ dàng.
    // Nếu không có URLSearchParams, phải tự viết code rất phức tạp để cắt chữ, tách dấu &, dấu = để lấy dữ liệu.
    const newSearchParams = new URLSearchParams(searchParams);
    // Object.keys(newValues); Lấy tất cả key của object tham số truyền vào Lưu thành 1 mảng
    // duyệt qua từng phần tử của mảng
    Object.keys(newValues).forEach((key) => {
      const value = newValues[key];

      // Nếu giá trị bị rỗng, null, hoặc BẰNG VỚI GIÁ TRỊ MẶC ĐỊNH (ví dụ page=1)
      // Thì chúng ta xóa hẳn chữ đó khỏi URL cho thanh địa chỉ được sạch sẽ, gọn gàng.
      // Dữ liệu ngầm vẫn lấy từ defaultParams nên không sợ bị lỗi.
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        value === defaultParams[key]
      ) {
        newSearchParams.delete(key);
      } else {
        // Chỉ lưu những tham số thực sự có sự thay đổi (khác mặc định) lên URL
        newSearchParams.set(key, value);
      }
    });

    // Ép trình duyệt chuyển hướng sang URL mới mà KHÔNG LÀM TẢI LẠI TRANG
    navigate(`/tours?${newSearchParams.toString()}`);
  };

  return { params, updateParams };
}
