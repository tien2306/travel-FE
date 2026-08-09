import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// EN
import commonEN from "../locales/en/common.json";
import headerEN from "../locales/en/header.json";
import footerEN from "../locales/en/footer.json";
import aboutEN from "../locales/en/about.json";
import contactEN from "../locales/en/contact.json";
import toursEN from "../locales/en/tours.json";
import homeEN from "../locales/en/home.json";
import authEN from "../locales/en/auth.json";
import profileEN from "../locales/en/profile.json";

// VI
import commonVI from "../locales/vi/common.json";
import headerVI from "../locales/vi/header.json";
import footerVI from "../locales/vi/footer.json";
import aboutVI from "../locales/vi/about.json";
import contactVI from "../locales/vi/contact.json";
import toursVI from "../locales/vi/tours.json";
import homeVI from "../locales/vi/home.json";
import authVI from "../locales/vi/auth.json";
import profileVI from "../locales/vi/profile.json";

const resources = {
  en: {
    common: commonEN,
    header: headerEN,
    footer: footerEN,
    about: aboutEN,
    contact: contactEN,
    tours: toursEN,
    home: homeEN,
    auth: authEN,
    profile: profileEN,
  },
  vi: {
    common: commonVI,
    header: headerVI,
    footer: footerVI,
    about: aboutVI,
    contact: contactVI,
    tours: toursVI,
    home: homeVI,
    auth: authVI,
    profile: profileVI,
  },
};

const savedLanguage = localStorage.getItem("app_language");

i18n
  .use(initReactI18next) // Gắn kết i18next vào môi trường React
  .init({
    resources, // Nạp bản đồ ngôn ngữ vừa định nghĩa ở trên vào bộ nhớ
    lng: savedLanguage, // Chỉ định ngôn ngữ hiển thị ngay khi web vừa load xong
    fallbackLng: "en", // Ngôn ngữ dự phòng. Nếu file tiếng Việt bị thiếu từ khóa, nó tự động lấy tiếng Anh đắp vào để không bị lỗi giao diện
    ns: [
      "common",
      "header",
      "footer",
      "about",
      "contact",
      "tours",
      "home",
      "auth",
      "profile",
    ], // Khai báo danh sách các file (Namespaces) đang quản lý
    defaultNS: "common", // File mặc định. Nếu trong component bạn gọi hàm t() mà không khai báo dùng file nào, nó tự động tìm trong file common.json
    interpolation: {
      escapeValue: false, // React đã có cơ chế tự động chống tấn công mã độc (XSS), nên đặt false để tăng tốc độ xử lý chữ
    },
  });

export default i18n;
