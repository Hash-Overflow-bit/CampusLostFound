import { validateReportImage } from "../reportValidation";

const MAX_DIMENSION = 1600;
const TARGET_BYTES = 1.5 * 1024 * 1024;
const DIMENSION_STEPS = [1600, 1440, 1280];
const QUALITY_STEPS = [0.82, 0.76, 0.7];

const canvasToBlob = (canvas, quality) => new Promise((resolve, reject) => {
  canvas.toBlob(
    (value) => value ? resolve(value) : reject(new Error("Image optimization failed.")),
    "image/webp",
    quality
  );
});

export const compressReportImage = async (file) => {
  validateReportImage(file);
  if (!file) return file;

  const bitmap = await createImageBitmap(file);

  try {
    const longestSide = Math.max(bitmap.width, bitmap.height);
    if (longestSide <= MAX_DIMENSION && file.size <= TARGET_BYTES) return file;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    let bestBlob = null;

    for (const dimension of DIMENSION_STEPS) {
      const scale = Math.min(1, dimension / longestSide);
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of QUALITY_STEPS) {
        const blob = await canvasToBlob(canvas, quality);
        bestBlob = blob;
        if (blob.size <= TARGET_BYTES) {
          return new File(
            [blob],
            `${file.name.replace(/\.[^.]+$/, "")}.webp`,
            { type: "image/webp", lastModified: Date.now() }
          );
        }
      }
    }

    if (!bestBlob) throw new Error("Image optimization failed.");

    return new File(
      [bestBlob],
      `${file.name.replace(/\.[^.]+$/, "")}.webp`,
      { type: "image/webp", lastModified: Date.now() }
    );
  } finally {
    bitmap.close();
  }
};

export const createImagePreview = (file) => URL.createObjectURL(file);
export const revokeImagePreview = (url) => {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
};
