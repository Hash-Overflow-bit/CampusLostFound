import { useEffect, useState } from "react";
import { compressReportImage } from "../../services/imageService";

export default function PhotoStep({ draft, updateField }) {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const selectImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError("");
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

  return (
    <div className="report-step">
      <h3>Add a clear item photo</h3>
      <p className="report-step__hint">
        Best result: a well-lit 4:3 photo around 1600×1200. JPEG, PNG, or WebP up to 12MB.
        We automatically resize large photos to a maximum 1600px side and optimize them for fast loading.
      </p>

      <label className="report-upload">
        <span>{optimizing ? "Optimizing image…" : preview ? "Choose a different image" : "Choose image"}</span>
        <small>Keep the item centered and avoid exposing private ownership evidence.</small>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={selectImage}
          disabled={optimizing}
        />
      </label>

      {error && <p className="report-step__error">{error}</p>}

      {preview && (
        <div className="report-photo-frame">
          <img className="report-photo-preview" src={preview} alt="Selected item preview" />
          <span>Optimized for item cards</span>
        </div>
      )}

      {draft.image && !preview && <p>Existing image attached.</p>}
    </div>
  );
}
