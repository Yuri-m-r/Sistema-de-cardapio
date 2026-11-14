import * as Yup from "yup";
import { unitOptions } from "../constants/unitOptions";
import { techDataSheetCategoryOptions } from "../constants/techDataSheetCategoryOptions";
import {
  checkTwoDecimalPlaces,
  emptyStringToUndefined,
} from "../utils/yupHelpers";

const productItemSchema = Yup.object({
  productId: Yup.string().required("Selecione um produto"),

  quantity: Yup.number()
    .transform(emptyStringToUndefined)
    .typeError("Digite uma quantidade válida")
    .required("Informe a quantidade")
    .moreThan(0, "A quantidade deve ser maior que zero")
    .test(
      "decimal-places",
      "Utilize no máximo 2 casas decimais",
      checkTwoDecimalPlaces,
    ),
});

export const validationDataSheetSchema = Yup.object().shape({
  name: Yup.string().trim().required("Campo obrigatório"),
  yield: Yup.number()
    .transform(emptyStringToUndefined)
    .typeError("Digite um número válido")
    .required("Campo obrigatório")
    .moreThan(0, "O valor deve ser maior que 0")
    .test(
      "decimal-places",
      "Utilize no máximo 2 casas decimais",
      checkTwoDecimalPlaces,
    ),
  yieldUnit: Yup.string()
    .oneOf(
      unitOptions.map((option) => option.value),
      "Selecione uma unidade válida",
    )
    .required("Selecione uma unidade"),
  obs: Yup.string().trim().required("Campo obrigatório"),
  products: Yup.array()
    .of(productItemSchema)
    .min(1, "Adicione pelo menos um ingrediente")
    .required("Adicione pelo menos um ingrediente"),
  prepTime: Yup.number()
    .transform(emptyStringToUndefined)
    .typeError("Digite um número válido")
    .required("Campo obrigatório")
    .moreThan(0, "O valor deve ser maior que 0")
    .integer("O valor deve ser um número inteiro"),
  category: Yup.string()
    .oneOf(
      techDataSheetCategoryOptions.map((option) => option.value),
      "Selecione uma categoria válida",
    )
    .required("Selecione uma categoria válida"),
});
