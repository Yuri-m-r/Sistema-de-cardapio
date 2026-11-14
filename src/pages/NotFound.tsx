import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404 - Página não encontrada</h1>

      <Link to="/" className="not-found__button">
        Voltar para a página inicial
      </Link>
    </div>
  );
};
