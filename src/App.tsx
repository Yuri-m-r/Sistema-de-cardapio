import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Menus } from "./pages/Menus";
import { Products } from "./pages/Products";
import { TechDataSheets } from "./pages/TechDataSheets";
import { MainLayout } from "./layouts/MainLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<MainLayout />}>
          <Route path="/menus" element={<Menus />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/technical-data-sheets"
            element={<TechDataSheets />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
