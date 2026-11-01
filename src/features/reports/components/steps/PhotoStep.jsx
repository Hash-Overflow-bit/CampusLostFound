import { useEffect, useState } from "react";
import { compressReportImage } from "../../services/imageService";

export default function PhotoStep({ draft, updateField }) {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const selectImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      const prepared = await compressReportImage(file);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(prepared));
      updateField("image", prepared);
    } catch (imageError) { setError(imageError.message); }
  };

  return <div className="report-step"><h3>Add a photo</h3><p className="report-step__hint">A clear photo improves matching. For found items, avoid showing private ownership evidence.</p><label className="report-upload">Choose image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage} /></label>{error && <p className="report-step__error">{error}</p>}{preview && <img className="report-photo-preview" src={preview} alt="Selected item preview" />}{draft.image && !preview && <p>Existing image attached.</p>}</div>;
}
