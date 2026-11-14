import type { GroupRequestProducts, RequestProduct } from "../types/menuType";
// ------------- Combine menu itens with tech data sheet items  -------------
export const groupRequestProducts = ({
  menuDetail,
  techDataSheetsWithItems,
}: GroupRequestProducts): RequestProduct[] => {
  const calcProductQuantity = menuDetail.flatMap((menuItem) => {
    const techDataSheet = techDataSheetsWithItems.find(
      (item) => item.techDataSheet.id === menuItem.techDataSheet.id,
    );

    return techDataSheet
      ? techDataSheet.itemsDetails.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          quantity: item.quantity * menuItem.portionsPredicted,
          unit: item.product.unit,
        }))
      : [];
  });

  return calcProductQuantity.reduce<RequestProduct[]>((acc, item) => {
    const existingItem = acc.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }

    return acc;
  }, []);
};
