import type { UnitOption } from "../constants/unitOptions";
import type { ProductCategoryOption } from "../constants/productCategoryOptions";

// ---------- Server types ----------
export type Product = {
  id: string;
  companyId: string;
  name: string;
  unit: UnitOption;
  cost: number;
  category: ProductCategoryOption;
};

// ---------- Forms types ----------
export type NewProduct = Omit<Product, "id">;

export type ProductFormValues = Omit<
  NewProduct,
  "cost" | "unit" | "category"
> & {
  cost: number | "";
  unit: UnitOption | "";
  category: ProductCategoryOption | "";
};

// ---------- Props and modal state types ----------
export type ProductModalState =
  { mode: "closed" } | { mode: "create" } | { mode: "edit"; product: Product };

type BaseProps = {
  onClose: () => void;
  onSaved: (product: Product) => void;
};

export type ProductModalProps = BaseProps &
  (
    | {
        mode: "create";
        product?: never;
      }
    | {
        mode: "edit";
        product: Product;
      }
  );
