import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      nav("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h1>Logga in</h1>

      <form onSubmit={onSubmit}>
        <label>
          Användarnamn
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: 8 }}
          />
        </label>

        <label>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: 8 }}
          />
        </label>

        {error && <p style={{ color: "crimson" }}>Fel: {error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Loggar in…" : "Logga in"}
        </button>
      </form>
    </div>
  );
}
