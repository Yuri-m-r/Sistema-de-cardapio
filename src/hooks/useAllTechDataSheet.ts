import type { TechDataSheet } from "../types/techDataSheetType";
import { searchDataSheets } from "../api/techDataSheetApi";
import { useFetch } from "./useFetch";
export const useAllTechDataSheet = () => {
  // ------------- Fetch all tech data sheets -------------
  const { response } = useFetch<TechDataSheet[]>({
    fetcher: searchDataSheets,
    errorMessage: "Não foi possível carregar as fichas técnicas",
  });

  return { response };
};
