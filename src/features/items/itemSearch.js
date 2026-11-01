const normalize = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase();

export const matchesItemSearch = (item, searchQuery) => {
  const needle = normalize(searchQuery);
  if (!needle) return true;

  return [item?.title, item?.description, item?.location, item?.category, item?.brand]
    .some((value) => normalize(value).includes(needle));
};
