import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import type { DocumentElement } from "@/types/element";
import type { PageSize } from "@/lib/editor-context";
import { dataUrlToBlob, dataUrlMime } from "@/lib/imageUtils";

interface ExportParams {
  buffer: ArrayBuffer;
  elements: DocumentElement[];
  pageSizes: Record<number, PageSize>;
}

export async function exportPdf({
  buffer,
  elements,
  pageSizes,
}: ExportParams): Promise<Blob> {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();

  for (const el of elements) {
    const page = pages[el.page];
    const size = pageSizes[el.page];
    if (!page || !size) continue;

    const scaleX = page.getWidth() / size.width;
    const scaleY = page.getHeight() / size.height;

    const widthPts = el.width * scaleX;
    const heightPts = el.height * scaleY;
    const xPts = el.x * scaleX;
    const yPts = page.getHeight() - el.y * scaleY - heightPts;

    let dataUrl: string;
    if (el.type === "qrcode") {
      dataUrl = await QRCode.toDataURL(el.data, {
        width: 800,
        margin: 1,
        errorCorrectionLevel: "M",
      });
    } else {
      dataUrl = el.data;
    }

    const mime = dataUrlMime(dataUrl);
    const imageBytes = await dataUrlToBlob(dataUrl).arrayBuffer();
    const image =
      mime === "image/jpeg" || mime === "image/jpg"
        ? await pdfDoc.embedJpg(imageBytes)
        : await pdfDoc.embedPng(imageBytes);

    page.drawImage(image, {
      x: xPts,
      y: yPts,
      width: widthPts,
      height: heightPts,
    });
  }

  const bytes = await pdfDoc.save();
  const byteArray = new Uint8Array(bytes);
  return new Blob([byteArray], { type: "application/pdf" });
}
