// ------------- Import react -------------
import { useCallback, useState } from "react";
//------------- Import types -------------
import type { Menu, MenuModalState } from "../types/menuType";
// ------------- Import api -------------
import { searchMenus, deleteMenu, deleteMenuItems } from "../api/menuApi";
//------------- Import components -------------
import { MenuModal } from "../components/MenuModal";
import { MenuViewModal } from "../components/MenuViewModal";
//------------- Import hooks -------------
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { useSearchQuery } from "../hooks/useSearchQuery";

export const Menus = () => {
  // ------------- State -------------
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [modal, setModal] = useState<MenuModalState>({
    mode: "closed",
  });
  const { search, handleSearchChange, clearSearch } = useSearchQuery();
  const debouncedSearch = useDebounce(search, 300);

  // ------------- Show menus -------------
  const fetchMenus = useCallback(() => {
    return searchMenus(debouncedSearch);
  }, [debouncedSearch]);

  const { response, setResponse, isFetching } = useFetch({
    fetcher: fetchMenus,
    errorMessage: "Erro ao buscar cardápios",
    keepPreviousData: true,
  });

  // ------------- Handle deleted menus -------------
  const handleDeleted = async (id: string) => {
    if (response.status !== "success") return;

    const menu = response.data.find((menu) => menu.id === id);

    if (!menu) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o cardápio ${menu.name}?`,
    );

    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(id);

    try {
      await deleteMenuItems(id);
      await deleteMenu(id);
      setResponse((prev) => {
        if (prev.status === "success") {
          return {
            data: prev.data.filter((menu) => menu.id !== id),
            status: "success",
          };
        }
        return prev;
      });
    } catch (error) {
      console.error(error);
      setDeleteError("Erro ao excluir o cardápio");
    } finally {
      setDeletingId(null);
    }
  };

  // ------------- Handle created menu -------------

  const handleMenuCreated = (newMenu: Menu) => {
    setResponse((prev) => {
      if (prev.status === "success") {
        return {
          data: [...prev.data, newMenu],
          status: "success",
        };
      }
      return prev;
    });
    clearSearch();
  };

  // ------------- Handle update menu -------------
  const handleMenuUpdated = (editedMenu: Menu) => {
    setResponse((prev) => {
      if (prev.status === "success") {
        return {
          data: prev.data.map((menu) =>
            menu.id === editedMenu.id ? editedMenu : menu,
          ),
          status: "success",
        };
      }
      return prev;
    });
  };

  // ------------- Show status messages -------------
  const getStatusMessage = () => {
    if (isFetching) return "Buscando...";
    if (response.status === "success" && response.data.length > 0)
      return `Total de cardápios encontrados: ${response.data.length}`;
    return null;
  };

  // ------------- Render-------------
  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Cardápios</h1>
          <p className="page__subtitle">
            Monte cardápios com suas fichas técnicas e gere suas requisições.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() =>
            setModal({
              mode: "create",
            })
          }
        >
          Cadastrar cardápio
        </button>
      </header>
      <div className="field search">
        <label htmlFor="search" className="label">
          Buscar cardápios
        </label>
        <input
          type="text"
          id="search"
          className="input"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Digite o nome do cardápio"
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
        <p className="empty-state">Nenhum cardápio encontrado.</p>
      )}
      {/* -------------- Status messages -------------- */}

      {response.status === "success" && response.data.length > 0 && (
        <ul className="card-grid">
          {response.data.map((menu) => (
            <li key={menu.id} className="card">
              <div className="card__body">
                <div className="card__header">
                  <h2 className="card__title">{menu.name}</h2>
                  <span className="badge">{menu.weekDay}</span>
                </div>
              </div>

              <div className="card__actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  aria-label={`Visualizar ${menu.name}`}
                  disabled={deletingId === menu.id}
                  onClick={() =>
                    setModal({
                      mode: "view",
                      menu,
                    })
                  }
                >
                  Visualizar
                </button>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  aria-label={`Editar ${menu.name}`}
                  disabled={deletingId === menu.id}
                  onClick={() => {
                    setModal({ mode: "edit", menu });
                  }}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn--danger btn--sm"
                  aria-label={`Excluir ${menu.name}`}
                  onClick={() => handleDeleted(menu.id)}
                  disabled={deletingId !== null}
                >
                  {deletingId === menu.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* -------------- View menu -------------- */}

      {modal.mode === "view" && (
        <MenuViewModal
          key={modal.menu.id}
          onClose={() => setModal({ mode: "closed" })}
          menu={modal.menu}
        />
      )}
      {/* -------------- Create menu -------------- */}

      {modal.mode === "create" && (
        <MenuModal
          mode={modal.mode}
          onClose={() => setModal({ mode: "closed" })}
          onSaved={handleMenuCreated}
        />
      )}
      {/* -------------- Update menu -------------- */}

      {modal.mode === "edit" && (
        <MenuModal
          mode={modal.mode}
          onClose={() => setModal({ mode: "closed" })}
          onSaved={handleMenuUpdated}
          menu={modal.menu}
        />
      )}
    </div>
  );
};
