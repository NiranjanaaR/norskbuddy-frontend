import React, { useState } from "react";
import {
  login,
  signup,
  resetPassword,
} from "../firebase/authService";

export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // kept for future use
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Fyll inn alle feltene.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(email, password);
        setMessage("Konto opprettet ✅ Du er nå logget inn.");
      } else {
        await login(email, password);
      }
      // ✅ Firebase will auto update auth state
    } catch (err) {
      setError(firebaseErrorToNorwegian(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError("Skriv inn e-post for å tilbakestille passord.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage("Tilbakestillingslink sendt på e-post ✅");
    } catch (err) {
      setError(firebaseErrorToNorwegian(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* LEFT INFORMATION PANEL */}
      <div className="auth-left">
        <div>
          <div className="auth-eyebrow">Norsk Speaking Buddy</div>

          <h1 className="auth-title">
            PracticeWithMe <span style={{ fontSize: "1.2rem" }}>🇳🇴</span>
          </h1>

          <p className="auth-subtitle">
            Øv ekte samtaler på norsk: butikk, jobbintervju, eksamen – med en
            trygg AI-venn som forklarer når du står fast.
          </p>
        </div>

        <div className="auth-feature-list">
          <Feature text="Velg scenario: butikk, NAV, jobbintervju, osv." />
          <Feature text="Snakk eller skriv – AI svarer på norsk." />
          <Feature text="Be om forklaring på engelsk ved behov." />
          <Feature text="Se tidligere samtaler før du går ut." />
        </div>

        <div className="auth-footer-text">
          Bygget for norskkurs, velkomstsentre og alle som vil øve hver dag.
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="auth-right">
        <div className="auth-card">
          {/* SWITCH TABS */}
          <div className="auth-tabs">
            <TabButton
              label="Logg inn"
              mode={mode}
              setMode={setMode}
              target="login"
            />
            <TabButton
              label="Ny bruker"
              mode={mode}
              setMode={setMode}
              target="signup"
            />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <Field
                label="Navn"
                value={name}
                onChange={setName}
                placeholder="Fornavn eller kallenavn"
              />
            )}

            <Field
              label="E-post"
              value={email}
              onChange={setEmail}
              placeholder="deg@example.com"
              type="email"
            />

            <Field
              label="Passord"
              value={password}
              onChange={setPassword}
              placeholder="Minimum 6 tegn"
              type="password"
            />

            {error && <div className="auth-error">{error}</div>}
            {message && (
              <div style={{ fontSize: "0.8rem", color: "green" }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading
                ? "Laster..."
                : mode === "login"
                ? "Logg inn"
                : "Opprett konto"}
            </button>
          </form>

          {mode === "login" && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                marginTop: 10,
                border: "none",
                background: "none",
                fontSize: "0.8rem",
                color: "var(--primary)",
                cursor: "pointer",
              }}
            >
              Glemt passord?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function firebaseErrorToNorwegian(code) {
  switch (code) {
    case "auth/user-not-found":
      return "Ingen bruker med denne e-posten.";
    case "auth/wrong-password":
      return "Feil passord.";
    case "auth/email-already-in-use":
      return "E-post er allerede i bruk.";
    case "auth/weak-password":
      return "Passord må være minst 6 tegn.";
    case "auth/invalid-email":
      return "Ugyldig e-postadresse.";
    default:
      return "Noe gikk galt. Prøv igjen.";
  }
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          marginBottom: 4,
          fontSize: "0.8rem",
          color: "var(--muted)",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: "999px",
          border: "1px solid var(--border-soft)",
          backgroundColor: "var(--surface-alt)",
          color: "var(--text)",
          fontSize: "0.88rem",
          outline: "none",
        }}
      />
    </div>
  );
}

function TabButton({ label, mode, setMode, target }) {
  const active = mode === target;
  return (
    <button
      type="button"
      onClick={() => setMode(target)}
      className={`auth-tab-btn ${active ? "auth-tab-btn--active" : ""}`}
    >
      {label}
    </button>
  );
}

function Feature({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "999px",
          backgroundColor: "var(--primary-soft)",
          border: "1px solid var(--primary)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.7rem",
          color: "var(--primary)",
        }}
      >
        ✓
      </span>
      <span>{text}</span>
    </div>
  );
}
