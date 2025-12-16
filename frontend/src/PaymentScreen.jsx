import React from "react";

export default function PaymentScreen({ session, onBack }) {
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
      {/* HEADER */}
      <header className="main-header">
        <div>
          <div className="main-app-name">PracticeWithMe 🇳🇴</div>
          <div className="main-user">
            Hei, <strong>{session?.name || session?.email}</strong>
          </div>
        </div>

        <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
          Betaling (demo)
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
            maxWidth: 460,
            width: "100%",
            borderRadius: 24,
            border: "1px solid var(--border-soft)",
            backgroundColor: "rgba(255,255,255,0.95)",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            padding: "20px 24px 18px",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Betaling kommer snart 💳
          </div>

          <div
            style={{
              fontSize: "0.86rem",
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            Planen er å tilby videre bruk av PracticeWithMe for{" "}
            <strong>ca. 3 kr dagen</strong> (
            <strong>90 kr per måned</strong>).
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: 16,
              background:
                "linear-gradient(135deg, rgba(209,250,229,0.9), rgba(191,219,254,0.95))",
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
              Hvordan det sannsynligvis vil fungere
            </div>
            <ul
              style={{
                paddingLeft: 16,
                margin: 0,
                fontSize: "0.82rem",
                color: "#111827",
              }}
            >
              <li>Betaling via Vipps eller kort.</li>
              <li>Abonnement per måned (kan sies opp når som helst).</li>
              <li>Full tilgang til daglige økter med AI-norskvenn.</li>
            </ul>
          </div>

          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            Under demo-fasen er ikke betaling aktiv ennå. Denne siden er bare
            for å vise hvordan det kan se ut senere.
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: 16,
              backgroundColor: "#f9fafb",
              border: "1px dashed var(--border-soft)",
              marginBottom: 16,
              fontSize: "0.8rem",
              color: "var(--muted)",
            }}
          >
            Her kan du senere legge inn mer konkret informasjon om Vipps-nummer,
            pris, vilkår osv. når du er klar til å ta imot betaling.
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={onBack}
              style={{
                borderRadius: 999,
                border: "1px solid var(--border-soft)",
                padding: "6px 12px",
                backgroundColor: "#ffffff",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Tilbake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
