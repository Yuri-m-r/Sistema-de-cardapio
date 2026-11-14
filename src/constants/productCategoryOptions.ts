export const productCategoryOptions = [
  { value: "CARBOIDRATOS", label: "Carboidratos" },
  { value: "PROTEINAS", label: "Proteínas" },
  { value: "LEGUMINOSAS", label: "Leguminosas" },
  { value: "GRÃOS CEREAIS", label: "Grãos e Cereais" },
  { value: "FARINHAS MASSAS", label: "Farinhas e Massas" },
  { value: "SECOS", label: "Secos" },
  { value: "TEMPEROS CONDIMENTOS", label: "Temperos e Condimentos" },
  { value: "ERVAS ESPECIARIAS", label: "Ervas e Especiarias" },
  { value: "HORTIFRUTI", label: "Hortifruti" },
  { value: "FRUTAS", label: "Frutas" },
  { value: "VERDURAS LEGUMES", label: "Verduras e Legumes" },
  { value: "LATICÍNIOS", label: "Laticínios" },
  { value: "ÓLEOS GORDURAS", label: "Óleos e Gorduras" },
  { value: "MOLHOS", label: "Molhos" },
  { value: "AÇÚCARES ADOÇANTES", label: "Açúcares e Adoçantes" },
  { value: "BEBIDAS", label: "Bebidas" },
  { value: "POLPAS DE FRUTAS", label: "Polpas de Frutas" },
  { value: "PANIFICAÇÃO", label: "Panificação" },
  { value: "CONFEITARIA", label: "Confeitaria" },
  { value: "FRIOS", label: "Frios" },
] as const;

export type ProductCategoryOption =
  (typeof productCategoryOptions)[number]["value"];
