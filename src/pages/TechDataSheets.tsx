// ------------- Import react -------------
import { useState, useCallback } from "react";
//------------- Import api -------------
import {
  searchDataSheets,
  deleteTechDataSheet,
  deleteDataSheetItems,
  isTechDataSheetInUse,
} from "../api/techDataSheetApi";
// ------------- Import types -------------
import type {
  TechDataSheet,
  TechDataSheetModalState,
} from "../types/techDataSheetType";
// ------------- Import components -------------
import { TechDataSheetViewModal } from "../components/TechDataSheetViewModal";
import { TechDataSheetModal } from "../components/TechDataSheetModal";
//------------- Import hooks -------------
import { useProduct } from "../hooks/useProduct";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { useSearchQuery } from "../hooks/useSearchQuery";
//------------- Import errors/utils -------------
import { InUseError } from "../errors/InUseError";
import { formatNumber } from "../utils/formatNumber";

export const TechDataSheets = () => {
  // ------------- State -------------
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [modal, setModal] = useState<TechDataSheetModalState>({
    mode: "closed",
  });
  const { search, handleSearchChange, clearSearch } = useSearchQuery();
  const debouncedSearch = useDebounce(search, 300);

  // ------------- Show tech data sheets -------------
  const { response: productsResponse } = useProduct();
  const fetchTechDataSheets = useCallback(() => {
    return searchDataSheets(debouncedSearch);
  }, [debouncedSearch]);

  const { response, setResponse, isFetching } = useFetch({
    fetcher: fetchTechDataSheets,
    errorMessage: "Erro ao buscar fichas técnicas",
    keepPreviousData: true,
  });
  // ------------- Handle deleted tech data sheets -------------
  const handleDeleted = async (id: string) => {
    if (response.status !== "success") return;
    const item = response.data.find((dataSheet) => dataSheet.id === id);

    if (!item) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a ficha técnica ${item.name}?`,
    );

    if (!confirmed) return;
    setDeleteError(null);
    setDeletingId(id);

    try {
      const usedDataSheets = await isTechDataSheetInUse(id);

      if (usedDataSheets) {
        throw new InUseError(
          "A ficha técnica está sendo usada em um cardápio e não pode ser excluída.",
        );
      }

      await deleteDataSheetItems(id);
      await deleteTechDataSheet(id);

      setResponse((prev) => {
        if (prev.status === "success") {
          return {
            data: prev.data.filter((dataSheet) => dataSheet.id !== id),
            status: "success",
          };
        }
        return prev;
      });
    } catch (error) {
      console.error(error);
      if (error instanceof InUseError) {
        setDeleteError(error.message);
      } else {
        setDeleteError("Erro ao excluir a ficha técnica. Tente novamente.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ------------- Handle created tech data sheets -------------
  const handleDataSheetCreated = (newDataSheet: TechDataSheet) => {
    setResponse((prev) => {
      if (prev.status === "success") {
        return {
          data: [...prev.data, newDataSheet],
          status: "success",
        };
      }
      return prev;
    });
    clearSearch();
  };

  // ------------- Handle updated tech data sheets -------------
  const handleDataSheetUpdated = (savedDataSheet: TechDataSheet) => {
    setResponse((prev) => {
      if (prev.status === "success") {
        return {
          data: prev.data.map((dataSheet) =>
            dataSheet.id === savedDataSheet.id ? savedDataSheet : dataSheet,
          ),
          status: "success",
        };
      }
      return prev;
    });
  };

  // ------------- Show status messages -------------
  const getStatusMessage = () => {
    if (response.status === "loading" || isFetching) return "Buscando...";
    if (response.status === "success" && response.data.length > 0)
      return `Total de fichas técnicas encontradas: ${response.data.length}`;
    return null;
  };

  // ------------- Render-------------
  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Fichas técnicas</h1>
          <p className="page__subtitle">
            Monte receitas com seus insumos e acompanhe o custo de cada uma.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          disabled={productsResponse.status !== "success"}
          onClick={() =>
            setModal({
              mode: "create",
            })
          }
        >
          Cadastrar ficha técnica
        </button>
      </header>

      <div className="field search">
        <label htmlFor="search" className="label">
          Buscar fichas técnicas
        </label>
        <input
          type="text"
          id="search"
          className="input"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Digite o nome da ficha técnica ou categoria"
        />
      </div>

      {/* -------------- Status messages -------------- */}
      <p role="status" className="status-text">
        {getStatusMessage()}
      </p>

      {response.status === "error" && (
        <p role="alert" className="alert alert--error">
          {response.error}
        </p>
      )}
      {productsResponse.status === "loading" && (
        <p className="status-text">Carregando produtos...</p>
      )}
      {productsResponse.status === "error" && (
        <p role="alert" className="alert alert--error">
          {productsResponse.error}
        </p>
      )}
      {deleteError && (
        <p role="alert" className="alert alert--error">
          {deleteError}
        </p>
      )}

      {response.status === "success" && response.data.length === 0 && (
        <p className="empty-state">Nenhuma ficha técnica encontrada.</p>
      )}
      {/* -------------- Status messages -------------- */}

      {response.status === "success" && response.data.length > 0 && (
        <ul className="card-grid">
          {response.data.map((techDataSheet) => (
            <li key={techDataSheet.id} className="card">
              <div className="card__body">
                <div className="card__header">
                  <h2 className="card__title">{techDataSheet.name}</h2>
                  {techDataSheet.category && (
                    <span className="badge badge--accent">
                      {techDataSheet.category}
                    </span>
                  )}
                </div>
                <p className="card__label">Rendimento</p>
                <p className="card__value">
                  {formatNumber(techDataSheet.yield)} {techDataSheet.yieldUnit}
                </p>
                <p className="card__label">Tempo de preparo</p>
                <p className="card__value">{techDataSheet.prepTime} minutos</p>
              </div>

              <div className="card__actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  aria-label={`Visualizar ${techDataSheet.name}`}
                  disabled={deletingId === techDataSheet.id}
                  onClick={() =>
                    setModal({
                      mode: "view",
                      dataSheet: techDataSheet,
                    })
                  }
                >
                  Visualizar
                </button>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  aria-label={`Editar ${techDataSheet.name}`}
                  disabled={deletingId === techDataSheet.id}
                  onClick={() =>
                    setModal({
                      mode: "edit",
                      dataSheet: techDataSheet,
                    })
                  }
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn--danger btn--sm"
                  aria-label={`Excluir ${techDataSheet.name}`}
                  disabled={deletingId !== null}
                  onClick={() => {
                    handleDeleted(techDataSheet.id);
                  }}
                >
                  {deletingId === techDataSheet.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* -------------- View tech data sheets -------------- */}
      {modal.mode === "view" && productsResponse.status === "success" && (
        <TechDataSheetViewModal
          key={modal.dataSheet.id}
          onClose={() => setModal({ mode: "closed" })}
          dataSheet={modal.dataSheet}
          products={productsResponse.data}
        />
      )}
      {/* -------------- Create tech data sheets -------------- */}
      {modal.mode === "create" && productsResponse.status === "success" && (
        <TechDataSheetModal
          mode={modal.mode}
          onClose={() => setModal({ mode: "closed" })}
          onSaved={handleDataSheetCreated}
          allProducts={productsResponse.data}
        />
      )}
      {/* -------------- Update tech data sheets -------------- */}
      {modal.mode === "edit" && productsResponse.status === "success" && (
        <TechDataSheetModal
          key={modal.dataSheet.id}
          mode={modal.mode}
          onClose={() => setModal({ mode: "closed" })}
          onSaved={handleDataSheetUpdated}
          dataSheet={modal.dataSheet}
          allProducts={productsResponse.data}
        />
      )}
    </div>
  );
};
