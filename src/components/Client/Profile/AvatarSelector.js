// Ghi chú antd
// Tại sao component này lúc gọi ở file Cha (ProfileInfo) chỉ viết là   <AvatarSelector isEditing={isEditing} userInfo={userInfo} />
// mà ở đây lại tự nhiên nhận được 2 props { value, onChange } ???
//
// Đó là nhờ <Form.Item> của antd:
// Khi bọc component này bằng <Form.Item name="avatar"> ở file Cha, thằng Form.Item
// sẽ dùng kỹ thuật "React.cloneElement" để âm thầm nhét 2 ống tiêm vào component con:
// - value: Lấy dữ liệu từ cái két sắt tổng của Form gán vào đây.
// - onChange: Một cái bộ đàm. Cứ gọi onChange(dữ_liệu_mới) là két sắt tự động cập nhật.
//
// khi gọi onchange ở con thằng cha có hàm hứng sự kiện thay đổi
// thấy có thay đổi, nó lấy cái name gán cho cái value nghĩa là: avatar = value
// Chỉ là cập nhật tạm ở Form thôi
// khi submit nó sẽ kéo hết dữ liệu từ form về
//
// SỰ KHÁC BIỆT SO VỚI BÊN TOUR/CAROUSEL (TẠI SAO KHÔNG DÙNG getValueFromEvent?)
// - Bên Tour ngta xài thẳng thẻ <Upload> của Antd. Khi chọn ảnh, thẻ này trả về 1 mớ rác (Event Object).
//   Do đó ngta BẮT BUỘC phải dùng getValueFromEvent để làm màng lọc, moi cái fileList ra cất đi.
// - Còn ở đây, ta tự chế ra AvatarSelector. Ta đã "tự xử" mọi thứ trong hàm beforeUpload / handlePresetClick,
//   và ta CHỦ ĐỘNG gọi onChange ném ra 1 cục Object sạch tinh tươm. Do đó thằng Cha Form.Item
//   không cần dùng màng lọc getValueFromEvent nữa! Mọi thứ cực kỳ Explicit (Rõ ràng).

import React, { useState } from "react";
import { Upload, Image } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAvatarColor } from "../../../helpers/user/avatar";
import { getAvatarDisplayUrl } from "../../../helpers/user/avatarUrl";
import { getBase64 } from "../../../helpers/review/image";
import "./AvatarSelector.scss";

// 1. CHUẨN BỊ DỮ LIỆU TĨNH ảnh mặc định
// Dùng Webpack quét thư mục ảnh mẫu, tự động tạo danh sách URL (vd: /static/media/avatar-1.abc123xyz.svg)
const avatarContext = require.context(
  "../../../assets/avatars", // Đường dẫn tới thư mục chứa ảnh
  false, // Không tìm trong các thư mục con
  /\.(png|jpe?g|svg)$/, // Chỉ lấy các file ảnh
);

const PRESETS = avatarContext.keys().map((key) => ({
  url: avatarContext(key),
  name: key.replace("./", ""),
}));

// 2. COMPONENT CHÍNH
const AvatarSelector = ({ value, onChange, isEditing, userInfo, t }) => {
  // --- STATE ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  // --- DERIVED DATA (Dữ liệu tính toán) ---
  const avatarText = userInfo?.username
    ? userInfo?.username?.charAt(0).toUpperCase()
    : userInfo?.fullName?.charAt(0).toUpperCase();

  const avatarColor = getAvatarColor(avatarText);
  const displayImageUrl = getAvatarDisplayUrl(value);
  const visiblePresets = isExpanded ? PRESETS : PRESETS.slice(0, 8);
  const isPresetSelected = (avatarUrl) => displayImageUrl === avatarUrl;

  // --- EVENT HANDLERS ---
  const beforeUpload = async (file) => {
    const base64 = await getBase64(file);
    if (onChange) onChange({ file, preview: base64 });
    return false; // Chặn Antd tự động gửi request upload vì upload antd nó tự gửi lên server luôn khi chọn ảnh
  };

  const handlePreview = (e, src) => {
    e.stopPropagation();
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onChange) onChange("");
  };

  // Xử lí click ảnh mặc định
  const handlePresetClick = async (avatar) => {
    if (!onChange) return;
    try {
      // 1. Tìm thấy file ảnh, trả về 'Response' chứa luồng dữ liệu ngầm (body: ...)
      const response = await fetch(avatar.url);
      // 2. Gom luồng dữ liệu lại thành cục 'Blob' để biết rõ dung lượng (size) và định dạng (type)
      const blob = await response.blob();
      // 3. Đóng gói cục Blob thành File Object (dán thêm tên file) để nộp lên Server
      const file = new File([blob], avatar.name, { type: blob.type });
      onChange({ file, preview: avatar.url });
    } catch (err) {
      console.error("Lỗi khi tải ảnh mẫu:", err);
    }
  };

  // --- RENDER ---
  return (
    <div
      className={`p-info__avatar ${isEditing ? "p-info__avatar--editing" : ""}`}
    >
      {/* Lightbox ẩn để xem trước ảnh to */}
      <div style={{ display: "none" }}>
        {previewSrc && (
          <Image
            src={previewSrc}
            preview={{
              open: previewOpen,
              onOpenChange: setPreviewOpen,
            }}
          />
        )}
      </div>

      {/* Khu vực Upload / Hiển thị Avatar hiện tại */}
      <div className="av-picker__form-item">
        <Upload
          maxCount={1}
          listType="picture-circle"
          className="av-picker__uploader"
          showUploadList={false} // Ẩn danh sách các file đã upload phía dưới nút bấm.
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
                  <span className="av-picker__text">{t ? t("avatar.upload") : "Tải ảnh"}</span>
                </div>
              )}
            </div>
          )}
        </Upload>
      </div>

      {/* Khu vực Chọn Ảnh Mẫu (Presets) */}
      {isEditing && (
        <div className="av-picker__presets">
          <p className="av-picker__hint">{t ? t("avatar.presetsHint") : "Hoặc chọn ảnh mẫu có sẵn:"}</p>

          <div className="av-picker__preset-list">
            {visiblePresets.map((avatar, index) => (
              <div
                key={index}
                onClick={() => handlePresetClick(avatar)}
                className={`av-picker__preset-item ${
                  isPresetSelected(avatar.url)
                    ? "av-picker__preset-item--active"
                    : ""
                }`}
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
                  ? (t ? t("avatar.collapse") : "Thu gọn ▲")
                  : (t ? t("avatar.seeMore", { count: PRESETS.length - 8 }) : `Xem thêm (${PRESETS.length - 8}+ ảnh) ▼`)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;
