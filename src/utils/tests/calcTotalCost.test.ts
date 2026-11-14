import { describe, it, expect } from "vitest";

import { calcTotalCost } from "../calcTotalCost";
import type { TechDataSheetItemWithProduct } from "../../types/techDataSheetType";

const makeItem = (
  id: string,
  quantity: number,
  cost: number,
): TechDataSheetItemWithProduct => ({
  id,
  techDataSheetsId: "1",
  productId: id,
  quantity,
  product: {
    id,
    companyId: "1",
    name: `Produto ${id}`,
    unit: "KG",
    cost,
    category: "GRÃOS CEREAIS",
  },
});

describe("calcTotalCost", () => {
  it("deve calcular o custo de um único insumo", () => {
    const itemsDetails = [makeItem("1", 2, 5)];

    const result = calcTotalCost(itemsDetails);

    expect(result).toBe(10);
  });

  it("deve somar o custo de vários insumos", () => {
    const itemsDetails = [
      makeItem("1", 2, 5),
      makeItem("2", 3, 10),
      makeItem("3", 1, 15),
    ];

    const result = calcTotalCost(itemsDetails);

    expect(result).toBe(55);
  });

  it("deve retornar zero quando não houver insumos", () => {
    const itemsDetails: TechDataSheetItemWithProduct[] = [];

    const result = calcTotalCost(itemsDetails);

    expect(result).toBe(0);
  });

  it("deve retornar zero quando os insumos tiverem custo zero", () => {
    const itemsDetails = [makeItem("1", 2, 0), makeItem("2", 3, 0)];

    const result = calcTotalCost(itemsDetails);

    expect(result).toBe(0);
  });

  it("deve calcular corretamente quantidades fracionadas", () => {
    const itemsDetails = [makeItem("1", 0.5, 10), makeItem("2", 0.25, 20)];

    const result = calcTotalCost(itemsDetails);

    expect(result).toBe(10);
  });
});
