import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import type { Product } from "../types/product";

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Product[]>("/products")
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Produkter</h1>
          <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
            Klicka på en produkt för att se detaljer.
          </p>
        </div>
        <span className="badge">{items.length} st</span>
      </div>

      {loading && <p>Laddar…</p>}
      {error && <p className="error">Fel: {error}</p>}
      {!loading && !error && items.length === 0 && <p>Inga produkter hittades.</p>}

      <div className="grid">
        {items.map((p) => (
          <div key={p.id} className="productCard">
            <h3>{p.name}</h3>

            <div className="productMeta">
              <span>Antal: {p.quantity}</span>
              <span>Pris: {p.price} kr</span>
            </div>

            <Link className="button secondary" to={`/products/${p.id}`}>
              Visa detaljer
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
