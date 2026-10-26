import { api } from "./api";
import type {
  TechDataSheet,
  TechDataSheetItem,
  NewTechDataSheet,
  EditedTechDataSheet,
} from "../types/techDataSheetsType";

// ------------- Get tech data sheet -------------
export const searchDataSheets = async (search: string = "") => {
  const term = search.trim();

  const response = await api.get<TechDataSheet[]>("/techDataSheets", {
    params: {
      ...(term && {
        _where: JSON.stringify({
          or: [{ name: { contains: term } }, { category: { contains: term } }],
        }),
      }),
    },
  });
  return response.data;
};

export const getDataSheetItems = async (id?: string) => {
  if (!id) {
    const response = await api.get<TechDataSheetItem[]>("/itemDetails");
    return response.data;
  }
  const response = await api.get<TechDataSheetItem[]>("/itemDetails", {
    params: {
      _where: JSON.stringify({
        techDataSheetsId: {
          eq: id,
        },
      }),
    },
  });
  return response.data;
};

// ------------- Delete tech data sheet -------------
export const deleteTechDataSheet = async (id: string) => {
  const response = await api.delete<TechDataSheet>(`/techDataSheets/${id}`);
  return response.data;
};

export const deleteDataSheetItems = async (id: string) => {
  const data = await getDataSheetItems(id);

  await Promise.all(data.map((item) => api.delete(`/itemDetails/${item.id}`)));
};
// ------------- Create tech data sheet -------------
const createDataSheet = async (dataSheet: NewTechDataSheet) => {
  const response = await api.post<TechDataSheet>("/techDataSheets", {
    companyId: dataSheet.companyId,
    name: dataSheet.name,
    yield: dataSheet.yield,
    yieldUnity: dataSheet.yieldUnity,
    obs: dataSheet.obs,
    prepTime: dataSheet.prepTime,
    category: dataSheet.category,
    creationDate: dataSheet.creationDate,
    lastRevision: dataSheet.lastRevision,
  });
  return response.data;
};

const createDataSheetItems = async (
  itemDetails: NewTechDataSheet,
  dataSheet: TechDataSheet,
) => {
  const results = await Promise.allSettled(
    itemDetails.products.map((item) =>
      api.post<TechDataSheetItem>("/itemDetails", {
        techDataSheetsId: dataSheet.id,
        productId: item.productId,
        quantity: item.quantity,
      }),
    ),
  );

  const created = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value.data);

  const failed = results.find((r) => r.status === "rejected");

  if (failed) {
    try {
      await Promise.all(
        created.map((item) => api.delete(`/itemDetails/${item.id}`)),
      );
    } catch (rollbackError) {
      console.error("Rollback dos itens falhou", rollbackError);
    }
    throw failed.reason;
  }

  return created;
};

export const createCompleteTechDataSheet = async (
  dataSheet: NewTechDataSheet,
) => {
  const createdDataSheet = await createDataSheet(dataSheet);

  try {
    await createDataSheetItems(dataSheet, createdDataSheet);
  } catch (error) {
    try {
      await deleteTechDataSheet(createdDataSheet.id);
    } catch (rollbackError) {
      console.error("Rollback da ficha falhou", rollbackError);
    }
    throw error;
  }

  return createdDataSheet;
};

// ------------- Update tech data sheet -------------
export const updateDataSheet = async (dataSheet: EditedTechDataSheet) => {
  const response = await api.put<TechDataSheet>(
    `/techDataSheets/${dataSheet.id}`,
    {
      companyId: dataSheet.companyId,
      name: dataSheet.name,
      yield: dataSheet.yield,
      yieldUnity: dataSheet.yieldUnity,
      obs: dataSheet.obs,
      prepTime: dataSheet.prepTime,
      category: dataSheet.category,
      creationDate: dataSheet.creationDate,
      lastRevision: dataSheet.lastRevision,
    },
  );

  return response.data;
};

export const updateDataSheetItems = async (
  editedDataSheet: EditedTechDataSheet,
  currentItems: TechDataSheetItem[],
) => {
  const removedItems = currentItems.filter(
    (current) =>
      !editedDataSheet.products.some((item) => item.id === current.id),
  );

  try {
    await Promise.all(
      removedItems.map((item) => api.delete(`/itemDetails/${item.id}`)),
    );

    const responses = await Promise.all(
      editedDataSheet.products.map((item) => {
        const body = {
          techDataSheetsId: editedDataSheet.id,
          productId: item.productId,
          quantity: item.quantity,
        };

        return item.id
          ? api.put<TechDataSheetItem>(`/itemDetails/${item.id}`, {
              ...body,
              id: item.id,
            })
          : api.post<TechDataSheetItem>("/itemDetails", body);
      }),
    );

    return responses.map((res) => res.data);
  } catch (error) {
    throw error;
  }
};
