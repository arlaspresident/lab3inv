import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Lagerhantering</h1>

      <p>
        Public produktlista och skyddad admin      
        </p>

      <Link to="/products">Visa produkter</Link>
    </div>
  );
}
