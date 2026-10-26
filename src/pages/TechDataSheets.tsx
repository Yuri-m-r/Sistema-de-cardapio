import type { RequestState } from "../types/sharedTypes";
import { useState, useEffect } from "react";
import {
  searchDataSheets,
  deleteTechDataSheet,
  deleteDataSheetItems,
} from "../api/techDataSheetApi";
import { searchProducts } from "../api/productsApi";

import type {
  TechDataSheet,
  TechDataSheetModalState,
} from "../types/techDataSheetsType";
import type { Product } from "../types/productType";

import { TechDataSheetsViewModal } from "../components/TechDataSheetViewModal";
import { TechDataSheetsModal } from "../components/TechDataSheetModal";

export const TechDataSheets = () => {
  const [response, setResponse] = useState<RequestState<TechDataSheet[]>>({
    status: "loading",
  });
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [modal, setModal] = useState<TechDataSheetModalState>({
    mode: "closed",
  });
  const [productsResponse, setProductsResponse] = useState<
    RequestState<Product[]>
  >({
    status: "loading",
  });
  // ------------- Show tech data sheets -------------
  useEffect(() => {
    setResponse({ status: "loading" });
    let ignore = false;
    const timer = setTimeout(() => {
      const fetchTechnicalDataSheets = async () => {
        try {
          const data = await searchDataSheets(search);
          if (ignore) return;
          setResponse({ status: "success", data });
        } catch (error) {
          if (ignore) return;
          setResponse({
            status: "error",
            error: "Erro ao buscar fichas técnicas",
          });
          console.error(error);
        }
      };
      fetchTechnicalDataSheets();
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    let ignore = false;

    const loadProducts = async () => {
      try {
        const data = await searchProducts();

        if (ignore) return;

        setProductsResponse({
          status: "success",
          data,
        });
      } catch (error) {
        if (ignore) return;

        console.error(error);

        setProductsResponse({
          status: "error",
          error: "Erro ao carregar produtos.",
        });
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  // ------------- Delete tech data sheets -------------
  const handleDelete = async (id: string) => {
    if (response.status !== "success") return;
    const item = response.data.find((dataSheet) => dataSheet.id === id);

    if (!item) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o item ${item.name}?`,
    );

    if (!confirmed) return;
    setDeleteError(null);
    setDeletingId(id);

    try {
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
      setDeleteError("Erro ao excluir a ficha técnica");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  // ------------- Create tech data sheets -------------
  const handleDataSheetCreate = (newDataSheet: TechDataSheet) => {
    setResponse((prev) => {
      if (prev.status === "success") {
        return {
          data: [...prev.data, newDataSheet],
          status: "success",
        };
      }
      return prev;
    });
    setSearch("");
  };

  // ------------- Update tech data sheets -------------
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
    if (response.status === "loading") return "Buscando...";
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
          onChange={(e) => setSearch(e.target.value)}
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
                  {techDataSheet.yield.toFixed(2)} {techDataSheet.yieldUnity}
                </p>
                <p className="card__label">Tempo de preparo</p>
                <p className="card__value">{techDataSheet.prepTime} minutos</p>
              </div>

              <div className="card__actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  aria-label={`Visualizar ${techDataSheet.name}`}
                  disabled={
                    deletingId === techDataSheet.id ||
                    productsResponse.status !== "success"
                  }
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
                  disabled={
                    deletingId === techDataSheet.id ||
                    productsResponse.status !== "success"
                  }
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
                  disabled={deletingId === techDataSheet.id}
                  onClick={() => {
                    handleDelete(techDataSheet.id);
                  }}
                >
                  {deletingId === techDataSheet.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal.mode === "view" && productsResponse.status === "success" && (
        <TechDataSheetsViewModal
          key={modal.dataSheet.id}
          onClose={() => setModal({ mode: "closed" })}
          dataSheet={modal.dataSheet}
          products={productsResponse.data}
        />
      )}

      {modal.mode === "create" && productsResponse.status === "success" && (
        <TechDataSheetsModal
          mode={modal.mode}
          onClose={() => setModal({ mode: "closed" })}
          onSaved={handleDataSheetCreate}
          allProducts={productsResponse.data}
        />
      )}

      {modal.mode === "edit" && productsResponse.status === "success" && (
        <TechDataSheetsModal
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
