import * as Yup from "yup";
import { weekDayOptions } from "../constants/weekDayOptions";
import { emptyStringToUndefined } from "../utils/yupHelpers";

const techDataSheetsForm = Yup.object().shape({
  techDataSheetsId: Yup.string().required("Campo obrigatório"),
  portionsPredicted: Yup.number()
    .transform(emptyStringToUndefined)
    .typeError("Digite uma quantidade válida")
    .required("Informe a quantidade")
    .moreThan(0, "A quantidade deve ser maior que zero")
    .integer("O valor deve ser um número inteiro"),
});

export const validationMenuSchema = Yup.object().shape({
  name: Yup.string().trim().required("Campo obrigatório"),
  weekDay: Yup.string()
    .oneOf(
      weekDayOptions.map((option) => option.value),
      "Selecione um dia válido",
    )
    .required("Selecione um dia"),
  techDataSheetsForm: Yup.array()
    .of(techDataSheetsForm)
    .min(1, "Adicione ao menos um preparo"),
});
