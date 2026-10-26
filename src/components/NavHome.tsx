import { Link } from "react-router-dom";
import { navLinks } from "../constants/navLinks";

export const NavHome = () => {
  return (
    <section className="home">
      <div className="home__card">
        <h1 className="home__title">Sistema Restaurante</h1>
        <p className="home__subtitle">Escolha uma área para começar</p>

        <nav aria-label="Menu principal" className="home__nav">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="home__link">
              {link.label}
              <span aria-hidden="true" className="home__arrow">
                →
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};
