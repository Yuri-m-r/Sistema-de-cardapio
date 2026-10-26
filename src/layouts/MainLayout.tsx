import { Outlet } from "react-router-dom";
import NavPages from "../components/NavPages";

export const MainLayout = () => {
  return (
    <div className="app-shell">
      <NavPages />
      <main id="conteudo" className="app-main">
        <Outlet />
      </main>
    </div>
  );
};
