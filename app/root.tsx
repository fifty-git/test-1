import type { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLocation, useNavigate, Link } from "@remix-run/react";
import tailwindStyles from "~/styles/tailwind.css";
import globalStyles from "~/styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: globalStyles },
];

export const meta = () => ({ title: "Products CRUD" });

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-gray-50 text-slate-900">
        <div className="container">
          <Shell />
          <main style={{ marginTop: 16 }}>
            <Outlet />
          </main>
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Shell() {
  const navigate = useNavigate();
  const location = useLocation();

  const showBack = location.pathname !== "/";

  return (
    <header className="app-header">
      <div>
        <Link to="/" className="app-title" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div className="logo-dot" aria-hidden />
          <div>
            <div style={{ fontWeight: 800, color: "var(--pink-700)" }}>Fifty</div>
            <div className="muted" style={{ fontSize: 12 }}>Productos</div>
          </div>
        </Link>
      </div>

      <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Link to="/" className="btn-ghost">Inicio</Link>
        <Link to="/products" className="btn-secondary">Productos</Link>
        {showBack ? (
          <button onClick={() => navigate(-1)} className="back-button">
            ← Regresar
          </button>
        ) : null}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="app-footer" style={{ marginTop: 24, padding: "1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="muted">© {new Date().getFullYear()} Fifty</div>
        <div className="muted">CRUD test</div>
      </div>
    </footer>
  );
}
