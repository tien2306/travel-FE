import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import vietnamMap from "./vietnam_34.json";
import { useResponsive } from "../../../hooks/useResponsive";
import "./MapQuiz.scss";

// -- Màu theo vùng miền (mới) --
const REGION_COLOR = {
  "Trung du và Miền núi phía Bắc": "#f4a261",
  "Đồng bằng sông Hồng": "#90e0ef",
  "Bắc Trung Bộ": "#a8dadc",
  "Duyên hải Nam Trung Bộ và Tây Nguyên": "#b7e4c7",
  "Đông Nam Bộ": "#fca5a5",
  "Đồng bằng sông Cửu Long": "#fde68a",
};

const NEW_PROVINCE_TO_REGION = {
  "Thành phố Hà Nội": "Đồng bằng sông Hồng",
  "Tỉnh Cao Bằng": "Trung du và Miền núi phía Bắc",
  "Tỉnh Tuyên Quang": "Trung du và Miền núi phía Bắc",
  "Tỉnh Điện Biên": "Trung du và Miền núi phía Bắc",
  "Tỉnh Lai Châu": "Trung du và Miền núi phía Bắc",
  "Tỉnh Sơn La": "Trung du và Miền núi phía Bắc",
  "Tỉnh Lào Cai": "Trung du và Miền núi phía Bắc",
  "Tỉnh Thái Nguyên": "Trung du và Miền núi phía Bắc",
  "Tỉnh Lạng Sơn": "Trung du và Miền núi phía Bắc",
  "Tỉnh Quảng Ninh": "Đồng bằng sông Hồng",
  "Tỉnh Bắc Ninh": "Đồng bằng sông Hồng",
  "Tỉnh Phú Thọ": "Trung du và Miền núi phía Bắc",
  "Thành phố Hải Phòng": "Đồng bằng sông Hồng",
  "Tỉnh Hưng Yên": "Đồng bằng sông Hồng",
  "Tỉnh Ninh Bình": "Đồng bằng sông Hồng",
  "Tỉnh Thanh Hóa": "Bắc Trung Bộ",
  "Tỉnh Nghệ An": "Bắc Trung Bộ",
  "Tỉnh Hà Tĩnh": "Bắc Trung Bộ",
  "Tỉnh Quảng Trị": "Bắc Trung Bộ",
  "Thành phố Huế": "Bắc Trung Bộ",
  "Thành phố Đà Nẵng": "Duyên hải Nam Trung Bộ và Tây Nguyên",
  "Tỉnh Quảng Ngãi": "Duyên hải Nam Trung Bộ và Tây Nguyên",
  "Tỉnh Gia Lai": "Duyên hải Nam Trung Bộ và Tây Nguyên",
  "Tỉnh Khánh Hòa": "Duyên hải Nam Trung Bộ và Tây Nguyên",
  "Tỉnh Đắk Lắk": "Duyên hải Nam Trung Bộ và Tây Nguyên",
  "Tỉnh Lâm Đồng": "Duyên hải Nam Trung Bộ và Tây Nguyên",
  "Tỉnh Đồng Nai": "Đông Nam Bộ",
  "Thành phố Hồ Chí Minh": "Đông Nam Bộ",
  "Tỉnh Tây Ninh": "Đông Nam Bộ",
  "Tỉnh Đồng Tháp": "Đồng bằng sông Cửu Long",
  "Tỉnh Vĩnh Long": "Đồng bằng sông Cửu Long",
  "Tỉnh An Giang": "Đồng bằng sông Cửu Long",
  "Thành phố Cần Thơ": "Đồng bằng sông Cửu Long",
  "Tỉnh Cà Mau": "Đồng bằng sông Cửu Long",
};

function buildHint(newProvinceName) {
  const region = NEW_PROVINCE_TO_REGION[newProvinceName];
  if (!region) return null;
  return "Thuộc vùng " + region;
}

function MapGame() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(0); // số tỉnh đã tìm đúng
  const [question, setQuestion] = useState(null); // { key, name, hint }
  const [asked, setAsked] = useState([]); // hc-key đã hỏi
  const [correct, setCorrect] = useState([]); // hc-key đúng
  const [wrong, setWrong] = useState(null); // { key, name }
  const [hint, setHint] = useState("");
  const [finished, setFinished] = useState(false);

  const windowWidth = useResponsive(150);

  const total = 34;

  let mapScale = 1800;
  let mapCenter = [108, 16];
  if (windowWidth <= 768) {
    mapScale = 3200;
    mapCenter = [106, 16.5];
  } else if (windowWidth <= 1180) {
    // Tablet / iPad
    mapScale = 2800;
    mapCenter = [107.5, 16.5];
  } else if (windowWidth <= 1366) {
    // Small Laptops
    mapScale = 2200;
    mapCenter = [108, 16];
  }

  useEffect(() => {
    nextQ([], []);
  }, []);

  function nextQ(prevCorrect, prevAsked) {
    const allUniqueProvinces = Object.keys(NEW_PROVINCE_TO_REGION);
    const avail = allUniqueProvinces.filter((p) => !prevAsked.includes(p));

    if (!avail.length) {
      setFinished(true);
      return;
    }

    const name = avail[Math.floor(Math.random() * avail.length)];
    setQuestion({ key: name, name: name, hint: buildHint(name) });
    setAsked([...prevAsked, name]);
    setHint("");
    setWrong(null);
  }

  function handleClick(geo) {
    if (!question || finished) return;
    const name = geo.properties["hc-key"];
    if (!name) return;

    if (correct.includes(name)) return;

    if (name === question.name) {
      const next = [...correct, name];
      setCorrect(next);
      setScore((s) => s + 10);
      setDone((d) => d + 1);
      setTimeout(() => nextQ(next, asked), 700);
    } else {
      setWrong({ key: name, name: name });
      setScore((s) => Math.max(0, s - 2));
    }
  }

  function getFill(name) {
    if (correct.includes(name)) return "#10b981";
    if (wrong?.name === name) return "#ef4444";
    const regionName = NEW_PROVINCE_TO_REGION[name];
    return REGION_COLOR[regionName] ?? "#d1d5db";
  }

  if (finished)
    return (
      <div className="mq-finish">
        <div className="mq-finish__card">
          <span className="mq-finish__icon">🎉</span>
          <h2>Hoàn thành!</h2>
          <p>
            Bạn đã tìm đúng tất cả <strong>{total}</strong> tỉnh thành!
          </p>
          <p className="mq-finish__score">🏆 {score} điểm</p>
          <div className="mq-finish__actions">
            <button onClick={() => navigate("/map")}>← Về Sảnh</button>
            <button
              className="mq-finish__actions--primary"
              onClick={() => window.location.reload()}
            >
              Chơi lại
            </button>
          </div>
        </div>
      </div>
    );

  const panel = (
    <aside className="mq-panel">
      <button className="mq-panel__back" onClick={() => navigate("/map")}>
        ← Sảnh
      </button>

      <div className="mq-panel__score">
        <span className="mq-panel__score-val">🏆 {score}</span>
        <span className="mq-panel__score-lbl">điểm</span>
      </div>

      <div className="mq-panel__progress">
        <div className="mq-panel__bar">
          <div
            className="mq-panel__bar-fill"
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
        <span>
          {done} / {total} tỉnh
        </span>
      </div>

      <div className="mq-panel__bottom-card">
        {/* Hàng 1: Câu hỏi và Gợi ý nằm chung */}
        <div className="mq-panel__q-row">
          <div className="mq-panel__question">
            <div className="mq-panel__question-label">Hãy tìm:</div>
            <div className="mq-panel__question-name">{question?.name}</div>
          </div>

          {!hint && (
            <div className="mq-panel__hint">
              <button
                className="mq-panel__hint-btn"
                onClick={() => setHint(question?.hint ?? "")}
              >
                💡 Gợi ý
              </button>
            </div>
          )}
        </div>

        {hint && (
          <div className="mq-panel__hint-full">
            <p className="mq-panel__hint-text">💡 {hint}</p>
          </div>
        )}

        {wrong && (
          <div className="mq-panel__wrong">
            ❌ <strong>{wrong.name}</strong> — sai!{score > 0 ? " (-2đ)" : ""}
          </div>
        )}

        {/* Hàng 2: Legend cuộn ngang cho gọn */}
        <div className="mq-panel__legend">
          <h4
            className="mq-panel__legend-title"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Vùng kinh tế:
          </h4>
          <div className="mq-panel__legend-grid">
            {Object.entries(REGION_COLOR).map(([name, color]) => (
              <div className="mq-panel__legend-item" key={name}>
                <div
                  className="mq-panel__legend-dot"
                  style={{ backgroundColor: color }}
                />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );

  const map = (
    <div className="mq-map">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: mapScale, center: mapCenter }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup zoom={1} center={[108, 16]} minZoom={0.5} maxZoom={8}>
          <Geographies geography={vietnamMap}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties["hc-key"];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleClick(geo)}
                    style={{
                      default: {
                        fill: getFill(name),
                        stroke: "#fff",
                        strokeWidth: 0.6,
                        outline: "none",
                        transition: "fill 0.2s",
                      },
                      hover: {
                        fill: correct.includes(name) ? "#059669" : "#3b82f6",
                        stroke: "#fff",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { fill: "#1d4ed8", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );

  return (
    <div className="mq">
      <div className="mq-container">
        <div className="mq__body">
          <div className="mq__panel-wrap">{panel}</div>
          <div className="mq__map-wrap">{map}</div>
        </div>
      </div>
    </div>
  );
}

export default MapGame;
