import type { PageSize } from "@/lib/editor-context";

export interface PlacementResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PlacementOptions {
  pageSize: PageSize;
  aspectRatio: number;
  targetHeightRatio?: number;
  maxWidthRatio?: number;
}

export function computeDefaultPlacement({
  pageSize,
  aspectRatio,
  targetHeightRatio = 0.1,
  maxWidthRatio = 0.8,
}: PlacementOptions): PlacementResult {
  const safeRatio = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1;

  const targetHeight = Math.min(pageSize.height * targetHeightRatio, 160);
  const targetWidth = targetHeight * safeRatio;
  const maxWidth = pageSize.width * maxWidthRatio;

  const width = Math.min(targetWidth, maxWidth);
  const height = width / safeRatio;

  return {
    x: Math.max(8, (pageSize.width - width) / 2),
    y: Math.max(8, pageSize.height * 0.62),
    width,
    height,
  };
}
