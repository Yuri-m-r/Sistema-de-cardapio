// ------------- Import api -------------
import { api } from "./api";
// ------------- Import types -------------
import type { EditedMenu, Menu, MenuItems, NewMenu } from "../types/menuType";

// ------------- Get menus -------------

export const searchMenus = async (search: string = "") => {
  const term = search.trim();

  const response = await api.get<Menu[]>("/menus", {
    params: {
      ...(term && {
        _where: JSON.stringify({
          or: [{ name: { contains: term } }, { weekDay: { contains: term } }],
        }),
      }),
    },
  });

  return response.data;
};

export const getMenuItems = async (id: string) => {
  const response = await api.get<MenuItems[]>("/menuItems", {
    params: { menuId: id },
  });

  return response.data;
};

// ------------- Delete menus -------------
export const deleteMenu = async (id: string) => {
  const response = await api.delete<Menu>(`/menus/${id}`);
  return response.data;
};

export const deleteMenuItems = async (id: string) => {
  const data = await getMenuItems(id);

  await Promise.all(data.map((item) => api.delete(`/menuItems/${item.id}`)));
};

// ------------- Create menu -------------
const createMenu = async (menu: NewMenu) => {
  const response = await api.post<Menu>("/menus", {
    companyId: menu.companyId,
    name: menu.name,
    weekDay: menu.weekDay,
  });
  return response.data;
};

const createMenuItems = async (menu: NewMenu, createdMenu: Menu) => {
  const results = await Promise.allSettled(
    menu.menuItems.map((item) =>
      api.post<MenuItems>("/menuItems", {
        menuId: createdMenu.id,
        techDataSheetsId: item.techDataSheetsId,
        portionsPredicted: item.portionsPredicted,
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
        created.map((item) => api.delete(`/menuItems/${item.id}`)),
      );
    } catch (rollbackError) {
      console.error("Rollback dos itens falhou", rollbackError);
    }
    throw failed.reason;
  }

  return created;
};
export const createCompleteMenu = async (menu: NewMenu) => {
  const createdMenu = await createMenu(menu);

  try {
    await createMenuItems(menu, createdMenu);
  } catch (error) {
    try {
      await deleteMenu(createdMenu.id);
    } catch (rollbackError) {
      console.error("Rollback do menu falhou", rollbackError);
    }
    throw error;
  }

  return createdMenu;
};

// ------------- Update menus -------------

export const updateMenu = async (menu: EditedMenu) => {
  const response = await api.put<Menu>(`/menus/${menu.id}`, {
    companyId: menu.companyId,
    name: menu.name,
    weekDay: menu.weekDay,
  });

  return response.data;
};

export const updateMenuItems = async (
  editedMenuItems: EditedMenu["menuItems"],
  currentItems: MenuItems[],
) => {
  const removedItems = currentItems.filter(
    (current) => !editedMenuItems.some((item) => current.id === item.id),
  );

  const response = await Promise.all(
    editedMenuItems.map((item) => {
      const body = {
        menuId: item.menuId,
        techDataSheetsId: item.techDataSheetsId,
        portionsPredicted: item.portionsPredicted,
      };

      return item.id
        ? api.put<MenuItems>(`/menuItems/${item.id}`, {
            ...body,
            id: item.id,
          })
        : api.post<MenuItems>("/menuItems", body);
    }),
  );

  await Promise.all(
    removedItems.map((item) => api.delete(`/menuItems/${item.id}`)),
  );

  return response.map((r) => r.data);
};
