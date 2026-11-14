export const weekDayOptions = [
  { value: "SEGUNDA", label: "Segunda-feira" },
  { value: "TERÇA", label: "Terça-feira" },
  { value: "QUARTA", label: "Quarta-feira" },
  { value: "QUINTA", label: "Quinta-feira" },
  { value: "SEXTA", label: "Sexta-feira" },
  { value: "SÁBADO", label: "Sábado" },
  { value: "DOMINGO", label: "Domingo" },
] as const;

export type WeekDayOption = (typeof weekDayOptions)[number]["value"];
