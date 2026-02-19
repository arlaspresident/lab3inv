import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import type { Product } from "../types/product";

export default function ProductDetails() {
  const { id } = useParams();
  const [item, setItem] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Product>(`/products/${id}`)
      .then(setItem)
      .catch((e) => setError(e.message));
  }, [id]);

  return (
    <div style={{ padding: 16 }}>
      <Link to="/products">Tillbaka till produkter</Link>

      {error && <p style={{ color: "crimson" }}>Fel: {error}</p>}
      {!error && !item && <p>Laddar…</p>}

      {item && (
        <>
          <h1>{item.name}</h1>

          <p>
            <strong>Beskrivning:</strong>{" "}
            {item.description ?? "Ingen beskrivning"}
          </p>

          <p>
            <strong>Antal:</strong> {item.quantity}
          </p>

          <p>
            <strong>Pris:</strong> {item.price} kr
          </p>
        </>
      )}
    </div>
  );
}
