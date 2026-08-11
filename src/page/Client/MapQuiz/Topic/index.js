import React from "react";
import { Link } from "react-router-dom";
import "./Topic.scss";

const TOPICS = [
  {
    id: "play",
    title: "Tìm Tỉnh Thành",
    icon: "🗺️",
    desc: "Chơi trực tiếp trên Bản Đồ Việt Nam. Trực quan sinh động!",
    path: "/map/play",
    mod: "map",
  },
  {
    id: "toan-quoc",
    title: "Cực Khó: Toàn Việt Nam",
    icon: "🇻🇳",
    desc: "Thử thách kiến thức tất cả Xã/Phường trên 34 tỉnh thành.",
    path: "/map/quiz/toan-quoc",
    mod: "hard",
  },
  {
    id: "mien-bac",
    title: "Trùm: Miền Bắc",
    icon: "🏛️",
    desc: "Đoán Xã/Phường thuộc các tỉnh Miền Bắc.",
    path: "/map/quiz/mien-bac",
  },
  {
    id: "mien-trung",
    title: "Trùm: Miền Trung",
    icon: "🏮",
    desc: "Đoán Xã/Phường thuộc các tỉnh Miền Trung.",
    path: "/map/quiz/mien-trung",
  },
  {
    id: "mien-nam",
    title: "Trùm: Miền Nam",
    icon: "🛶",
    desc: "Đoán Xã/Phường thuộc các tỉnh Miền Nam.",
    path: "/map/quiz/mien-nam",
  },
];

export default function Topic() {
  return (
    <div className="topic">
      <div className="topic__container">
        <div className="topic__header">
          <h2>Đố Vui Địa Lý VN</h2>
          <p>Chọn chế độ chơi bên dưới để bắt đầu thử thách kiến thức!</p>
        </div>

        <div className="topic__grid">
          {TOPICS.map((t) => (
            <Link
              key={t.id}
              to={t.path}
              className={`topic-card${t.mod ? ` topic-card--${t.mod}` : ""}`}
            >
              <div className="topic-card__icon-box">{t.icon}</div>
              <h3 className="topic-card__title">{t.title}</h3>
              <p className="topic-card__desc">{t.desc}</p>
              <div className="topic-card__action">
                Bắt đầu <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
