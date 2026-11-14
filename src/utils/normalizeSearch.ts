// ------------- Normalize search text -------------
export const normalizeSearch = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
