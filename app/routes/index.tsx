import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ paddingTop: 12 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Bienvenido al Gestor de productos de Fifty</h2>
        <p className="muted">Administra tus productos con esta interfaz.</p>
        <div style={{ marginTop: 12 }}>
          <Link to="/products" className="btn">Ir a Productos</Link>
        </div>
      </div>
    </div>
  );
}
