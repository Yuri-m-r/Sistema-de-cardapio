// ------------- Import react -------------
import { useState, useCallback } from "react";
// ------------- Import api -------------
import {
  deleteProduct,
  isProductInUse,
  searchProducts,
} from "../api/productApi";
// ------------- Import types -------------
import type { Product, ProductModalState } from "../types/productType";
// ------------- Import components -------------
import { ProductModal } from "../components/ProductModal";
// ------------- Import hooks -------------
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { useSearchQuery } from "../hooks/useSearchQuery";
//------------- Import errors / utils -------------
import { InUseError } from "../errors/InUseError";
import { formatCurrency } from "../utils/formatCurrency";

export const Products = () => {
  // ------------- State -------------
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ProductModalState>({ mode: "closed" });
  const { search, handleSearchChange, clearSearch } = useSearchQuery();
  const debouncedSearch = useDebounce(search, 300);

  // ------------- Show products -------------
  const fetchProducts = useCallback(() => {
    return searchProducts(debouncedSearch);
  }, [debouncedSearch]);

  const { response, setResponse, isFetching } = useFetch({
    fetcher: fetchProducts,
    errorMessage: "Erro ao buscar produtos",
    keepPreviousData: true,
  });
  // ------------- Handle deleted products -------------
  const handleDeleted = async (id: string) => {
    if (response.status !== "success") return;

    const item = response.data.find((product) => product.id === id);

    if (!item) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o produto ${item.name}?`,
    );

    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(id);

    try {
      const usedProduct = await isProductInUse(id);

      if (usedProduct) {
        throw new InUseError(
          "O produto está sendo usado por uma ficha técnica e não pode ser excluído",
        );
      }

      await deleteProduct(id);
      setResponse((prev) => {
        if (prev.status === "success") {
          return {
            data: prev.data.filter((product) => product.id !== id),
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
        setDeleteError("Erro ao excluir produto");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ------------- Show status messages -------------
  const getStatusMessage = () => {
    if (isFetching) return "Buscando...";
    if (response.status === "success" && response.data.length > 0)
      return `Total de produtos encontrados: ${response.data.length}`;
    return null;
  };

  // ------------- Handle created product -------------
  const handleProductCreated = (newProduct: Product) => {
    setResponse((prev) => {
      if (prev.status === "success") {
        return {
          data: [...prev.data, newProduct],
          status: "success",
        };
      }
      return prev;
    });
    clearSearch();
  };

  // ------------- Handle updated products -------------
  const handleProductUpdated = (updatedProduct: Product) => {
    setResponse((prev) => {
      if (prev.status === "success") {
        return {
          data: prev.data.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product,
          ),
          status: "success",
        };
      }
      return prev;
    });
  };

  // ------------- Render -------------
  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Produtos</h1>
          <p className="page__subtitle">
            Cadastre os insumos usados nas fichas técnicas.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setModal({ mode: "create" })}
        >
          Cadastrar novo produto
        </button>
      </header>

      <div className="field search">
        <label htmlFor="search" className="label">
          Buscar produtos
        </label>
        <input
          type="text"
          id="search"
          className="input"
          value={search}
          onChange={(e) => {
            handleSearchChange(e.target.value);
            setDeleteError(null);
          }}
          placeholder="Digite o nome do produto ou categoria"
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

      {deleteError && (
        <p role="alert" className="alert alert--error">
          {deleteError}
        </p>
      )}

      {response.status === "success" && response.data.length === 0 && (
        <p className="empty-state">Nenhum produto encontrado.</p>
      )}
      {/* -------------- Status messages -------------- */}

      {response.status === "success" && response.data.length > 0 && (
        <ul className="card-grid">
          {response.data.map((product) => (
            <li key={product.id} className="card">
              <div className="card__body">
                <div className="card__header">
                  <div className="card__title-group">
                    <h2 className="card__title">{product.name}</h2>
                    <span className="badge">{product.unit}</span>
                  </div>
                  <span className="badge badge--accent">
                    {product.category}
                  </span>
                </div>
                <p className="card__label">Custo</p>
                <p className="card__price">{formatCurrency(product.cost)}</p>
              </div>

              <div className="card__actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  disabled={deletingId === product.id}
                  aria-label={`Editar ${product.name}`}
                  onClick={() => {
                    setModal({ mode: "edit", product });
                  }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn--danger btn--sm"
                  aria-label={`Excluir ${product.name}`}
                  onClick={() => handleDeleted(product.id)}
                  disabled={deletingId !== null}
                >
                  {deletingId === product.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* -------------- Create product -------------- */}

      {modal.mode === "create" && (
        <ProductModal
          mode={modal.mode}
          onSaved={handleProductCreated}
          onClose={() => {
            setModal({ mode: "closed" });
          }}
        />
      )}
      {/* -------------- Update product -------------- */}

      {modal.mode === "edit" && (
        <ProductModal
          key={modal.product.id}
          mode={modal.mode}
          product={modal.product}
          onSaved={handleProductUpdated}
          onClose={() => {
            setModal({ mode: "closed" });
          }}
        />
      )}
    </div>
  );
};
