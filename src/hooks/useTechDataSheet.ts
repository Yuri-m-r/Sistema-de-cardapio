import type { RequestState } from "../types/sharedTypes";
import type { TechDataSheetItem } from "../types/techDataSheetsType";
import { useEffect, useState } from "react";
import { getDataSheetItems } from "../api/techDataSheetApi";

export const useTechDataSheets = (
  dataSheetId: string | undefined,
): RequestState<TechDataSheetItem[]> => {
  const [response, setResponse] = useState<RequestState<TechDataSheetItem[]>>({
    status: "loading",
  });

  // ------------- Get data sheet items -------------
  useEffect(() => {
    let ignore = false;

    const loadItems = async () => {
      if (!dataSheetId) return;

      setResponse({ status: "loading" });

      try {
        const data = await getDataSheetItems(dataSheetId);
        console.log(data);
        if (data.length === 0) throw Error;
        if (ignore) return;

        setResponse({ status: "success", data });
      } catch (error) {
        if (ignore) return;

        console.error(error);
        setResponse({
          status: "error",
          error: "Não foi possível carregar os itens da ficha técnica",
        });
      }
    };

    loadItems();

    return () => {
      ignore = true;
    };
  }, [dataSheetId]);

  return response;
};
