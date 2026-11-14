import { useCallback } from "react";

import type { TechDataSheetItem } from "../types/techDataSheetType";

import { getDataSheetItems } from "../api/techDataSheetApi";
import { useFetch } from "./useFetch";

// ------------- Fetch tech data sheet items -------------
export const useTechDataSheetItem = (
  dataSheetId: string | string[] | undefined,
) => {
  const ids = !dataSheetId
    ? []
    : typeof dataSheetId === "string"
      ? [dataSheetId]
      : dataSheetId;

  // ------------- Create a stable key for the fetcher -------------
  const key = JSON.stringify(ids);

  const fetchItems = useCallback(async (): Promise<TechDataSheetItem[]> => {
    const stableIds: string[] = JSON.parse(key);

    if (stableIds.length === 0) return [];

    const results = await Promise.all(
      stableIds.map((id) => getDataSheetItems(id)),
    );

    return results.flat();
  }, [key]);

  const { response } = useFetch<TechDataSheetItem[]>({
    fetcher: fetchItems,
    errorMessage: "Não foi possível carregar os itens da ficha técnica",
  });

  return { response };
};
