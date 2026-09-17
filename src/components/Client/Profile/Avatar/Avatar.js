// SỰ KHÁC BIỆT SO VỚI BÊN TOUR/CAROUSEL (TẠI SAO KHÔNG DÙNG getValueFromEvent?)
// - Bên Tour ngta xài thẳng thẻ <Upload> của Antd. Khi chọn ảnh, thẻ này trả về 1 mớ rác (Event Object).
//   Do đó ngta BẮT BUỘC phải dùng getValueFromEvent để làm màng lọc, moi cái fileList ra cất đi.
// - Còn ở đây, ta tự chế ra AvatarSelector. Ta đã "tự xử" mọi thứ trong hàm beforeUpload / handlePresetClick,
//   và ta CHỦ ĐỘNG gọi onChange ném ra 1 cục Object sạch tinh tươm. Do đó thằng Cha Form.Item
//   không cần dùng màng lọc getValueFromEvent nữa! Mọi thứ cực kỳ Explicit (Rõ ràng).

// để đọc được file này bạn phải hiểu cái setValue của file cha
// file con nhận vào 2 giá trị value và onchange

import React, { useState } from "react";
import { Upload, Image } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAvatarColor } from "../../../../helpers/user/avatar";
import { getAvatarDisplayUrl } from "../../../../helpers/user/avatarUrl";
import { getBase64 } from "../../../../helpers/review/image";
import "./Avatar.scss";

// 1. COMPONENT CHÍNH
function Avatar({ value, onChange, isEditing, userInfo, t }) {
  // Trạng thái dùng chung (Mở modal xem ảnh to)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  // Lấy đường link url xịn hiển thị ảnh (nếu có)
  const displayImageUrl = getAvatarDisplayUrl(value);

  return (
    <div
      className={`p-info__avatar ${isEditing ? "p-info__avatar--editing" : ""}`}
    >
      {/* Ẩn cái ảnh đi, chỉ dùng cái preview */}
      <div style={{ display: "none" }}>
        {previewSrc && (
          <Image
            src={previewSrc}
            preview={{ open: previewOpen, onOpenChange: setPreviewOpen }}
          />
        )}
      </div>

      {/* Khu vực 1: khung tròn chứa ảnh hiện tại / nút Upload */}
      <AvatarUploader
        displayImageUrl={displayImageUrl}
        isEditing={isEditing}
        userInfo={userInfo}
        onChange={onChange}
        setPreviewSrc={setPreviewSrc}
        setPreviewOpen={setPreviewOpen}
        t={t}
      />

      {/* Khu vực 2: Dải ảnh hoạt hình (Chỉ hiện khi bấm sửa) */}
      {isEditing && (
        <PresetList
          displayImageUrl={displayImageUrl}
          onChange={onChange}
          t={t}
        />
      )}
    </div>
  );
}

export default Avatar;

// 2. GIAO DIỆN (CÁC KHỐI UI CON)
// 2.1 Khu vực Upload (Vòng tròn Avatar), lúc chưa sửa và lúc mặc định
function AvatarUploader({
  displayImageUrl,
  isEditing,
  userInfo,
  onChange,
  setPreviewSrc,
  setPreviewOpen,
  t,
}) {
  // Tính toán màu nền tự động nếu ko có ảnh
  const avatarText = userInfo?.username
    ? userInfo?.username?.charAt(0).toUpperCase()
    : userInfo?.fullName?.charAt(0).toUpperCase();

  const avatarColor = getAvatarColor(avatarText);

  // Xử lý khi user chọn ảnh từ máy tính
  const beforeUpload = async (file) => {
    const base64 = await getBase64(file);
    if (onChange) onChange({ file, preview: base64 });
    return false; // Chặn Antd tự động gửi request upload
  };

  const handlePreview = (e, src) => {
    e.stopPropagation();
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onChange) onChange(""); // Xóa rỗng giá trị
  };

  return (
    <div className="av-picker__form-item">
      <Upload
        maxCount={1}
        listType="picture-circle"
        className="av-picker__uploader"
        showUploadList={false} // Ẩn danh sách rườm rà phía dưới
        beforeUpload={beforeUpload}
        disabled={!isEditing}
      >
        {displayImageUrl ? (
          <div className="av-picker__img-wrap">
            <img
              src={displayImageUrl}
              alt="avatar"
              className="av-picker__img"
            />

            {isEditing && (
              <div className="av-picker__overlay av-picker__overlay--actions">
                <EyeOutlined
                  className="av-picker__btn"
                  onClick={(e) => handlePreview(e, displayImageUrl)}
                />
                <DeleteOutlined
                  className="av-picker__btn av-picker__btn--danger"
                  onClick={handleDelete}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="av-picker__img-wrap">
            <div
              className="av-picker__placeholder"
              style={{
                backgroundColor: avatarColor.bg,
                color: avatarColor.color,
              }}
            >
              {avatarText}
            </div>

            {isEditing && (
              <div className="av-picker__overlay av-picker__overlay--upload">
                <PlusOutlined className="av-picker__btn" />
                <span className="av-picker__text">
                  {t ? t("avatar.upload") : "Tải ảnh"}
                </span>
              </div>
            )}
          </div>
        )}
      </Upload>
    </div>
  );
}

// 2.2 Khu vực danh sách ảnh hoạt hình (Presets)
function PresetList({ displayImageUrl, onChange, t }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Rút gọn danh sách: nếu đang đóng chỉ hiện 8 ảnh đầu tiên
  const visiblePresets = isExpanded ? PRESETS : PRESETS.slice(0, 8);
  const isPresetSelected = (avatarUrl) => displayImageUrl === avatarUrl; // trả về true/false

  const handlePresetClick = async (avatar) => {
    if (!onChange) return;
    try {
      // Chạy hàm convert URL ảo thành File vật lý thật để BE đọc được
      const file = await convertUrlToFile(avatar.url, avatar.name);
      onChange({ file, preview: avatar.url });
    } catch (err) {
      console.error("Lỗi khi tải ảnh mẫu:", err);
    }
  };

  return (
    <div className="av-picker__presets">
      <p className="av-picker__hint">
        {t ? t("avatar.presetsHint") : "Hoặc chọn ảnh mẫu có sẵn:"}
      </p>

      <div className="av-picker__preset-list">
        {visiblePresets.map((avatar, index) => (
          <div
            key={index}
            onClick={() => handlePresetClick(avatar)}
            className={`av-picker__preset-item ${isPresetSelected(avatar.url) ? "av-picker__preset-item--active" : ""}`}
          >
            <img
              src={avatar.url}
              alt={`preset-${index}`}
              className="av-picker__preset-img"
            />
          </div>
        ))}

        {PRESETS.length > 8 && (
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="av-picker__toggle"
          >
            {isExpanded
              ? t
                ? t("avatar.collapse")
                : "Thu gọn ▲"
              : t
                ? t("avatar.seeMore", { count: PRESETS.length - 8 })
                : `Xem thêm (${PRESETS.length - 8}+ ảnh) ▼`}
          </div>
        )}
      </div>
    </div>
  );
}

// Cấu hình đọc danh sách ảnh mẫu từ thư mục nội bộ (Webpack require.context)
const avatarContext = require.context(
  "../../../../assets/avatars", // nơi chứa ảnh
  false, // không tìm trong folder con
  /\.(png|jpe?g|svg)$/, // chỉ lấy ảnh
);

// giá trị avatarContext trả về là một function của webpack có thuộc tính keys nó sẽ trả về
// vd ["./avatar-cat.png", "./avatar-dog.jpg", "./avatar-bear.svg"];
// và vì nó là function của webpack nó còn nhận vào 1 key avatarContext("./avatar-cat.png");
// trả về một chuỗi URL: "/static/media/avatar-cat.2b8c9d4f.png

// Mảng danh sách file tĩnh
const PRESETS = avatarContext.keys().map((key) => ({
  url: avatarContext(key),
  name: key.replace("./", ""),
}));

// Hàm biến đổi link web thành đối tượng File vật lý (Mô phỏng y hệt việc Upload)
const convertUrlToFile = async (url, fileName) => {
  const response = await fetch(url); // lấy cái ảnh
  const blob = await response.blob(); // nghiền sang dạng nhị phân(để nhẹ thôi)
  return new File([blob], fileName, { type: blob.type }); // đóng nó lại cái File
};
