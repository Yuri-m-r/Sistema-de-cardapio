import * as Yup from "yup";
import { unitOptions } from "../constants/unitOptions";
import { productCategoryOptions } from "../constants/productCategoryOptions";
import {
  checkTwoDecimalPlaces,
  emptyStringToUndefined,
} from "../utils/yupHelpers";

export const validationProductSchema = Yup.object().shape({
  name: Yup.string().trim().required("Campo obrigatório"),
  unit: Yup.string()
    .oneOf(
      unitOptions.map((option) => option.value),
      "Selecione uma unidade válida",
    )
    .required("Selecione uma unidade"),
  category: Yup.string()
    .oneOf(
      productCategoryOptions.map((option) => option.value),
      "Selecione uma categoria válida",
    )
    .required("Selecione uma categoria"),
  cost: Yup.number()
    .transform(emptyStringToUndefined)
    .typeError("Digite um número válido")
    .required("Campo obrigatório")
    .moreThan(0, "O valor deve ser maior que 0")
    .test(
      "decimal-places",
      "Utilize no máximo 2 casas decimais",
      checkTwoDecimalPlaces,
    ),
});
