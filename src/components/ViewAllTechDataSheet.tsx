import type { ViewAllTechDataSheetProps } from "../types/menuType";
import { TechDataSheetDetails } from "./TechDataSheetDetails";
import { handlePrint } from "../utils/handlePrint";

export const ViewAllTechDataSheet = ({
  onBack,
  techDataSheetsWithItems,
  viewRequests,
}: ViewAllTechDataSheetProps) => {
  // ------------- Render -------------

  return (
    <div>
      {/* ------------- Show status messages ------------- */}

      {techDataSheetsWithItems.length === 0 && (
        <p className="empty-state">Nenhuma ficha técnica encontrada.</p>
      )}

      {/* ------------- Show data sheets ------------- */}

      {techDataSheetsWithItems.length > 0 && (
        <TechDataSheetDetails
          techDataSheetsWithItems={techDataSheetsWithItems}
        />
      )}

      {/* ------------- Footer buttons ------------- */}

      <div className="modal__footer">
        <button type="button" className="btn btn--secondary" onClick={onBack}>
          Voltar para o cardápio
        </button>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={handlePrint}
          disabled={techDataSheetsWithItems.length === 0}
        >
          Imprimir para PDF
        </button>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={viewRequests}
          disabled={techDataSheetsWithItems.length === 0}
        >
          Visualizar requisições
        </button>
      </div>
    </div>
  );
};
