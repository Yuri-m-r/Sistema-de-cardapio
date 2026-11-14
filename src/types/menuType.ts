import type {
  TechDataSheet,
  TechDataSheetWithItems,
} from "./techDataSheetType";
import type { TechDataSheetDetailsProps } from "./sharedType";
import type { WeekDayOption } from "../constants/weekDayOptions";
import type { UnitOption } from "../constants/unitOptions";
// ---------- Server types ----------
export type Menu = {
  id: string;
  companyId: string;
  name: string;
  weekDay: WeekDayOption;
};

export type MenuItems = {
  id: string;
  menuId: string;
  techDataSheetsId: string;
  portionsPredicted: number;
};

// ---------- Forms types ----------
type TechDataSheetFormMenu = {
  techDataSheetsId: string;
  id: string | undefined;
  portionsPredicted: number | "";
  rowKey: string;
};

export type MenuFormValues = Omit<Menu, "id" | "weekDay"> & {
  weekDay: WeekDayOption | "";
  techDataSheetsForm: TechDataSheetFormMenu[];
};

// ---------- Send API types ----------
export type NewMenu = Omit<Menu, "id"> & {
  menuItems: Omit<MenuItems, "id" | "menuId">[];
};

export type EditedMenu = Menu & {
  menuItems: (Omit<MenuItems, "id"> & {
    id?: string;
  })[];
};
// ---------- Props and modal state types ----------

export type MenuViewModalProps = {
  onClose: () => void;
  menu: Menu;
};
type BaseProps = {
  onClose: () => void;
  onSaved: (menu: Menu) => void;
};

export type MenuModalProps = BaseProps &
  (
    | {
        mode: "create";
        menu?: never;
      }
    | {
        mode: "edit";
        menu: Menu;
      }
  );

export type MenuModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; menu: Menu }
  | { mode: "view"; menu: Menu };

export type ViewAllTechDataSheetProps = {
  onBack: () => void;
  viewRequests: () => void;
} & TechDataSheetDetailsProps;

export type ViewRequestsProps = {
  menuDetail: MenuItemsWithTechDataSheet[];
  viewTechDataSheets: () => void;
  onBack: () => void;
  menu: Menu;
} & TechDataSheetDetailsProps;

// ---------- Hook types ----------
export type MenuItemsWithTechDataSheet = MenuItems & {
  techDataSheet: TechDataSheet;
};

// ---------- Utils types ----------

type MenuDetailItem = {
  techDataSheet: Pick<TechDataSheet, "id">;
  portionsPredicted: number;
};

export type GroupRequestProducts = {
  menuDetail: MenuDetailItem[];
  techDataSheetsWithItems: TechDataSheetWithItems[];
};

export type RequestProduct = {
  productId: string;
  name: string;
  quantity: number;
  unit: UnitOption;
};
