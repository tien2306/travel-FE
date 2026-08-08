// Hàm format giá tiền sang dạng "1.000.000 ₫"
export const formatPrice = (price) => {
  if (!price) return "---";
  return Number(price).toLocaleString("vi-VN") + " ₫";
};

// Hàm format ngày sang "dd/mm/yyyy"
export const formatDate = (dateStr) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Hàm tính thời gian tour (số ngày/đêm)
export const getDuration = (start, end) => {
  if (!start || !end) return "Đang cập nhật";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Trong ngày";
  return `${diffDays + 1} ngày ${diffDays} đêm`;
};
