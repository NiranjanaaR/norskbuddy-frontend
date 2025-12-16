import React from "react";

export default function WelcomeScreen({ onSelectTopic }) {
  const suggestions = [
    "Jobbintervju",
    "Butikk: handle dagligvarer",
    "På restaurant",
    "Hos legen",
    "Reise og transport",
    "Snakke med naboen",
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        color: "var(--text)",
      }}
    >
      {/* Welcome message */}
      <div
        style={{
          fontSize: "1.4rem",
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        👋 Hei! Klar til å øve norsk?
      </div>

      <div
        style={{
          fontSize: "0.95rem",
          maxWidth: 420,
          color: "var(--muted)",
          marginBottom: 30,
        }}
      >
        Velg et scenario fra forslagene under, eller klikk på{" "}
        <strong>“Ny samtale”</strong> for å starte en egen øvelse.
      </div>

      {/* Suggestions Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          width: "100%",
          maxWidth: 600,
        }}
      >
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSelectTopic(s)}
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-soft)",
              backgroundColor: "var(--surface)",
              cursor: "pointer",
              fontSize: "0.9rem",
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
