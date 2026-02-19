import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div>
      <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd", flexWrap: "wrap" }}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {!isLoggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <Link to="/admin">Admin</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
