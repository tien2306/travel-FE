import React from "react";
import { Collapse } from "antd";
import { useTranslation } from "react-i18next";
import "./Notes.scss";

const TourNotes = ({ tour }) => {
  const { t } = useTranslation("tours");
  // { returnObjects: true } Hàm trả về nguyên cái Object hoặc mảng -> key dịch trong file Json
  const notesData = t("detail.notesData", { returnObjects: true });

  const items = Array.isArray(notesData)
    ? notesData.map((note, index) => ({
        key: String(index + 1),
        label: <span className="note-panel-title">{note.label}</span>,
        children: (
          <div className="note-panel-content">
            {/* note.content.split('\n'): để  đánh dấu chỗ muốn xuống dòng*/}
            {/* .map((line, idx) => <p>{line}</p>): Hàm sẽ bọc mỗi câu ngắn đó vào trong một thẻ <p> */}
            {note.content.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        ),
      }))
    : [];

  return (
    <div className="tour-notes-inner">
      {/* ghost: thuộc tính xóa css của antd */}
      {/* expandIconPlacement="end": Vị trí mũi tên */}
      <Collapse ghost expandIconPlacement="end" items={items} />
    </div>
  );
};

export default TourNotes;
