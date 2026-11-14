// ------------- Format number to Brazilian format -------------
export const formatNumber = (
  value: number,
  minimumFractionDigits = 2,
  maximumFractionDigits = Math.max(minimumFractionDigits, 2),
): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits,
    maximumFractionDigits,
  });
};
