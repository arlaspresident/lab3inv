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
    <div style={{ padding: 16 }}>
      <h1>Produkter</h1>

      {loading && <p>Laddar…</p>}
      {error && <p style={{ color: "crimson" }}>Fel: {error}</p>}

      {!loading && !error && items.length === 0 && (
        <p>Inga produkter hittades</p>
      )}

      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link> — antal {p.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
