import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="hero">
      <div className="badge">
        {isLoggedIn ? "Inloggad" : "Inte inloggad"} • Lagerhantering (SPA)
      </div>

      <h1>Lagerhantering</h1>
      <p>
        En enkel single page application där du kan bläddra bland produkter publikt och som
        inloggad admin kan du skapa, uppdatera och ta bort produkter.
      </p>

      <div className="actions">
        <Link className="button" to="/products">
          Visa produkter
        </Link>

        {isLoggedIn ? (
          <Link className="button secondary" to="/admin">
            Gå till administration
          </Link>
        ) : (
          <Link className="button secondary" to="/login">
            Logga in för administration
          </Link>
        )}
      </div>

      <div className="kpi">
        <div className="card">
          <p className="kpiTitle">Publikt</p>
          <p className="kpiValue">Produktlista & detaljer</p>
        </div>
        <div className="card">
          <p className="kpiTitle">Skyddat</p>
          <p className="kpiValue">Admin CRUD</p>
        </div>
        <div className="card">
          <p className="kpiTitle">Teknik</p>
          <p className="kpiValue">React • TS • JWT</p>
        </div>
      </div>
    </div>
  );
}
