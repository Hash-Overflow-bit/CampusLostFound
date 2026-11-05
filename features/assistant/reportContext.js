const STOPWORDS = new Set("a an the i me my mine it its is are was were and or of to in on at for from with this that one something can could you please check possible match matches lost found report reports how do does what where when help campus university details contact public privacy mera meri mere mujhe mujhay mai mein ka ki ke hai hain ho gaya gayi mujhay mujhe apna yeh wo aur سے میں میرا میری مجھے ہے ہیں گم گیا گئی ایک یہ وہ کا کی کے".split(/\s+/));
const ALIASES = {
  backpack: "bag", bags: "bag", بیگ: "bag", بستہ: "bag",
  mobile: "phone", iphone: "phone", cellphone: "phone", فون: "phone", موبائل: "phone",
  wallets: "wallet", purse: "wallet", بٹوہ: "wallet", بٹوا: "wallet",
  key: "keys", چابی: "keys", چابیاں: "keys",
  id: "card", cards: "card", کارڈ: "card",
  book: "notebook", books: "notebook", register: "notebook", کتاب: "notebook",
  laptop: "laptop", لیپٹاپ: "laptop", ring: "ring", انگوٹھی: "ring",
  kala: "black", kali: "black", کالا: "black", کالی: "black",
  neela: "blue", neeli: "blue", نیلا: "blue", نیلی: "blue",
  laal: "red", lal: "red", لال: "red", سرخ: "red",
  safed: "white", سفید: "white",
};
const ITEM_TERMS = new Set(["bag", "phone", "wallet", "keys", "card", "notebook", "laptop", "ring", "helmet", "headphones", "watch", "bottle"]);

export function redactText(value, maxLength = 700) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email removed]")
    .replace(/\+?\d[\d(). -]{7,}\d/g, (value) => value.replace(/\D/g, "").length >= 10 ? "[number removed]" : value)
    .replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function tokenize(value) {
  return [...new Set(String(value || "").normalize("NFKC").toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word))
    .map((word) => ALIASES[word] || word))].slice(0, 18);
}

export function selectRelevantReports(rows, { message, history = [] }, limit = 8) {
  let tokens = tokenize(message);
  // Resolve short follow-ups ("it was black") against the last described item.
  if (!tokens.some((token) => ITEM_TERMS.has(token)) && tokens.length < 7) {
    const prior = [...history].reverse().find((entry) => entry.role === "user" && tokenize(entry.content).some((token) => ITEM_TERMS.has(token)));
    if (prior) tokens = [...new Set([...tokens, ...tokenize(prior.content)])];
  }
  if (!tokens.length) return [];
  const itemTerms = tokens.filter((token) => ITEM_TERMS.has(token));
  const intentText = `${history.filter((entry) => entry.role === "user").at(-1)?.content || ""} ${message}`.toLowerCase();
  const lostAt = Math.max(intentText.lastIndexOf("i lost"), intentText.lastIndexOf("lost my"), intentText.lastIndexOf("گم"));
  const foundAt = Math.max(intentText.lastIndexOf("i found"), intentText.lastIndexOf("found a"), intentText.lastIndexOf("ملا"));
  const targetKind = lostAt > foundAt ? "found" : foundAt > lostAt ? "lost" : null;

  return rows.map((item, index) => {
    if (targetKind && item.kind !== targetKind) return { item, score: 0, index };
    const fields = ["title", "category", "public_location", "color", "brand", "description"]
      .map((key) => new Set(tokenize(item[key])));
    if (itemTerms.length && !itemTerms.some((term) => fields.some((field) => field.has(term)))) return { item, score: 0, index };
    const weights = [7, 5, 3, 4, 4, 2];
    const score = fields.reduce((sum, field, fieldIndex) => sum + tokens.filter((token) => field.has(token)).length * weights[fieldIndex], 0);
    return { item, score, index };
  }).filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index).slice(0, limit)
    .map(({ item }) => ({
      kind: item.kind === "found" ? "found" : "lost",
      status: redactText(item.status, 40),
      title: redactText(item.title, 100), category: redactText(item.category, 80),
      color: redactText(item.color, 60), brand: redactText(item.brand, 60),
      description: redactText(item.description, 180),
      location: redactText(item.public_location, 100),
      occurredAt: redactText(item.occurred_at || item.created_at, 40),
    }));
}
