# EasyTour

Ứng dụng web đặt tour và khám phá du lịch Việt Nam, gồm phân hệ người dùng và trang quản trị.

> Dự án phục vụ mục đích học tập và nghiên cứu cá nhân, không nhằm mục đích thương mại.

## Tính năng

**Người dùng**
- Tìm kiếm, lọc tour theo địa điểm, giá, thời gian
- Đặt tour và quản lý đơn đặt chỗ
- Bản đồ tương tác các tỉnh thành (Explore Vietnam)
- Minigame đố vui địa lý (Map Quiz)
- Danh sách tour yêu thích
- Đa ngôn ngữ (Tiếng Việt / English)
- Trang cá nhân, bộ sưu tập avatar SVG

**Quản trị viên**
- Dashboard thống kê doanh thu, lượt đặt tour
- Quản lý tour, banner, người dùng
- Soạn nội dung bằng TinyMCE

## Công nghệ

| Lĩnh vực | Công nghệ |
| --- | --- |
| Core | React 18 |
| Routing | React Router DOM v7 |
| State | Redux Toolkit |
| UI | Ant Design 6, React Icons |
| Biểu đồ & bản đồ | @ant-design/charts, react-simple-maps |
| Styling | Sass (SCSS) |
| Animation | GSAP, Swiper |
| i18n | i18next, react-i18next |
| Khác | TinyMCE, SweetAlert2 |

## Cấu trúc thư mục

```text
src/
├── assets/        # Hình ảnh, icon, avatar SVG
├── components/    # Component dùng chung
├── constants/     # Hằng số toàn cục
├── helpers/       # Hàm phụ trợ
├── hooks/         # Custom hooks
├── layout/        # Layout client và admin
├── locales/       # File ngôn ngữ (vi, en)
├── page/          # Admin, Auth, Client
├── routes/        # Cấu hình routing
├── services/      # Gọi API
├── store/         # Redux store và slices
├── styles/        # SCSS dùng chung
├── utils/         # Tiện ích
├── App.js
└── index.js
```
