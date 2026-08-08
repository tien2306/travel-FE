import React, { useState } from "react";
import { Upload, Image } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAvatarColor } from "../../../helpers/user/avatar";
import { getAvatarDisplayUrl } from "../../../helpers/user/avatarUrl";
import "./AvatarSelector.scss";
import { getBase64 } from "../../../helpers/review/image";

// Dùng Webpack require.context để tự động quét toàn bộ file trong thư mục.
// Phép thuật: Lúc 'npm start', Webpack sẽ tự copy các ảnh này, đổi tên thêm mã hash
// và lưu vào sổ xố (từ điển) ngầm định của nó.
const avatarContext = require.context(
  "../../../assets/avatars", // Đường dẫn tới thư mục chứa ảnh
  false, // Không tìm trong các thư mục con
  /\.(png|jpe?g|svg)$/, // Chỉ lấy các file ảnh
);

// avatarContext.keys() trả về mảng các đường dẫn (VD: ["./avatar-1.svg", "./avatar-2.png"])
const DEFAULT_AVATARS = avatarContext.keys().map((key) => ({
  // avatarContext(key) đóng vai trò như việc tra từ điển Webpack:
  // Đưa tên file gốc vào -> Nhận lại đường dẫn Link Web thực sự (VD: "/static/media/avatar-1.abc123xyz.svg")
  // Dùng link này để gắn vào <img src="..." />
  url: avatarContext(key),

  // Cắt bỏ chuỗi "./" ở đầu để lấy tên file sạch (VD: "avatar-1.svg")
  // Tên sạch này dùng để đóng gói thành File object thô gửi cho Backend khi user lưu form
  name: key.replace("./", ""),
}));

const AvatarSelector = ({ value, onChange, isEditing, userInfo }) => {
  const avatarText = userInfo?.fullName
    ? userInfo.fullName.charAt(0).toUpperCase()
    : userInfo?.username?.charAt(0).toUpperCase();

  const avatarColor = getAvatarColor(avatarText);
  const [isExpanded, setIsExpanded] = useState(false); // true: mở rộng, false: thu nhỏ
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  // Upload ảnh từ máy → tạo URL ảo (blob) để preview ngay lập tức
  const beforeUpload = async (file) => {
    const base64 = await getBase64(file);
    if (onChange) onChange({ file: file, preview: base64 });
    return false; // Ngăn antd tự động upload
  };

  const displayImageUrl = (() => {
    if (!value) return null; // TH mới tạo tk chưa có ảnh
    if (typeof value === "object" && value.preview) return value.preview; //TH mới bấm vào upload ảnh
    if (typeof value === "string") return getAvatarDisplayUrl(value); //TH ảnh cũ từ server
    return null;
  })();

  // Hiển thị ảnh
  const visiblePresets = isExpanded
    ? DEFAULT_AVATARS
    : DEFAULT_AVATARS.slice(0, 8);

  // XỬ LÝ KHI NGƯỜI DÙNG BẤM CHỌN 1 ẢNH MẪU (PRESET)
  const handlePresetClick = async (avatar) => {
    if (!onChange) return;
    try {
      // 1. Dùng fetch() gọi tới đường dẫn của tấm ảnh để tải dữ liệu ảnh về
      const response = await fetch(avatar.url);

      // 2. Chuyển đổi dữ liệu vừa tải về thành dạng Blob (Binary Large Object)
      // Nói dễ hiểu: Chuyển tấm ảnh thành một cục dữ liệu nhị phân thô (chứa toàn số 0 và 1)
      const blob = await response.blob();

      // 3. Đóng gói cục dữ liệu nhị phân đó thành một đối tượng File chuẩn của trình duyệt.
      // Việc này làm cho tấm ảnh mẫu đóng giả thành một file được upload từ máy tính của User!
      const file = new File([blob], avatar.name, { type: blob.type });

      // 4. Báo cho cái Form (Ant Design) biết là:
      // "Ê form, có File mới rồi nè, cập nhật dữ liệu đi.
      // Sẵn tiện lưu luôn cái link preview để tôi hiện lên UI cho nhanh nhé!"
      onChange({ file, preview: avatar.url });
    } catch (err) {
      console.error("Lỗi khi tải ảnh preset:", err);
    }
  };

  // KIỂM TRA XEM ẢNH MẪU NÀY CÓ ĐANG ĐƯỢC CHỌN HAY KHÔNG
  // (Để hiển thị cái viền xanh xanh bao quanh ảnh)
  const isPresetSelected = (avatarUrl) => {
    if (!value) return false;

    // Thuộc tính 'value' (giá trị hiện tại của form) có thể rơi vào 2 trường hợp:

    // TH1: User vừa chọn ảnh mẫu hoặc vừa upload ảnh. 'value' lúc này là một Object do hàm onChange ở trên tạo ra.
    // Ta lấy thuộc tính 'preview' của Object đó so sánh với đường dẫn của ảnh mẫu hiện tại.
    if (typeof value === "object" && value.preview) {
      return value.preview === avatarUrl;
    }

    // TH2: User chưa thao tác gì. 'value' là một chuỗi (String) URL do DB trả về lúc vừa load trang.
    // Ta so sánh trực tiếp cái chuỗi đó với đường dẫn ảnh mẫu.
    return value === avatarUrl;
  };

  return (
    <div
      className={`p-info__avatar ${isEditing ? "p-info__avatar--editing" : ""}`}
    >
      <div style={{ display: "none" }}>
        {previewSrc && (
          <Image
            src={previewSrc}
            preview={{
              open: previewOpen,
              onOpenChange: (open) => setPreviewOpen(open),
            }}
          />
        )}
      </div>

      <div className="avatar-selector__form-item">
        <Upload
          maxCount={1}
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          disabled={!isEditing}
        >
          {displayImageUrl ? (
            <div className="avatar-selector__image-wrapper">
              <img
                src={displayImageUrl}
                alt="avatar"
                className="avatar-selector__image"
              />
              {isEditing && (
                <div className="avatar-selector__overlay avatar-selector__overlay--actions">
                  <EyeOutlined
                    className="avatar-selector__action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewSrc(displayImageUrl);
                      setPreviewOpen(true);
                    }}
                  />
                  <DeleteOutlined
                    className="avatar-selector__action-btn avatar-selector__action-btn--delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onChange) onChange("");
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="avatar-selector__image-wrapper">
              <div
                className="avatar-selector__placeholder"
                style={{
                  backgroundColor: avatarColor.bg,
                  color: avatarColor.color,
                }}
              >
                {avatarText}
              </div>
              {isEditing && (
                <div className="avatar-selector__overlay avatar-selector__overlay--upload">
                  <PlusOutlined className="avatar-selector__action-btn" />
                  <span className="avatar-selector__action-text">Tải ảnh</span>
                </div>
              )}
            </div>
          )}
        </Upload>
      </div>

      {isEditing && (
        <div className="avatar-selector__presets-wrapper">
          <p className="avatar-selector__hint-text">
            Hoặc chọn ảnh mẫu có sẵn:
          </p>
          <div className="avatar-selector__presets-list">
            {visiblePresets.map((avatar, index) => (
              <div
                key={index}
                onClick={() => handlePresetClick(avatar)}
                className={`avatar-selector__preset-item ${
                  isPresetSelected(avatar.url)
                    ? "avatar-selector__preset-item--selected"
                    : ""
                }`}
              >
                <img
                  src={avatar.url}
                  alt={`avatar-${index}`}
                  className="avatar-selector__preset-image"
                />
              </div>
            ))}
            {DEFAULT_AVATARS.length > 8 && (
              <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="avatar-selector__toggle-btn"
              >
                {isExpanded
                  ? "Thu gọn ▲"
                  : `Xem thêm (${DEFAULT_AVATARS.length - 8}+ ảnh) ▼`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;
