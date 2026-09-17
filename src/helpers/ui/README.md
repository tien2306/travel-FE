### 1. `banner.js`

Cung cấp các hàm liên quan đến việc render Giao diện Người Dùng, mà cụ thể ở đây là hàm `getRandomBannerImage()`. Hàm này có chức năng chọc vào bộ dữ liệu Carousel (chứa ảnh Banner) quay random ra một bức ảnh bất kì. Kèm theo cơ chế dự phòng an toàn (Fallback) nếu Database trống.

**Được sử dụng tại:**
- `LayoutDefault/index.js`: Thay đổi ngẫu nhiên background banner trên đầu của các trang con (Sub-page) mỗi khi user đổi đường dẫn.
- `About/index.js`: Hiển thị ảnh minh họa động trong phần trang Giới Thiệu.

-------------------------------- Hàm quay ngẫu nhiên ảnh Banner --------------------------------
```javascript
export const getRandomBannerImage = (bannerData, fallbackUrl = fallbackImage) => {
  // B1: Kiểm tra mảng đầu vào. Nếu nó rỗng, mảng hỏng, bị undefined 
  // -> Lập tức ném ra đường link của ảnh Fallback dự phòng (ảnh đã đc import cục bộ) 
  // Tránh tình trạng web bị vỡ màn hình trắng.
  if (!bannerData || !Array.isArray(bannerData) || bannerData.length === 0) {
    return fallbackUrl;
  }

  // B2: Dùng thuật toán ngẫu nhiên Math.random() kết hợp với mảng.length
  // Tạo ra một con số index chạy trong khoảng từ 0 đến phần tử cuối mảng.
  const randomIndex = Math.floor(Math.random() * bannerData.length);
  
  // Lấy ra phần tử tại index vừa hái được, bốc lấy trường ".image"
  const apiImageName = bannerData[randomIndex]?.image;

  if (apiImageName) {
    // B3: Đã lấy được tên ảnh (Vd: "banner-mua-xuan.jpg"), 
    // Tiến hành nối nó vào đít đường dẫn máy chủ gốc (IMAGE_URLS.HERO_CAROUSEL) 
    // Sinh ra đường dẫn hoàn thiện dọn cỗ cho thẻ img.
    return `${IMAGE_URLS.HERO_CAROUSEL}${apiImageName.trim()}`;
  }

  // Lỡ trúng ngay index chứa cục data rỗng (xui) thì trả về ảnh dự phòng!
  return fallbackUrl;
};
```
