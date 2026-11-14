import { useCallback } from "react";
import { useFetch } from "./useFetch";

import { getMenuItems } from "../api/menuApi";
import type { MenuItems } from "../types/menuType";

// ------------- Fetch menu items -------------
export const useMenuItem = (menuId: string | undefined) => {
  const fetchMenuItems = useCallback(async () => {
    if (!menuId) {
      return [];
    }

    return getMenuItems(menuId);
  }, [menuId]);

  const { response } = useFetch<MenuItems[]>({
    fetcher: fetchMenuItems,
    errorMessage: "Não foi possível carregar os itens do cardápio",
  });

  return { response };
};
