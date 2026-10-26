import type {
  TechDataSheetViewModalProps,
  TechDataSheetItemWithProduct,
} from "../types/techDataSheetsType";
import { useTechDataSheets } from "../hooks/useTechDataSheet";
import { Modal } from "./Modal";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const TechDataSheetsViewModal = ({
  onClose,
  dataSheet,
  products,
}: TechDataSheetViewModalProps) => {
  // ------------- Load data sheet items(custom hook) -------------
  const response = useTechDataSheets(dataSheet.id);
  const itemsDetails: TechDataSheetItemWithProduct[] =
    response.status === "success"
      ? response.data.flatMap((itemDetail) => {
          const product = products.find(
            (element) => element.id === itemDetail.productId,
          );
          return product ? [{ ...itemDetail, product }] : [];
        })
      : [];

  // ------------- Total cost calc -------------
  const totalCost = itemsDetails.reduce(
    (total, item) => total + item.product.cost * item.quantity,
    0,
  );

  // ------------- Print to PDF -------------
  const handlePrint = () => {
    window.print();
  };

  // ------------- Render -------------
  return (
    <Modal title={dataSheet.name} onClose={onClose} size="lg">
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
        <div className="print-area">
          <h1 className="hidden print:block text-2xl font-bold mb-4">
            {dataSheet.name}
          </h1>
          <dl className="summary">
            <div>
              <dt className="summary__label">Rendimento</dt>
              <dd className="summary__value">
                {dataSheet.yield.toFixed(2)} {dataSheet.yieldUnity}
              </dd>
            </div>
            <div>
              <dt className="summary__label">Custo total</dt>
              <dd className="summary__value">{formatCurrency(totalCost)}</dd>
            </div>
            <div>
              <dt className="summary__label">Categoria</dt>
              <dd className="summary__value">{dataSheet.category}</dd>
            </div>
            <div>
              <dt className="summary__label">Tempo de preparo</dt>
              <dd className="summary__value">{dataSheet.prepTime} minutos</dd>
            </div>
            <div>
              <dt className="summary__label">Data de criação</dt>
              <dd className="summary__value">
                {new Date(dataSheet.creationDate).toLocaleDateString("pt-BR")}
              </dd>
            </div>
            <div>
              <dt className="summary__label">Ultima revisão</dt>
              <dd className="summary__value">
                {new Date(dataSheet.lastRevision).toLocaleDateString("pt-BR")}
              </dd>
            </div>
          </dl>

          <section className="section">
            <h3 className="section__title">Insumos</h3>

            {itemsDetails.length === 0 ? (
              <p className="empty-state">
                Nenhum insumo disponível nesta ficha técnica.
              </p>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Insumo</th>
                      <th scope="col" className="table__num">
                        Quantidade
                      </th>
                      <th scope="col" className="table__num">
                        Custo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsDetails.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product.name}</td>
                        <td className="table__num">
                          {item.quantity} {item.product.unit}
                        </td>
                        <td className="table__num">
                          {formatCurrency(item.product.cost * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="section">
            <h3 className="section__title">Modo de preparo</h3>
            <p className="prose-text">{dataSheet.obs || "Não informado."}</p>
          </section>
        </div>
      )}

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
        >
          Imprimir para PDF
        </button>
      </div>
    </Modal>
  );
};
