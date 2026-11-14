import type { TechDataSheetItemWithProduct } from "../types/techDataSheetType";
// ------------- Calculate total cost of tech data sheet items -------------
export const calcTotalCost = (itemsDetails: TechDataSheetItemWithProduct[]) => {
  const totalCost = itemsDetails.reduce(
    (total, item) => total + item.product.cost * item.quantity,
    0,
  );
  return totalCost;
};
