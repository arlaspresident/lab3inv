import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { apiFetch } from "../api/client";
import type { Product } from "../types/product";
import { useAuth } from "../auth/AuthContext";

type ProductCreate = {
  name: string;
  description?: string;
  quantity: number;
  price: number;
};

export default function Admin() {
  useAuth();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(0); 
  const [price, setPrice] = useState<number>(0);

  const [editingId, setEditingId] = useState<number | null>(null);
  const editingItem = useMemo(
    () => items.find((x) => x.id === editingId) ?? null,
    [items, editingId]
  );

  async function load() {
    setError(null);
    setMsg(null);
    setLoading(true);
    try {
      const data = await apiFetch<Product[]>("/products");
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    try {
      const payload: ProductCreate = {
        name,
        description: description.trim() ? description.trim() : undefined,
        quantity: Number(quantity),
        price: Number(price),
      };

      const created = await apiFetch<Product>("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setItems((prev) => [created, ...prev]);
      setName("");
      setDescription("");
      setQuantity(0);
      setPrice(0);
      setMsg("Produkten skapades.");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onDelete = async (id: number) => {
    setError(null);
    setMsg(null);
    try {
      await apiFetch<void>(`/products/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== id));
      if (editingId === id) setEditingId(null);
      setMsg("Produkten togs bort.");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onUpdateQuantity = async (id: number, newQty: number) => {
    setError(null);
    setMsg(null);
    try {
      const updated = await apiFetch<Product>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity: newQty }),
      });
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
      setMsg("Antalet uppdaterades.");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Administration</h1>
        <button className="button secondary" onClick={load}>Uppdatera lista</button>
      </div>

      {loading && <p>Laddar…</p>}
      {error && (
        <div className="notice error">
          <strong>Fel:</strong> {error}
        </div>
      )}
      {msg && <div className="notice success">{msg}</div>}

      <div className="admin-grid" style={{ marginTop: 16 }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Skapa produkt</h2>

          
            <form onSubmit={onCreate} style={{ display: "grid", gap: 12 }}>
              <input
                placeholder="Produktnamn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                placeholder="Beskrivning (valfri)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                placeholder="Antal"
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />

              <input
                placeholder="Pris"
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />

              <button type="submit">Skapa produkt</button>
            </form>
          </div>

          {editingItem && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <h3 style={{ marginTop: 0 }}>Vald produkt</h3>
                <button className="button secondary" onClick={() => setEditingId(null)}>
                  Stäng
                </button>
              </div>

              <p><strong>ID:</strong> {editingItem.id}</p>
              <p><strong>Namn:</strong> {editingItem.name}</p>
              <p><strong>Beskrivning:</strong> {editingItem.description ?? "Ingen beskrivning"}</p>
              <p><strong>Antal:</strong> {editingItem.quantity}</p>
              <p><strong>Pris:</strong> {editingItem.price} kr</p>
            </div>
          )}
        </div>

    
        <div className="card">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ marginTop: 0 }}>Produkter</h2>
            <span className="badge">{items.length} st</span>
          </div>

          {items.length === 0 && !loading && !error && <p>Inga produkter hittades.</p>}

          <div style={{ display: "grid", gap: 12 }}>
            {items.map((p) => (
              <div key={p.id} className="admin-item">
                <div className="admin-item-title">
                  <strong>{p.name}</strong>
                  <span style={{ color: "var(--muted)" }}>
                    antal {p.quantity} • pris {p.price} kr
                  </span>
                </div>

                <div className="admin-actions">
                  <button className="button secondary" onClick={() => setEditingId(p.id)}>
                    Visa detaljer
                  </button>

                  <button className="button danger" onClick={() => onDelete(p.id)}>
                    Ta bort
                  </button>

                  <button className="button secondary" onClick={() => onUpdateQuantity(p.id, p.quantity + 1)}>
                    Öka antal
                  </button>

                  <button
                    className="button secondary"
                    onClick={() => onUpdateQuantity(p.id, Math.max(0, p.quantity - 1))}
                  >
                    Minska antal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
