export const DIRECTORY_LABELS = {
  pages: "文档",
  sources: "来源",
  maps: "地图",
  queries: "问题",
} as const;

export function formatDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}
