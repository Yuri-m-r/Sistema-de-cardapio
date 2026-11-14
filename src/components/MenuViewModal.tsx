// ------------- Import react -------------
import { useMemo, useState } from "react";
// ------------- Import types -------------
import type { MenuViewModalProps } from "../types/menuType";
// ------------- Import components -------------
import { Modal } from "./Modal";
import { ViewAllTechDataSheet } from "./ViewAllTechDataSheet";
import { ViewRequest } from "./ViewRequest";
// ------------- Import hooks -------------
import { useMenuItemsWithDataSheet } from "../hooks/useMenuItemsWithDataSheet";
import { useTechDataSheetItem } from "../hooks/useTechDataSheetItem";
import { useProduct } from "../hooks/useProduct";
// ------------- Import utils -------------
import { handlePrint } from "../utils/handlePrint";
import { formatNumber } from "../utils/formatNumber";

export const MenuViewModal = ({ onClose, menu }: MenuViewModalProps) => {
  // ------------- State -------------
  const [view, setView] = useState<"menu" | "sheets" | "requests">("menu");

  // ------------- Get menu items with data sheets -------------

  const { response } = useMenuItemsWithDataSheet(menu.id);

  const dataSheets = useMemo(
    () =>
      response.status === "success"
        ? response.data.map((item) => item.techDataSheet)
        : [],
    [response],
  );

  const dataSheetsId = dataSheets.map((dataSheet) => dataSheet.id);

  // ------------- Load products and data sheets -------------
  const { response: dataSheetItems } = useTechDataSheetItem(dataSheetsId);

  const { response: productsResponse } = useProduct();

  // ------------- Combine data -------------

  const techDataSheetsWithItems =
    dataSheetItems.status === "success" && productsResponse.status === "success"
      ? dataSheets.map((sheet) => ({
          techDataSheet: sheet,
          itemsDetails: dataSheetItems.data.flatMap((item) => {
            if (item.techDataSheetsId !== sheet.id) return [];

            const product = productsResponse.data.find(
              (product) => product.id === item.productId,
            );

            return product ? [{ ...item, product }] : [];
          }),
        }))
      : [];

  // ------------- Show status messages ------------

  const getStatusMessage = () => {
    if (
      dataSheetItems.status === "loading" ||
      productsResponse.status === "loading" ||
      response.status === "loading"
    ) {
      return (
        <p role="status" className="status-text">
          Carregando fichas técnicas...
        </p>
      );
    }

    if (productsResponse.status === "error") {
      return (
        <p role="alert" className="alert alert--error">
          {productsResponse.error}
        </p>
      );
    }

    if (dataSheetItems.status === "error") {
      return (
        <p role="alert" className="alert alert--error">
          {dataSheetItems.error}
        </p>
      );
    }

    if (response.status === "error") {
      return (
        <p role="alert" className="alert alert--error">
          {response.error}
        </p>
      );
    }

    if (response.status === "success" && response.data.length === 0) {
      return (
        <p className="empty-state">Nenhum preparo disponível neste cardápio.</p>
      );
    }

    return null;
  };

  const isViewDataReady =
    response.status === "success" &&
    dataSheetItems.status === "success" &&
    dataSheetItems.data.length > 0 &&
    productsResponse.status === "success" &&
    techDataSheetsWithItems.length > 0;

  // ------------- Render -------------

  return (
    <Modal
      title={
        view === "menu" || view === "requests"
          ? `${menu.name} - Dia da semana: ${menu.weekDay}`
          : "Fichas técnicas"
      }
      onClose={onClose}
      size="lg"
    >
      {/* ------------- Show status messages ------------- */}
      {getStatusMessage()}
      {view === "menu" && isViewDataReady ? (
        <div>
          <div className="print-area">
            <h1 className="print-only">{menu.name}</h1>

            <section className="section">
              <h3 className="section__title">Cardápio</h3>

              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Preparo</th>

                      <th scope="col" className="table__num">
                        Rendimento
                      </th>

                      <th scope="col" className="table__num">
                        Receitas previstas
                      </th>

                      <th scope="col" className="table__num">
                        Rendimento total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {response.data.map((item) => (
                      <tr key={item.id}>
                        <td>{item.techDataSheet.name}</td>

                        <td className="table__num">
                          {formatNumber(item.techDataSheet.yield)}{" "}
                          {item.techDataSheet.yieldUnit}
                        </td>

                        <td className="table__num">{item.portionsPredicted}</td>

                        <td className="table__num">
                          {formatNumber(
                            item.techDataSheet.yield * item.portionsPredicted,
                          )}{" "}
                          {item.techDataSheet.yieldUnit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          {/* ------------- Footer buttons ------------- */}
          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => onClose()}
            >
              Fechar
            </button>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handlePrint()}
              disabled={!isViewDataReady}
            >
              Imprimir para PDF
            </button>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setView("sheets")}
              disabled={!isViewDataReady}
            >
              Visualizar fichas técnicas
            </button>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setView("requests")}
              disabled={!isViewDataReady}
            >
              Visualizar requisições
            </button>
          </div>
          {/* ------------- View all tech data sheet / View requests ------------- */}
        </div>
      ) : view === "sheets" && isViewDataReady ? (
        <ViewAllTechDataSheet
          onBack={() => setView("menu")}
          viewRequests={() => setView("requests")}
          techDataSheetsWithItems={techDataSheetsWithItems}
        />
      ) : view === "requests" && isViewDataReady ? (
        <ViewRequest
          onBack={() => setView("menu")}
          viewTechDataSheets={() => setView("sheets")}
          techDataSheetsWithItems={techDataSheetsWithItems}
          menuDetail={response.data}
          menu={menu}
        />
      ) : null}
    </Modal>
  );
};
