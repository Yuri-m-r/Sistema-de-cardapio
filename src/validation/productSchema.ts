import * as Yup from "yup";
import { unitOptions } from "../constants/unitOptions";

export const validationProductSchema = Yup.object().shape({
  name: Yup.string().trim().required("Campo obrigatório"),
  unit: Yup.string()
    .oneOf(
      unitOptions.map((option) => option.value),
      "Selecione uma unidade válida",
    )
    .required("Selecione uma unidade"),
  cost: Yup.number()
    .typeError("Digite um número válido")
    .required("Campo obrigatório")
    .moreThan(0, "O valor deve ser maior que 0"),
});
