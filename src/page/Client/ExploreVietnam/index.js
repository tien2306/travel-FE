import React, { useState, useRef, useMemo } from "react";
import { Image } from "antd";
import "./ExploreVietnam.scss";
import { useExploreAnimation } from "./animations";
import { useResponsive } from "../../../hooks/useResponsive";

const sessionSeed = Math.floor(Math.random() * 100000);

const GalleryCard = ({ index, isTall }) => {
  const h = isTall ? 400 : 250;
  const seed = `explore-vn-${sessionSeed}-${index}`;
  const imgThumb = `https://picsum.photos/seed/${seed}/400/${h}`;
  const imgHighRes = `https://picsum.photos/seed/${seed}/1200/800`;

  return (
    <div className="gallery-card" style={{ height: h }}>
      <Image
        src={imgThumb}
        alt={`Khoảnh khắc du lịch Việt Nam số ${index}`}
        className="gallery-card__img"
        height="100%"
        width="100%"
        loading="lazy"
        fallback={`https://picsum.photos/seed/fallback-${index}/400/${h}`}
        preview={{
          src: imgHighRes,
          mask: "Phóng to ảnh",
        }}
        style={{ objectFit: "cover", height: "100%", width: "100%" }}
      />
    </div>
  );
};

function ExploreVietnam() {
  const [limit, setLimit] = useState(12);
  const containerRef = useRef(null);

  const windowWidth = useResponsive(150);
  let numCols = 4;
  if (windowWidth <= 480) numCols = 1;
  else if (windowWidth <= 768) numCols = 2;
  else if (windowWidth <= 1024) numCols = 3;

  useExploreAnimation(containerRef);

  // 1- Mảng các p/tử Hiển thị cao thấp
  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < limit; i++) {
      const checkTall = i % 4 === 0 || i % 7 === 0;
      items.push({
        id: i + 1,
        isTall: checkTall,
      });
    }
    return items;
  }, [limit]);

  const columns = useMemo(() => {
    const colImages = []; // ảnh của từng cột
    const colHeights = []; // chiều cao của cột

    // 2- Lặp qua số cột
    // Chuẩn bị 4 cái khay trống
    for (let i = 0; i < numCols; i++) {
      colImages.push([]); // KQ: [[], [], [], []]
      colHeights.push(0); // KQ: [0, 0, 0, 0]
    }

    // Lặp qua chiều dài mảng hiển thị
    for (let i = 0; i < visibleItems.length; i++) {
      const item = visibleItems[i];

      // Tìm xem trong các cột, cột nào đang có chiều cao thấp nhất
      const minHeight = Math.min(...colHeights);

      // Tìm vị trí (số thứ tự) của cái cột thấp nhất đó
      const shortestColIndex = colHeights.indexOf(minHeight);

      // Bỏ bức ảnh hiện tại vào cái cột thấp nhất vừa tìm được
      colImages[shortestColIndex].push(item);

      // Tính toán chiều cao của bức ảnh vừa bỏ vào
      let imageHeight = 250; // Mặc định ảnh thấp là 250px
      if (item.isTall === true) {
        imageHeight = 400; // Nếu là ảnh dáng cao thì bằng 400px
      }

      // Cập nhật lại chiều cao mới cho cột đó (cộng thêm chiều cao ảnh và 16px khoảng cách gap)
      colHeights[shortestColIndex] =
        colHeights[shortestColIndex] + imageHeight + 16;
    }

    return colImages; // Trả về mảng các cột đã được chia ảnh đều tăm tắp
  }, [visibleItems, numCols]); // Chỉ chạy lại khi thêm ảnh hoặc đổi kích thước màn hình

  return (
    <section className="explore" ref={containerRef}>
      <div className="explore__wrapper">
        <div className="explore__header">
          <div className="explore__title-box">
            <span>Góc Cảm Hứng</span>
            <h2>Bộ Sưu Tập Khoảnh Khắc</h2>
            <p>
              Lưu giữ những khoảnh khắc tuyệt đẹp. Hãy để những bức ảnh này khơi
              nguồn đam mê xê dịch và khám phá thế giới trong bạn.
            </p>
          </div>
        </div>

        <div className="explore__grid">
          {columns.map((items, index) => (
            <div key={index} className="explore__column">
              {items.map((item) => (
                <GalleryCard
                  key={item.id}
                  index={item.id}
                  isTall={item.isTall}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="explore__actions">
          <div className="explore__actions-inner">
            <button
              className="explore__btn-more"
              onClick={() => setLimit((l) => l + 12)}
              aria-label="Xem thêm ảnh du lịch"
            >
              Khám phá thêm ↓
            </button>

            {limit > 12 && (
              <button
                className="explore__btn-less"
                onClick={() => {
                  setLimit(12);
                  setTimeout(() => {
                    const actions = document.querySelector(".explore__actions");
                    if (actions) {
                      actions.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }, 150);
                }}
                aria-label="Thu gọn danh sách ảnh"
              >
                Thu gọn ↑
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExploreVietnam;
