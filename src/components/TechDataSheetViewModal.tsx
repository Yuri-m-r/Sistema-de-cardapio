// ------------- Import types -------------
import type {
  TechDataSheetViewModalProps,
  TechDataSheetItemWithProduct,
} from "../types/techDataSheetType";
// ------------- Import hooks/components/utils -------------
import { useTechDataSheetItem } from "../hooks/useTechDataSheetItem";
import { TechDataSheetDetails } from "./TechDataSheetDetails";
import { Modal } from "./Modal";
//------------- Import utils -------------
import { handlePrint } from "../utils/handlePrint";

export const TechDataSheetViewModal = ({
  onClose,
  dataSheet,
  products,
}: TechDataSheetViewModalProps) => {
  // ------------- Get tech data sheet items  -------------
  const { response } = useTechDataSheetItem(dataSheet.id);
  // ------------- Create items with product details -------------
  const itemsDetails: TechDataSheetItemWithProduct[] =
    response.status === "success"
      ? response.data.flatMap((itemDetail) => {
          const product = products.find(
            (element) => element.id === itemDetail.productId,
          );

          return product ? [{ ...itemDetail, product }] : [];
        })
      : [];

  const techDataSheetsWithItems = [
    {
      techDataSheet: dataSheet,
      itemsDetails,
    },
  ];
  // ------------- Render -------------
  return (
    <Modal title={"Ficha técnica"} onClose={onClose} size="lg">
      {response.status === "loading" && (
        <p role="status" className="status-text">
          Carregando ficha técnica...
        </p>
      )}

      {response.status === "error" && (
        <p role="alert" className="alert alert--error">
          {response.error}
        </p>
      )}

      {response.status === "success" && (
        <TechDataSheetDetails
          techDataSheetsWithItems={techDataSheetsWithItems}
        />
      )}

      <div className="modal__footer">
        <button type="button" className="btn btn--secondary" onClick={onClose}>
          Fechar
        </button>

        <button
          type="button"
          className="btn btn--secondary"
          disabled={response.status !== "success"}
          onClick={handlePrint}
        >
          Imprimir para PDF
        </button>
      </div>
    </Modal>
  );
};
