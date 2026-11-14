import { searchProducts } from "../api/productApi";
import type { Product } from "../types/productType";
import { useFetch } from "./useFetch";

//------------- Fetch all products -------------
export const useProduct = () => {
  const { response } = useFetch<Product[]>({
    fetcher: searchProducts,
    errorMessage: "Não foi possível carregar os produtos",
  });

  return { response };
};
