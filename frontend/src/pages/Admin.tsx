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
    const { logout } = useAuth();

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
        <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <h1 style={{ margin: 0 }}>Administration</h1>
                <button onClick={logout}>Logga ut</button>
                <button onClick={load}>Uppdatera lista</button>
            </div>

            {loading && <p>Laddar…</p>}
            {error && <p style={{ color: "crimson" }}>Fel: {error}</p>}
            {msg && <p>{msg}</p>}

            <h2>Skapa produkt</h2>

            <form onSubmit={onCreate} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
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

            <h2 style={{ marginTop: 24 }}>Produkter</h2>

            <ul style={{ paddingLeft: 18 }}>
                {items.map((p) => (
                    <li key={p.id} style={{ marginBottom: 10 }}>
                        <strong>{p.name}</strong> — antal {p.quantity} — pris {p.price} kr

                        <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                            <button onClick={() => setEditingId(p.id)}>
                                Visa detaljer
                            </button>

                            <button onClick={() => onDelete(p.id)}>
                                Ta bort
                            </button>

                            <button onClick={() => onUpdateQuantity(p.id, p.quantity + 1)}>
                                Öka antal
                            </button>

                            <button onClick={() => onUpdateQuantity(p.id, Math.max(0, p.quantity - 1))}>
                                Minska antal
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {editingItem && (
                <div style={{
                    marginTop: 20,
                    padding: 12,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    maxWidth: 520
                }}>
                    <h3 style={{ marginTop: 0 }}>Vald produkt</h3>

                    <p><strong>ID:</strong> {editingItem.id}</p>

                    <p><strong>Namn:</strong> {editingItem.name}</p>

                    <p>
                        <strong>Beskrivning:</strong>{" "}
                        {editingItem.description ?? "Ingen beskrivning"}
                    </p>

                    <p><strong>Antal:</strong> {editingItem.quantity}</p>

                    <p><strong>Pris:</strong> {editingItem.price} kr</p>

                    <button onClick={() => setEditingId(null)}>
                        Stäng
                    </button>
                </div>
            )}
        </div>
    );
}
