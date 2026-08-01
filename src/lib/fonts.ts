const familyCache: Record<string, string> = {};

export function getResolvedFontFamily(className: string): string {
  if (familyCache[className]) return familyCache[className];
  const probe = document.createElement("span");
  probe.className = className;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  probe.remove();
  familyCache[className] = family;
  return family;
}

export async function ensureFontLoaded(family: string): Promise<void> {
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await document.fonts.load(`40px ${family}`);
      await document.fonts.ready;
    } catch {
      // Font belum siap — biarkan browser memakai fallback.
    }
  }
}

export async function textToPngDataUrl(
  text: string,
  family: string,
  color = "#18181b"
): Promise<string> {
  await ensureFontLoaded(family);
  const fontPx = 48;
  const measure = document.createElement("canvas");
  const mctx = measure.getContext("2d");
  if (!mctx) throw new Error("Canvas tidak didukung");
  mctx.font = `${fontPx}px ${family}`;
  const textWidth = mctx.measureText(text).width;

  const canvas = document.createElement("canvas");
  const width = Math.ceil(textWidth) + 16;
  const height = Math.ceil(fontPx * 1.4);
  canvas.width = width * 2;
  canvas.height = height * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak didukung");
  ctx.scale(2, 2);
  ctx.font = `${fontPx}px ${family}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, 8, height / 2);
  return canvas.toDataURL("image/png");
}
