import { useEffect, useState } from "react";
import { compressReportImage } from "../../services/imageService";
import StatePanel from "../../../../components/state/StatePanel";

export default function PhotoStep({ draft, updateField }) {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const selectImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError("");
      setPreviewFailed(false);
      setOptimizing(true);
      const prepared = await compressReportImage(file);

      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(prepared));
      updateField("image", prepared);
    } catch (imageError) {
      setError(imageError.message);
    } finally {
      setOptimizing(false);
    }
  };

  const displayImage = previewFailed ? "" : preview || draft.existingImageUrl || "";

  return (
    <div className="report-step">
      <p className="report-step__hint">
        A photo is optional, but it is the fastest way for another student to recognize the right item.
      </p>

      <label className="report-upload">
        <span>{optimizing ? "Optimizing image…" : displayImage ? "Replace photo" : "Add a photo"}</span>
        <small>Best result: 4:3, well lit, item centered. Large images are optimized automatically.</small>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={selectImage}
          disabled={optimizing}
        />
      </label>

      {optimizing && (
        <StatePanel
          compact
          tone="info"
          title="Optimizing photo"
          description="Compressing the image for a faster campus feed without changing your original file."
        />
      )}

      {error && <p className="report-step__error">{error}</p>}

      {previewFailed && (
        <StatePanel
          compact
          tone="warning"
          title="Photo preview unavailable"
          description="The report can still be saved. Choose Replace photo if you want to upload another image."
        />
      )}

      {displayImage ? (
        <div className="report-photo-frame">
          <img
            className="report-photo-preview"
            src={displayImage}
            alt="Item preview"
            onError={() => setPreviewFailed(true)}
          />
          <span>{preview ? "New optimized photo" : "Current photo"}</span>
        </div>
      ) : (
        <div className="report-photo-empty" aria-hidden="true">
          <span>▧</span>
          <p>No photo yet</p>
        </div>
      )}
    </div>
  );
}
