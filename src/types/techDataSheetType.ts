import type { Product } from "./productType";
import type { TechDataSheetCategoryOption } from "../constants/techDataSheetCategoryOptions";
import type { UnitOption } from "../constants/unitOptions";
// ---------- Server types ----------
export type TechDataSheet = {
  id: string;
  companyId: string;
  name: string;
  yield: number;
  yieldUnit: UnitOption;
  creationDate: string;
  lastRevision: string;
  prepTime: number;
  category: TechDataSheetCategoryOption;
  obs: string;
};

export type TechDataSheetItem = {
  id: string;
  techDataSheetsId: string;
  productId: string;
  quantity: number;
};

// ---------- Forms types ----------
type TechDataSheetFormItem = {
  id: string | undefined;
  productId: string;
  quantity: number | "";
  rowKey: string;
};

export type TechDataSheetFormValues = Omit<
  TechDataSheet,
  | "id"
  | "yield"
  | "creationDate"
  | "lastRevision"
  | "prepTime"
  | "category"
  | "yieldUnit"
> & {
  yield: number | "";
  yieldUnit: UnitOption | "";
  prepTime: number | "";
  products: TechDataSheetFormItem[];
  category: TechDataSheetCategoryOption | "";
};

// ---------- Send API types ----------
export type NewTechDataSheetItem = Omit<
  TechDataSheetItem,
  "id" | "techDataSheetsId"
>;

export type EditedTechDataSheetItem = NewTechDataSheetItem & {
  id?: string;
};

export type NewTechDataSheet = Omit<TechDataSheet, "id"> & {
  products: NewTechDataSheetItem[];
};

export type EditedTechDataSheet = Omit<NewTechDataSheet, "products"> & {
  id: string;
  products: EditedTechDataSheetItem[];
};

// ---------- Props and modal state types ----------
export type TechDataSheetViewModalProps = {
  onClose: () => void;
  dataSheet: TechDataSheet;
  products: Product[];
};

type BaseProps = {
  onClose: () => void;
  onSaved: (dataSheet: TechDataSheet) => void;
  allProducts: Product[];
};

export type TechDataSheetModalProps = BaseProps &
  (
    | {
        mode: "create";
        dataSheet?: never;
      }
    | {
        mode: "edit";
        dataSheet: TechDataSheet;
      }
  );

export type TechDataSheetModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; dataSheet: TechDataSheet }
  | { mode: "view"; dataSheet: TechDataSheet };

// ---------- Component and hook types ----------
export type TechDataSheetItemWithProduct = TechDataSheetItem & {
  product: Product;
};

export type TechDataSheetWithItems = {
  techDataSheet: TechDataSheet;
  itemsDetails: TechDataSheetItemWithProduct[];
};
