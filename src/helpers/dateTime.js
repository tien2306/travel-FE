export const getDuration = (start, end) => {
  if (!start || !end) return "3 ngày 2 đêm";
  const diff =
    Math.ceil(
      Math.abs(new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24),
    ) + 1;
  return `${diff} ngày ${diff - 1} đêm`;
};
