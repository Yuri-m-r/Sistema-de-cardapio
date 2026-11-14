// ------------- Convert empty string to undefined -------------
export const emptyStringToUndefined = (
  value: unknown,
  originalValue: unknown,
) => {
  return originalValue === "" ? undefined : value;
};

export const checkTwoDecimalPlaces = (value: number) => {
  return Math.abs(value * 100 - Math.round(value * 100)) < 1e-8;
};
