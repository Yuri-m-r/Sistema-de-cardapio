import type { Product } from "./productType";

// ---------- Server types ----------
export type TechDataSheet = {
  id: string;
  companyId: string;
  name: string;
  yield: number;
  yieldUnity: string;
  creationDate: string;
  lastRevision: string;
  prepTime: number;
  category: string;
  obs: string;
};

export type TechDataSheetItem = {
  id: string;
  techDataSheetsId: string;
  productId: string;
  quantity: number;
};

export type TechDataSheetItemWithProduct = TechDataSheetItem & {
  product: Product;
};

// ---------- Forms types ----------
export type TechDataSheetFormItem = {
  id?: string;
  productId: string;
  quantity: number | "";
};

export type TechDataSheetFormValues = Omit<
  TechDataSheet,
  "id" | "yield" | "creationDate" | "lastRevision" | "prepTime"
> & {
  yield: number | "";
  prepTime: number | "";
  category: string;
  products: TechDataSheetFormItem[];
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
  prepTime: number;
  category: string;
  creationDate: string;
  lastRevision: string;
  products: NewTechDataSheetItem[];
};

export type EditedTechDataSheet = Omit<NewTechDataSheet, "products"> & {
  id: string;
  creationDate: string;
  lastRevision: string;
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
