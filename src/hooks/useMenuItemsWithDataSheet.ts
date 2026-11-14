// ------------- Import react -------------
import { useMemo } from "react";
// ------------- Import types -------------
import type { RequestState } from "../types/sharedType";
import type { MenuItemsWithTechDataSheet } from "../types/menuType";
// ------------- Import hooks -------------
import { useAllTechDataSheet } from "./useAllTechDataSheet";
import { useMenuItem } from "./useMenuItem";

export const useMenuItemsWithDataSheet = (menuId: string | undefined) => {
  // ------------- Fetch tech data sheets and menu items -------------
  const { response: techDataSheets } = useAllTechDataSheet();
  const { response: menuItems } = useMenuItem(menuId);

  // ------------- Combine tech data sheets and menu items -------------
  const response = useMemo<RequestState<MenuItemsWithTechDataSheet[]>>(() => {
    if (techDataSheets.status === "loading" || menuItems.status === "loading") {
      return { status: "loading" };
    }

    if (techDataSheets.status === "error" || menuItems.status === "error") {
      return {
        status: "error",
        error: "Não foi possível carregar os preparos do cardápio.",
      };
    }

    const menusDataSheet: MenuItemsWithTechDataSheet[] = menuItems.data.flatMap(
      (item) => {
        const techDataSheet = techDataSheets.data.find(
          (sheet) => sheet.id === item.techDataSheetsId,
        );

        return techDataSheet ? [{ ...item, techDataSheet }] : [];
      },
    );

    return {
      status: "success",
      data: menusDataSheet,
    };
  }, [techDataSheets, menuItems]);

  return {
    response,
    techDataSheets,
    menuItems,
  };
};
