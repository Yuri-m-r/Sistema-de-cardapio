import { NavLink } from "react-router-dom";
import { navLinks } from "../constants/navLinks";

const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link--active" : "nav-link";

const NavPages = () => {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <NavLink to="/" end className="brand">
          Sistema Restaurante
        </NavLink>

        <nav aria-label="Navegação principal" className="nav-list">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={getLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default NavPages;
