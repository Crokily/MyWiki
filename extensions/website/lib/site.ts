export const DIRECTORY_LABELS = {
  pages: "Pages",
  sources: "Sources",
  maps: "Maps",
  queries: "Queries",
} as const;

export function formatDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}
