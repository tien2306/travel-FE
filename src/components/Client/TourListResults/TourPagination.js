import React from "react";
import { Pagination } from "antd";

export default function TourPagination(props) {
  const { current, total, pageSize, onChange } = props;

  return (
    <div className="tour-results__pagination-wrapper">
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
        responsive
      />
    </div>
  );
}
