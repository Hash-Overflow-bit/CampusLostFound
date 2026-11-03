import { useCallback, useEffect, useState } from "react";
import { createReportDraft } from "../reportModel";
import { sanitizeReportText } from "../reportValidation";

export const useReportDraft = ({ initialData, email }) => {
  const [draft, setDraft] = useState(() => createReportDraft(initialData, email));

  useEffect(() => {
    if (email) {
      setDraft((current) => ({ ...current, email }));
    }
  }, [email]);

  const updateField = useCallback((name, value) => {
    setDraft((current) => ({
      ...current,
      [name]: typeof value === "string" ? sanitizeReportText(value) : value,
    }));
  }, []);

  const reset = useCallback(() => {
    setDraft(createReportDraft({}, email));
  }, [email]);

  return {
    draft,
    setDraft,
    updateField,
    setField: updateField,
    reset,
  };
};
