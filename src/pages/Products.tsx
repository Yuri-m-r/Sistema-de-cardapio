import { useState, useEffect } from "react";
import { deleteProduct, searchProducts } from "../api/productsApi";

import { getDataSheetItems } from "../api/techDataSheetApi";
import { ProductModal } from "../components/ProductModal";
import type { Product, ProductModalState } from "../types/productType";

import type { RequestState } from "../types/sharedTypes";

export const Products = () => {
  const [search, setSearch] = useState("");
  const [response, setResponse] = useState<RequestState<Product[]>>({
    status: "loading",
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ProductModalState>({ mode: "closed" });

  // ------------- Show products -------------
  useEffect(() => {
    setResponse({ status: "loading" });
    setDeleteError(null);

    let ignore = false;

    const timer = setTimeout(() => {
      const fetchProducts = async () => {
        try {
          const products = await searchProducts(search);

          if (ignore) return;

          setResponse({ status: "success", data: products });
        } catch (error) {
          if (ignore) return;

          console.error(error);
          setResponse({
            status: "error",
            error: "Erro ao buscar produtos",
          });
        }
      };

      fetchProducts();
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search]);

  // ------------- Delete products -------------
  const handleDelete = async (id: string) => {
    if (response.status !== "success") return;

    const item = response.data.find((product) => product.id === id);

    if (!item) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o item ${item.name}?`,
    );

    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(id);

    try {
      const itemsDetails = await getDataSheetItems();
      const usedProduct = itemsDetails.find((item) => item.productId === id);

      if (usedProduct) {
        throw new Error("O produto esta sendo usado por uma ficha tecnica");
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
      if (error instanceof Error) {
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
    if (response.status === "loading") return "Buscando...";
    if (response.status === "success" && response.data.length > 0)
      return `Total de produtos encontrados: ${response.data.length}`;
    return null;
  };

  // ------------- Handle new product -------------
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
    setSearch("");
  };

  // ------------- Handle edit products -------------
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
          onChange={(e) => setSearch(e.target.value)}
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
                  <div className="flex">
                    <h2 className="card__title">{product.name}</h2>
                    <span className="badge">{product.unit}</span>
                  </div>
                  <span className="badge badge--accent">
                    {product.category}
                  </span>
                </div>
                <p className="card__label">Custo</p>
                <p className="card__price">
                  {product.cost.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>

              <div className="card__actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
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
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal.mode === "create" && (
        <ProductModal
          mode={modal.mode}
          onSaved={handleProductCreated}
          onClose={() => {
            setModal({ mode: "closed" });
          }}
        />
      )}

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
