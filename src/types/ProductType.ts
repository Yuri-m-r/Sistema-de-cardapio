// ---------- Server types ----------
export type Product = {
  id: string;
  companyId: string;
  name: string;
  unit: string;
  cost: number;
  category:string
};

// ---------- Forms types ----------
export type NewProduct = Omit<Product, "id">;

export type ProductFormValues = Omit<NewProduct, "cost"> & {
  cost: number | "";
};

// ---------- Props and modal state types ----------
export type ProductModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; product: Product };

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
