export const techDataSheetCategoryOptions = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "PRATO PRINCIPAL", label: "Prato principal" },
  { value: "ACOMPANHAMENTO", label: "Acompanhamento" },
  { value: "SOBREMESA", label: "Sobremesa" },
  { value: "MOLHO", label: "Molho" },
  { value: "SUCO", label: "Suco" },
  { value: "DRINK", label: "Drink" },
] as const;

export type TechDataSheetCategoryOption =
  (typeof techDataSheetCategoryOptions)[number]["value"];
