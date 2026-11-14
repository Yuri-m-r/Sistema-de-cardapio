// ------------- Format number to Brazilian currency -------------
export const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
