import * as Yup from "yup";
import { unitOptions } from "../constants/unitOptions";
import { techDataSheetcategoryOptions } from "../constants/techDataSheetcategoryOptions";

const productItemSchema = Yup.object({
  productId: Yup.string().required("Selecione um produto"),

  quantity: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Digite uma quantidade válida")
    .required("Informe a quantidade")
    .moreThan(0, "A quantidade deve ser maior que zero"),
});

export const validationDataSheetSchema = Yup.object().shape({
  name: Yup.string().trim().required("Campo obrigatório"),
  yield: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Digite um número válido")
    .required("Campo obrigatório")
    .moreThan(0, "O valor deve ser maior que 0"),
  yieldUnity: Yup.string()
    .oneOf(
      unitOptions.map((option) => option.value),
      "Selecione uma unidade válida",
    )
    .required("Selecione uma unidade"),
  obs: Yup.string().trim().required("Campo obrigatório"),
  products: Yup.array()
    .of(productItemSchema)
    .min(1, "Adicione pelo menos um ingrediente")
    .required("Adicione pelo menos um ingrediente")
    .test("unique-products", "Não repita o mesmo ingrediente", (rows) => {
      const ids = (rows ?? [])
        .map((row) => row.productId)
        .filter((id) => id !== "");

      return new Set(ids).size === ids.length;
    }),
  prepTime: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Digite um número válido")
    .required("Campo obrigatório")
    .moreThan(0, "O valor deve ser maior que 0"),
  category: Yup.string()
    .oneOf(
      techDataSheetcategoryOptions.map((option) => option),
      "Selecione uma categoria valida",
    )
    .required("Selecione uma categoria valida"),
});
