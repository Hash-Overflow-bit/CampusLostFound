import { useCallback, useEffect, useState } from "react";
import { createReportDraft } from "../reportModel";
import { sanitizeReportText } from "../reportValidation";

export const useReportDraft = ({ initialData, email }) => {
  const [draft, setDraft] = useState(() => createReportDraft(initialData, email));

  useEffect(() => {
    if (email) setDraft((current) => ({ ...current, email }));
  }, [email]);

  const setField = useCallback((name, value) => {
    setDraft((current) => ({ ...current, [name]: sanitizeReportText(value) }));
  }, []);

  const setImage = useCallback((image) => {
    setDraft((current) => ({ ...current, image }));
  }, []);

  const reset = useCallback(() => setDraft(createReportDraft({}, email)), [email]);

  return { draft, setDraft, setField, setImage, reset };
};
