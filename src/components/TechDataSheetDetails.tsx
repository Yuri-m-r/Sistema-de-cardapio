import type { TechDataSheetDetailsProps } from "../types/sharedType";
import { calcTotalCost } from "../utils/calcTotalCost";
import { formatCurrency } from "../utils/formatCurrency";
import { formatNumber } from "../utils/formatNumber";

export const TechDataSheetDetails = ({
  techDataSheetsWithItems,
}: TechDataSheetDetailsProps) => {
  //------------- Render -------------
  return (
    <>
      {techDataSheetsWithItems.map(({ techDataSheet, itemsDetails }) => {
        const totalCost = calcTotalCost(itemsDetails);

        return (
          <div key={techDataSheet.id} className="print-all-area">
            <h3 className="print-title">{techDataSheet.name}</h3>

            <dl className="summary">
              <div>
                <dt className="summary__label">Rendimento</dt>
                <dd className="summary__value">
                  {formatNumber(techDataSheet.yield)} {techDataSheet.yieldUnit}
                </dd>
              </div>

              <div>
                <dt className="summary__label">Custo total</dt>
                <dd className="summary__value">{formatCurrency(totalCost)}</dd>
              </div>

              <div>
                <dt className="summary__label">Categoria</dt>
                <dd className="summary__value">{techDataSheet.category}</dd>
              </div>

              <div>
                <dt className="summary__label">Tempo de preparo</dt>
                <dd className="summary__value">
                  {techDataSheet.prepTime} minutos
                </dd>
              </div>

              <div>
                <dt className="summary__label">Data de criação</dt>
                <dd className="summary__value">
                  {new Date(techDataSheet.creationDate).toLocaleDateString(
                    "pt-BR",
                  )}
                </dd>
              </div>

              <div>
                <dt className="summary__label">Última revisão</dt>
                <dd className="summary__value">
                  {new Date(techDataSheet.lastRevision).toLocaleDateString(
                    "pt-BR",
                  )}
                </dd>
              </div>
            </dl>

            <section className="section">
              <h4 className="section__title">Insumos</h4>

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
                            {formatNumber(item.quantity)} {item.product.unit}
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
              <h4 className="section__title">Modo de preparo</h4>

              <p className="prose-text">
                {techDataSheet.obs || "Não informado."}
              </p>
            </section>
          </div>
        );
      })}
    </>
  );
};
