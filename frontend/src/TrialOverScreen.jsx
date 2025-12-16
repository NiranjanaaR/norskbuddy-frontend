import React from "react";

export default function TrialOverScreen({ session, onBackToDemo, onGoToPayment }) {
  return (
    <div
      className="main-root"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #fef9f4 0, #f4ece4 40%, #ebe2da 100%)",
      }}
    >
      {/* HEADER (same style as MainScreen) */}
      <header className="main-header">
        <div>
          <div className="main-app-name">PracticeWithMe 🇳🇴</div>
          <div className="main-user">
            Hei, <strong>{session?.name || session?.email}</strong>
          </div>
        </div>

        <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
          Gratis prøveversjon 🌱
        </div>
      </header>

      {/* BODY */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            borderRadius: 24,
            border: "1px solid var(--border-soft)",
            backgroundColor: "rgba(255,255,255,0.95)",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            padding: "20px 22px 18px",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Gratidagen er brukt 🌱
          </div>

          <div
            style={{
              fontSize: "0.86rem",
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            Du har brukt opp din gratis prøvedag med 30 minutter norsktrening.  
            Håper økten var nyttig for deg 💛
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: 16,
              background:
                "linear-gradient(135deg, rgba(221,214,254,0.9), rgba(191,219,254,0.95))",
              border: "1px solid rgba(148,163,184,0.5)",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Videre bruk (plan)
            </div>
            <div
              style={{
                fontSize: "0.82rem",
                color: "#111827",
              }}
            >
              Planen er å tilby videre bruk for ca.{" "}
              <strong>3 kr per dag</strong> (
              <strong>90 kr per måned</strong>) for daglig norskpraksis med en
              AI-venn.
            </div>
          </div>

          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            Dette er foreløpig bare en demo-versjon. Betaling og Vipps-løsning
            blir lagt til etter hvert.
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onBackToDemo}
              style={{
                borderRadius: 999,
                border: "1px solid var(--border-soft)",
                padding: "6px 12px",
                backgroundColor: "#ffffff",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Tilbake til demo
            </button>

            <button
              type="button"
              onClick={onGoToPayment}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "6px 12px",
                backgroundColor: "var(--primary)",
                color: "#f9fafb",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Se betalingsside
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
