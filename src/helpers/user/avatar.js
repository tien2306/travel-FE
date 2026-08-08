export const getAvatarColor = (text) => {
  if (!text) return { bg: "#9E9E9E", color: "#fff" }; // Default Grey

  const charCode = text.toUpperCase().charCodeAt(0);

  // 26 Material Design colors for A-Z
  const colors = [
    { bg: "#F44336", color: "#fff" }, // A - Red
    { bg: "#E91E63", color: "#fff" }, // B - Pink
    { bg: "#9C27B0", color: "#fff" }, // C - Purple
    { bg: "#673AB7", color: "#fff" }, // D - Deep Purple
    { bg: "#3F51B5", color: "#fff" }, // E - Indigo
    { bg: "#2196F3", color: "#fff" }, // F - Blue
    { bg: "#03A9F4", color: "#fff" }, // G - Light Blue
    { bg: "#00BCD4", color: "#fff" }, // H - Cyan
    { bg: "#009688", color: "#fff" }, // I - Teal
    { bg: "#4CAF50", color: "#fff" }, // J - Green
    { bg: "#8BC34A", color: "#fff" }, // K - Light Green
    { bg: "#CDDC39", color: "#000" }, // L - Lime
    { bg: "#FFEB3B", color: "#000" }, // M - Yellow
    { bg: "#FFC107", color: "#000" }, // N - Amber
    { bg: "#FF9800", color: "#fff" }, // O - Orange
    { bg: "#FF5722", color: "#fff" }, // P - Deep Orange
    { bg: "#795548", color: "#fff" }, // Q - Brown
    { bg: "#607D8B", color: "#fff" }, // R - Blue Grey
    { bg: "#D32F2F", color: "#fff" }, // S - Dark Red
    { bg: "#C2185B", color: "#fff" }, // T - Dark Pink
    { bg: "#7B1FA2", color: "#fff" }, // U - Dark Purple
    { bg: "#512DA8", color: "#fff" }, // V - Dark Deep Purple
    { bg: "#303F9F", color: "#fff" }, // W - Dark Indigo
    { bg: "#1976D2", color: "#fff" }, // X - Dark Blue
    { bg: "#0288D1", color: "#fff" }, // Y - Dark Light Blue
    { bg: "#0097A7", color: "#fff" }, // Z - Dark Cyan
  ];

  // A -> Z : 65 -> 90
  if (charCode >= 65 && charCode <= 90) {
    return colors[charCode - 65];
  }
  // Nếu ký tự đầu là số, ký tự đặc biệt hoặc chữ tiếng Việt có dấu (như Đ, Ă, Â)
  else {
    return colors[charCode % 26];
  }
};
