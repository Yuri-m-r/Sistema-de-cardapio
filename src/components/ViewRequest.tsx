import type { ViewRequestsProps } from "../types/menuType";
import { handlePrint } from "../utils/handlePrint";
import { groupRequestProducts } from "../utils/groupRequestProducts";
import { formatNumber } from "../utils/formatNumber";

export const ViewRequest = ({
  onBack,
  techDataSheetsWithItems,
  menuDetail,
  viewTechDataSheets,
  menu,
}: ViewRequestsProps) => {
  const groupedProducts = groupRequestProducts({
    menuDetail,
    techDataSheetsWithItems,
  });

  // ------------- Render -------------

  return (
    <div>
      {groupedProducts.length === 0 && (
        <p className="empty-state">Nenhum insumo para requisitar.</p>
      )}

      <div className="print-area">
        <h3 className="print-only">
          {menu.name} - Dia da semana: {menu.weekDay}
        </h3>
        <h3 className="print-title">
          Requisição de insumos - Data: {new Date().toLocaleDateString("pt-BR")}
        </h3>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Insumo</th>
                <th scope="col" className="table__num">
                  Quantidade
                </th>
                <th scope="col" className="table__num">
                  Unidade
                </th>
              </tr>
            </thead>

            <tbody>
              {groupedProducts.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td className="table__num">{formatNumber(item.quantity)}</td>
                  <td className="table__num">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ------------- Footer buttons ------------- */}
      <div className="modal__footer">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          Voltar para o cardápio
        </button>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={handlePrint}
          disabled={groupedProducts.length === 0}
        >
          Imprimir para PDF
        </button>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={viewTechDataSheets}
          disabled={techDataSheetsWithItems.length === 0}
        >
          Visualizar fichas técnicas
        </button>
      </div>
    </div>
  );
};
