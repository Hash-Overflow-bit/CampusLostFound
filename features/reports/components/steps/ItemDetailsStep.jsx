const categories = ["ID Card", "Wallet", "Notebook", "Electronics", "Keys", "Bag/Backpack", "Clothing", "Books", "Jewelry", "Other"];

export default function ItemDetailsStep({ draft, updateField }) {
  return (
    <div className="report-step">
      <p className="report-step__hint">
        Keep it recognizable but short. Do not publish secret proof that only the real owner should know.
      </p>

      <div className="report-field-grid">
        <label className="report-field report-field--wide">
          <span>What is the item?</span>
          <input
            value={draft.title || ""}
            maxLength={100}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="e.g. Black AirPods case"
            autoFocus
          />
          <small>{(draft.title || "").length}/100 · Use a simple name students can scan quickly.</small>
        </label>

        <label className="report-field">
          <span>Category</span>
          <select
            value={draft.category || ""}
            onChange={(event) => updateField("category", event.target.value)}
          >
            <option value="">Choose category</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>

        <label className="report-field">
          <span>Color <em>optional</em></span>
          <input
            value={draft.color || ""}
            maxLength={60}
            onChange={(event) => updateField("color", event.target.value)}
            placeholder="e.g. Black"
          />
        </label>

        <label className="report-field report-field--wide">
          <span>Useful visible details</span>
          <textarea
            value={draft.description || ""}
            maxLength={1000}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="e.g. Small scratch on the case, blue keychain attached…"
          />
          <small>Share visible clues. Keep private identifiers for the claim process.</small>
        </label>
      </div>
    </div>
  );
}
