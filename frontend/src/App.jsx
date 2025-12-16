// src/App.jsx
import React from "react";
import AuthScreen from "./components/AuthScreen.jsx";
import MainScreen from "./components/MainScreen.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import "./styles.css";


export default function App() {
  const { user, loading, logout } = useAuth();

  // While Firebase is figuring out the current user
  if (loading) {
    return (
      <div className="app-root">
        <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Laster ...</div>
        </div>
      </div>
    );
  }

  // Not logged in → show login / signup screen
  if (!user) {
    return (
      <div className="app-root">
        <div className="app-shell">
          <AuthScreen />
        </div>
      </div>
    );
  }

  // Logged in but e-mail not verified yet
  if (!user.emailVerified) {
    return (
      <div className="app-root">
        <div className="app-shell" style={{ padding: 24 }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={logout}
              style={{
                borderRadius: 999,
                border: "1px solid var(--border-soft)",
                padding: "6px 12px",
                backgroundColor: "var(--surface-alt)",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Logg ut
            </button>
          </div>

          <h2>Bekreft e-posten din</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
            Vi har sendt en bekreftelseslenke til <strong>{user.email}</strong>.
            <br />
            Klikk på lenken i e-posten for å verifisere kontoen din, og logg inn på nytt etterpå.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Verified user → show main app
  return (
    <div className="app-root">
      <div className="app-shell">
        <MainScreen session={user} onLogout={logout} />
      </div>
    </div>
  );
}

