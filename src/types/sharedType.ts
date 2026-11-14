import type { ReactNode } from "react";
import type { TechDataSheetWithItems } from "./techDataSheetType";
// ------------- Request types -------------
export type RequestState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

// ------------- Modal types -------------
export type ModalProps = {
  title: string;
  onClose: () => void;
  size?: "md" | "lg";
  children: ReactNode;
  isBusy?: boolean;
};
// ------------- Combobox types -------------
export type ComboboxOption = { id: string; name: string };

export type ComboboxProps<T extends ComboboxOption> = {
  id: string;
  options: T[];
  value: string;
  onChange: (id: string) => void;
  onBlur?: () => void;
  getMeta?: (option: T) => string;
  placeholder?: string;
  emptyMessage?: string;
};

// ------------- Tech Data Sheet details types -------------
export type TechDataSheetDetailsProps = {
  techDataSheetsWithItems: TechDataSheetWithItems[];
};
// ------------- Fetch hook types -------------
export type UseFetchProps<T> = {
  fetcher: () => Promise<T>;
  errorMessage: string;
  keepPreviousData?: boolean;
};
