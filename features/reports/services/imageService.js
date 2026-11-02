import { validateReportImage } from "../reportValidation";

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.82;

export const compressReportImage = async (file) => {
  validateReportImage(file);
  if (!file || file.type === "image/webp") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1024 * 1024) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Image compression failed.")), "image/jpeg", JPEG_QUALITY);
  });

  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};

export const createImagePreview = (file) => URL.createObjectURL(file);
export const revokeImagePreview = (url) => { if (url?.startsWith("blob:")) URL.revokeObjectURL(url); };
