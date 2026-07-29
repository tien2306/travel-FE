import React, { useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

/**
 * placeholder: Chữ hiển thị mờ khi khung soạn thảo trống
 * className: Tên lớp CSS truyền từ ngoài vào để bạn dễ dàng căn chỉnh kích thước,..
 * value: Nội dung văn bản (dạng HTML) ban đầu do form hoặc database truyền vào để hiển thị lên màn hình
 * onChange: Một hàm do form cha cung cấp. Mỗi khi người dùng gõ chữ, editor sẽ gọi hàm này để gửi văn bản mới ngược trở lại cho form lưu trữ.
 *
 * Khi một nút được click hoặc một ô input được focus, sự kiện không chỉ xảy ra tại đó mà sẽ đi qua 2 giai đoạn:
 * Capturing (Đi xuống): Sự kiện đi từ document (gốc) chạy xuống dần qua các thẻ cha, rồi mới đến thẻ đích (thẻ con trong cùng).
 * Bubbling (Đi lên): Sự kiện từ thẻ đích chạy ngược lên lại qua các thẻ cha để về document.
 *
 */
export default function TinyEditor({
  placeholder,
  className,
  value,
  onChange,
}) {
  useEffect(() => {
    // Bắt sự kiện focus trên toàn bộ document
    const handleFocusIn = (e) => {
      // Nếu điểm focus nằm trong hộp thoại/pop-up của TinyMCE
      if (e.target.closest(".tox-tinymce-aux, .tox-dialog")) {
        // Dừng ngay lập tức các sự kiện focus khác (ngăn Antd Modal cướp focus)
        e.stopImmediatePropagation();
      }
    };

    // Đăng ký sự kiện ở chế độ capturing "tham số thứ 3 á" để xử lý sớm nhất
    // Để tránh chặn focus của antd
    document.addEventListener("focusin", handleFocusIn, true);

    // Hủy đăng ký khi component bị xóa (unmount) để tránh rò rỉ bộ nhớ
    return () => {
      document.removeEventListener("focusin", handleFocusIn, true);
    };
  }, []); // Chỉ chạy một lần duy nhất khi component render lần đầu

  return (
    <div className={className}>
      <Editor
        // Tải thư viện TinyMCE từ CDN để ứng dụng không bị nặng
        tinymceScriptSrc={"https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"}
        // Biến Editor thành controlled component để Form.Item của Antd có thể kiểm soát và không làm nhảy con trỏ
        value={value || ""}
        // Bắt sự kiện khi người dùng gõ/sửa nội dung để cập nhật dữ liệu ra ngoài
        onEditorChange={(newValue) => {
          if (onChange) onChange(newValue);
        }}
        init={{
          height: 550, // Chiều cao vùng nhập liệu là 550px
          menubar: false, // Ẩn thanh menu trên cùng (File, Edit, View...) cho gọn
          placeholder: placeholder, // Chữ hiển thị mờ khi chưa nhập gì
          branding: false, // Ẩn logo "Powered by TinyMCE" ở góc dưới
          toolbar_mode: "wrap", // Tự động xuống dòng các nút công cụ nếu màn hình hẹp

          // Khai báo các tính năng mở rộng sẽ sử dụng trong editor
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "wordcount",
          ],

          // Bố trí các nút bấm hiển thị trên thanh công cụ (Toolbar)
          toolbar: [
            "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor",
            "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | removeformat | preview code",
          ],

          // Nhúng CSS để tùy biến phông chữ, cỡ chữ của văn bản bên trong editor
          content_style: `
        body { 
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          font-size: 16px; 
          line-height: 1.8;
        }
      `,

          // Định nghĩa các kiểu thẻ tiêu đề (H1 -> H6) xuất hiện trong menu sổ xuống
          block_formats:
            "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6",
        }}
      />
    </div>
  );
}
