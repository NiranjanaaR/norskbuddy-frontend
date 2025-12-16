import React, { useState, useEffect } from "react";
import HistoryPanel from "./HistoryPanel.jsx";
import ConversationView from "./ConversationView.jsx";

/* ===========================
   CONSTANTS & HELPERS
=========================== */

const MAX_SECONDS = 60 * 60;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ===========================
   MAIN SCREEN
=========================== */

export default function MainScreen({ session, onLogout }) {
  const convKey = `pwme_conversations_${session.uid}`;
  const timerKey = `pwme_timer_${session.uid}`;

  /* ---------- Conversations ---------- */

  const [conversations, setConversations] = useState(() =>
    loadJSON(convKey, [])
  );
  const [activeId, setActiveId] = useState(null);

  /* ---------- Daily Timer ---------- */

  const savedTimer = loadJSON(timerKey, null);
  const isToday = savedTimer?.date === todayKey();

  const [usedSeconds, setUsedSeconds] = useState(
    isToday ? savedTimer.usedSeconds : 0
  );

  const secondsLeft = Math.max(0, MAX_SECONDS - usedSeconds);
  const [running, setRunning] = useState(false);

  /* ---------- UI ---------- */

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ===========================
     INITIALIZE ON MOUNT
  =========================== */

 
  /* ===========================
     PERSIST CONVERSATIONS
  =========================== */

  useEffect(() => {
    saveJSON(convKey, conversations);
  }, [conversations, convKey]);

  /* ===========================
     DAILY TIMER LOGIC
  =========================== */

  // reset timer automatically on a new day
  useEffect(() => {
    if (!isToday) {
      setUsedSeconds(0);
      saveJSON(timerKey, {
        date: todayKey(),
        usedSeconds: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.uid]);

  // count time while running
  useEffect(() => {
    if (!running || secondsLeft <= 0) return;

    const id = setInterval(() => {
      setUsedSeconds((prev) => {
        const next = prev + 1;
        saveJSON(timerKey, {
          date: todayKey(),
          usedSeconds: next,
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running, secondsLeft, timerKey]);

 



  /* ===========================
     CONVERSATION HELPERS
  =========================== */

  const activeConversation =
    conversations.find((c) => c.id === activeId) || null;

  const createNewConversation = () => {
    const id = `conv-${Date.now()}`;
    const newConv = {
      id,
      topic: "",
      createdAt: new Date().toISOString(),
      messages: [],
      _pending: true,   // mark as not yet real
  };

  setConversations([...conversations, newConv]);
  

    
    setActiveId(id);
    setRunning(false);
    setSidebarOpen(false);
  };

  const updateConversation = (updated) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const selectConversation = (conv) => {
    setActiveId(conv.id);
    setSidebarOpen(false);
  };

  /* ===========================
     TIME DISPLAY
  =========================== */

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  /* ===========================
     RENDER
  =========================== */

  return (
    <div className="main-root">
      {/* HEADER */}
      <header className="main-header">
        <div>
          <div className="main-app-name">PracticeWithMe 🇳🇴</div>
          <div className="main-user">
            Hei, <strong>{session.name || session.email}</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            type="button"
            className="sidebar-toggle-header"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Samtaler
          </button>

          <div
            style={{
              fontSize: "0.8rem",
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid var(--border-soft)",
              backgroundColor: "var(--surface-alt)",
            }}
          >
            Dagens økt: {minutes}:{seconds}
          </div>
          {secondsLeft <= 0 && (
            <button
              onClick={() => alert("Go to payment")}
              style={{
                borderRadius: 999,
                border: "1px solid var(--border-soft)",
                padding: "6px 12px",
                fontSize: "0.8rem",
                background: "var(--primary)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Oppgrader
            </button>
          )}


          <button className="main-logout-btn" onClick={onLogout}>
            Logg ut
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="main-body">
        {/* SIDEBAR */}
        <div
          className={
            "sidebar-container" + (sidebarOpen ? " sidebar-open" : "")
          }
        >
          <HistoryPanel
            conversations={conversations}
            activeId={activeId}
            onSelect={selectConversation}
            onLogout={onLogout}
            userName={session.name || session.email}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* CHAT AREA */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              Øv norsk i 30 minutter om dagen.
            </div>

            <button
              type="button"
              onClick={createNewConversation}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "6px 12px",
                fontSize: "0.85rem",
                backgroundColor: "var(--primary)",
                color: "#f9fafb",
                cursor: "pointer",
              }}
            >
              ✨ Ny samtale
            </button>
          </div>

          {!activeConversation ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                fontSize: "0.9rem",
                border: "1px dashed var(--border-soft)",
                borderRadius: "var(--radius-lg)",
                background: "var(--surface-alt)",
                padding: 24,
                textAlign: "center",
              }}
            >
              Velg en samtale fra historikken til venstre, eller trykk{" "}
              <strong style={{ margin: "0 4px" }}>“Ny samtale”</strong> for å starte en ny økt ✨
            </div>
          ) : (
            <ConversationView
              conversation={activeConversation}
              onUpdate={updateConversation}
              secondsLeft={secondsLeft}
              running={running}
              setRunning={setRunning}
              onGoToPayment={() => alert("Go to payment")}

            />
          )}

        </div>
      </div>
    </div>
  );
}
