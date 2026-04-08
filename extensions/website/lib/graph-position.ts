export function resolveGraphPosition(
  x: number,
  y: number,
  index: number,
  total: number,
) {
  if (Number.isFinite(x) && Number.isFinite(y)) {
    return { x, y };
  }

  const nodeCount = Math.max(total, 1);
  const angle = (index / nodeCount) * Math.PI * 2;
  const radius = Math.max(24, nodeCount * 6);

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}
