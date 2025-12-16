import React from "react";

export default function HistoryPanel({
  conversations,
  activeId,
  onSelect,
  onLogout,
  userName,
  onClose,   // 👈 from MainScreen
}) {
  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        height: "100%",
        borderRight: "1px solid var(--border-soft)",
        padding: "18px 14px",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #faf6f1, #f3ede7)",
        color: "#3b3b3b",
        position: "relative",
      }}
    >
      {/* mobile close button (top-right) */}
      {onClose && (
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
        >
          ×
        </button>
      )}

      <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 2 }}>
        Samtaler
      </div>

      <div
        style={{
          fontSize: "0.78rem",
          color: "var(--muted)",
          marginBottom: 2,
        }}
      >
        Conversations
      </div>
      <div
        style={{
          fontSize: "0.78rem",
          color: "var(--muted)",
          marginBottom: 10,
        }}
      >
        Klikk for å lese eller fortsette.
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
        {conversations.length === 0 ? (
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginTop: 8,
            }}
          >
            Ingen samtaler ennå. Start en ny økt til høyre.
          </div>
        ) : (
          conversations
            .filter(conv => !conv._pending).reverse().map((conv) => {
            const date = new Date(conv.createdAt);
            const short =
              conv.topic.length > 40
                ? conv.topic.slice(0, 40) + "..."
                : conv.topic;
            const subtitle = date.toLocaleString("no-NO", {
              dateStyle: "short",
              timeStyle: "short",
            });

            const active = conv.id === activeId;
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: active ? "1px solid #c8bfb7" : "1px solid transparent",
                  backgroundColor: active ? "#e7dfd8" : "transparent",
                  borderRadius: 12,
                  padding: "8px 9px",
                  marginBottom: 6,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "#272727",
                    marginBottom: 2,
                  }}
                >
                  {short}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--muted)",
                  }}
                >
                  {subtitle}
                </div>
              </button>
            );
          })
        )}
      </div>

      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: "1px solid #d2c7bc",
          fontSize: "0.8rem",
          color: "var(--muted)",
        }}
      >
        <div>{userName}</div>
        <button
          onClick={onLogout}
          style={{
            marginTop: 6,
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.7)",
            background: "transparent",
            padding: "4px 8px",
            color: "var(--muted)",
            fontSize: "0.78rem",
            cursor: "pointer",
          }}
        >
          Logg ut
        </button>
      </div>
    </aside>
  );
}
