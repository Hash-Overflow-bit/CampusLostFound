const categories = ["ID Card", "Wallet", "Notebook", "Electronics", "Keys", "Bag/Backpack", "Clothing", "Books", "Jewelry", "Other"];

export default function ItemDetailsStep({ draft, updateField }) {
  return <div className="report-step"><h3>Item details</h3><label>Item name<input value={draft.title || ""} maxLength={100} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Black AirPods case" /></label><label>Category<select value={draft.category || ""} onChange={(e) => updateField("category", e.target.value)}><option value="">Select category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Description<textarea value={draft.description || ""} maxLength={1000} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe useful visible details" /></label></div>;
}
