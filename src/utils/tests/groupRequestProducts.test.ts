import { describe, it, expect } from "vitest";

import { groupRequestProducts } from "../groupRequestProducts";
import type { GroupRequestProducts } from "../../types/menuType";

const makeInput = (
  menuDetail: GroupRequestProducts["menuDetail"],
  techDataSheetsWithItems: GroupRequestProducts["techDataSheetsWithItems"],
): GroupRequestProducts => ({
  menuDetail,
  techDataSheetsWithItems,
});

const makeSheet = (
  id: string,
  quantity: number,
): GroupRequestProducts["techDataSheetsWithItems"][number] => ({
  techDataSheet: {
    id,
    companyId: "1",
    name: `Ficha técnica ${id}`,
    yield: 10,
    yieldUnit: "KG",
    creationDate: "2026-01-01",
    lastRevision: "2026-01-01",
    prepTime: 30,
    category: "PRATO PRINCIPAL",
    obs: "",
  },
  itemsDetails: [
    {
      id: "1",
      techDataSheetsId: id,
      productId: "1",
      quantity,
      product: {
        id: "1",
        companyId: "1",
        name: "Arroz",
        unit: "KG",
        cost: 5,
        category: "GRÃOS CEREAIS",
      },
    },
  ],
});

const makeProduct = (
  id: string,
  name: string,
  unit: "KG" | "UN",
  quantity: number,
): GroupRequestProducts["techDataSheetsWithItems"][number]["itemsDetails"][number] => ({
  id: `item-${id}`,
  techDataSheetsId: "1",
  productId: id,
  quantity,
  product: {
    id,
    companyId: "1",
    name,
    unit,
    cost: 5,
    category: "GRÃOS CEREAIS",
  },
});

describe("groupRequestProducts", () => {
  it("deve calcular a quantidade de insumos", () => {
    const input = makeInput(
      [{ techDataSheet: { id: "1" }, portionsPredicted: 50 }],
      [makeSheet("1", 0.1)],
    );

    const result = groupRequestProducts(input);

    expect(result).toEqual([
      {
        productId: "1",
        name: "Arroz",
        quantity: 5,
        unit: "KG",
      },
    ]);
  });

  it("deve somar produtos iguais de fichas diferentes", () => {
    const input = makeInput(
      [
        { techDataSheet: { id: "1" }, portionsPredicted: 50 },
        { techDataSheet: { id: "2" }, portionsPredicted: 50 },
      ],
      [makeSheet("1", 0.1), makeSheet("2", 0.2)],
    );

    const result = groupRequestProducts(input);

    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(15);
  });

  it("deve manter produtos diferentes separados", () => {
    const sheet = makeSheet("1", 0.1);

    const input = makeInput(
      [{ techDataSheet: { id: "1" }, portionsPredicted: 50 }],
      [
        {
          ...sheet,
          itemsDetails: [
            ...sheet.itemsDetails,
            makeProduct("2", "Feijão", "KG", 0.2),
          ],
        },
      ],
    );

    const result = groupRequestProducts(input);

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        {
          productId: "1",
          name: "Arroz",
          quantity: 5,
          unit: "KG",
        },
        {
          productId: "2",
          name: "Feijão",
          quantity: 10,
          unit: "KG",
        },
      ]),
    );
  });

  it("deve calcular vários insumos de uma mesma ficha técnica", () => {
    const sheet = makeSheet("1", 0.1);

    const input = makeInput(
      [{ techDataSheet: { id: "1" }, portionsPredicted: 50 }],
      [
        {
          ...sheet,
          itemsDetails: [
            ...sheet.itemsDetails,
            makeProduct("2", "Feijão", "KG", 0.2),
            makeProduct("3", "Ovo", "UN", 2),
          ],
        },
      ],
    );

    const result = groupRequestProducts(input);

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        {
          productId: "1",
          name: "Arroz",
          quantity: 5,
          unit: "KG",
        },
        {
          productId: "2",
          name: "Feijão",
          quantity: 10,
          unit: "KG",
        },
        {
          productId: "3",
          name: "Ovo",
          quantity: 100,
          unit: "UN",
        },
      ]),
    );
  });

  it("não deve modificar os dados de entrada", () => {
    const input = makeInput(
      [{ techDataSheet: { id: "1" }, portionsPredicted: 50 }],
      [makeSheet("1", 0.1)],
    );

    const originalInput = structuredClone(input);

    groupRequestProducts(input);

    expect(input).toEqual(originalInput);
  });

  it("deve ignorar fichas técnicas não encontradas", () => {
    const input = makeInput(
      [{ techDataSheet: { id: "99" }, portionsPredicted: 50 }],
      [],
    );

    const result = groupRequestProducts(input);

    expect(result).toEqual([]);
  });

  it("deve retornar um array vazio sem itens no cardápio", () => {
    const input = makeInput([], []);

    const result = groupRequestProducts(input);

    expect(result).toEqual([]);
  });

  it("deve retornar um array vazio quando a ficha técnica não possui insumos", () => {
    const sheet = makeSheet("1", 0.1);

    const input = makeInput(
      [{ techDataSheet: { id: "1" }, portionsPredicted: 50 }],
      [
        {
          ...sheet,
          itemsDetails: [],
        },
      ],
    );

    const result = groupRequestProducts(input);

    expect(result).toEqual([]);
  });
});
