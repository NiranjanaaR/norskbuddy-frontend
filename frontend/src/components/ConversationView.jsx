import React, { useState, useEffect, useRef } from "react";

export default function ConversationView({
  conversation,
  onUpdate,
  secondsLeft,
  running,
  setRunning,
  onGoToPayment,
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [explanationLang] = useState("English");
  const [level, setLevel] = useState("A2");
  const [topic, setTopic] = useState(conversation.topic || "");
    
  const messagesEndRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const recognitionRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const audioCacheRef = useRef(new Map()); 
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showSessionOver, setShowSessionOver] = useState(true);


  useEffect(() => {
    setTopic(conversation.topic || "");
  }, [conversation.id, conversation.topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages.length]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SR =
        window.SpeechRecognition || window.webkitSpeechRecognition || null;
      setHasSpeechSupport(!!SR);
    }
  }, []);

useEffect(() => {
  const alreadyHasMessages =
    Array.isArray(conversation.messages) &&
    conversation.messages.length > 0;

  setHasStarted(alreadyHasMessages);
}, [conversation.id, conversation.messages.length]);

  


  // mic handler
  const handleToggleRecording = () => {
    if (!hasSpeechSupport) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) return;

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = "nb-NO";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    setIsRecording(true);
    recognition.start();
  };
const startSpeechRecognition = (onResult) => {
  if (!hasSpeechSupport) return;

  if (isRecording && recognitionRef.current) {
    recognitionRef.current.stop();
    return;
  }

  const SR =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;
  if (!SR) return;

  const recognition = new SR();
  recognitionRef.current = recognition;
  recognition.lang = "nb-NO";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript); // VERY IMPORTANT
  };

  recognition.onerror = () => setIsRecording(false);
  recognition.onend = () => setIsRecording(false);

  setIsRecording(true);
  recognition.start();
};

const handleScenarioMic = () => {
  startSpeechRecognition((text) => {
    setTopic(text);
    onUpdate({
      ...conversation,
      topic: text,
    });
  });
};
const handleChatMic = () => {
  startSpeechRecognition((text) => {
    setInput((prev) => (prev ? prev + " " + text : text));
  });
};

const speak = async (messageId, text) => {
  // 🚫 Prevent re-trigger if already playing
  if (playingMessageId !== null) return;

  let audio = null;

  try {
    // ✅ mark as playing immediately
    setPlayingMessageId(messageId);

    // ✅ 1. If cached, reuse
    const cachedUrl = audioCacheRef.current.get(messageId);
    if (cachedUrl) {
      audio = new Audio(cachedUrl);
    } else {
      // ✅ 2. Otherwise fetch from backend
      const res = await fetch("https://norskbuddy-backend.onrender.com/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("TTS HTTP " + res.status);
      }

      const audioBlob = await res.blob();

      if (!audioBlob || audioBlob.size < 100) {
        throw new Error("Invalid audio blob");
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      audioCacheRef.current.set(messageId, audioUrl);

      audio = new Audio(audioUrl);
    }

    // ✅ very important: ALWAYS clean up
    audio.onended = () => {
      setPlayingMessageId(null);
    };

    audio.onerror = () => {
      setPlayingMessageId(null);
    };

    audio.play();
  } catch (err) {
    console.error("TTS failed, fallback voice used:", err);
    setPlayingMessageId(null);

    // ✅ Browser fallback
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "nb-NO";
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingMessageId(null);
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }
};



  

  const handleSend = async () => {
  const trimmed = input.trim();
  if (!trimmed || loading) return;

  const newConv = {
    ...conversation,
    _pending: false,  
    messages: [
      ...conversation.messages,
      { id: `m-${Date.now()}`, role: "user", text: trimmed },
    ],
  };
  onUpdate(newConv);
  setInput("");

  if (!running) setRunning(true);
  if (secondsLeft <= 0) return;

  setLoading(true);
  setIsThinking(true);

  try {
    const res = await fetch("https://norskbuddy-backend.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_message: trimmed,
        topic: topic || conversation.topic,
        level,
      }),
    });

    const data = await res.json();
    const botMessageId = `m-bot-${Date.now()}`;
    const convWithReply = {
      ...newConv,
      messages: [
        ...newConv.messages,
        {
          id: botMessageId,
          role: "bot",
          text: data.reply,
        },
      ],
    };

    onUpdate(convWithReply);
    speak(botMessageId, data.reply);

    

  } catch (e) {
    setIsThinking(false)
    console.error(e);
  } finally {
    setLoading(false);
    setIsThinking(false)
  }
};


 
  const handleExplainInEnglish = async () => {
  if (loading) return;

  const lastBot = [...conversation.messages]
    .reverse()
    .find((m) => m.role === "bot");

  if (!lastBot) return;

  setLoading(true);

  try {
    const res = await fetch("https://norskbuddy-backend.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_message: `IMPORTANT: Translate the following Norwegian text to English ONLY. Give the exact translation. Do not explain, do not add anything else:\n"${lastBot.text}"`,
        topic: topic || conversation.topic,
        level,
      }),
    });

    const data = await res.json();

    onUpdate({
      ...conversation,
      messages: [
        ...conversation.messages,
        {
          id: `m-expl-${Date.now()}`,
          role: "system",
          text: data.reply,
        },
      ],
    });
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};


  const timeWarning =
    running && secondsLeft <= 5 * 60 && secondsLeft > 0
      ? "Bare 5 minutter igjen av dagens økt ✨"
      : null;

  const handleTopicChange = (value) => {
    setTopic(value);
    onUpdate({
      ...conversation,
      topic: value,
    });
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight:0,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
   
        
      }}
    >
        {secondsLeft <= 0 &&  showSessionOver && (
    <div 
        style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(255,255,255,0.9)",
        padding: "20px 28px",
        borderRadius: "16px",
        border: "1px solid var(--border-soft)",
        textAlign: "center",
        zIndex: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        maxWidth: "80%",
        }}
    >
       <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
        Dagens økt er ferdig ⏰
       </div>

      <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 14 }}>
        Du kan fortsatt lese samtaler i historikken, men ikke skrive mer.
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={() => setShowSessionOver(false)}
          style={{
            borderRadius: 999,
            border: "1px solid var(--border-soft)",
            padding: "6px 12px",
            background: "#fff",
            fontSize: "0.82rem",
            cursor: "pointer",
          }}
        >
          Lukk
        </button>

        <button
          onClick={() => onGoToPayment?.()}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "6px 12px",
            background: "var(--primary)",
            color: "#fff",
            fontSize: "0.82rem",
            cursor: "pointer",
          }}
        >
          Oppgrader for daglig tilgang
        </button>
      </div>
    </div>
    )}

      {/* SCENARIO + LEVEL */}
      <div
        style={{
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-soft)",
          padding: "10px 16px",
          backgroundColor: "var(--surface)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,

          pointerEvents: hasStarted || secondsLeft <= 0 ? "none" : "auto",
          opacity: hasStarted || secondsLeft <= 0 ? 0.5 : 1,

        }}
      >
        <div style={{ flex: 1, marginRight: 16, position: "relative" }}>
  <div
    style={{
      fontSize: "0.78rem",
      color: "var(--muted)",
      marginBottom: 4,
    }}
  >
    Scenario du vil øve på
  </div>

          <div style={{ position: "relative", width: "100%" }}>
            <input
              value={topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              placeholder="F.eks. 'Jobbintervju', 'Butikk: handle dagligvarer', 'Norskprøve B1'..."
              style={{
                width: "100%",
                padding: "8px 42px 8px 10px", // space for mic
                borderRadius: 999,
                border: "1px solid var(--border-soft)",
                backgroundColor: "var(--surface-alt)",
                fontSize: "0.9rem",
                color: "var(--text)",
              }}
            />

            <button
              type="button"
              onClick={handleScenarioMic}
              disabled={!hasSpeechSupport}
              title="Snakk for å sette scenario"
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: hasSpeechSupport ? "pointer" : "not-allowed",
                fontSize: "1.1rem",
                opacity: isRecording ? 1 : 0.7,
              }}
            >
              🎙️
            </button>
          </div>
        </div>

        

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--muted)",
            }}
          >
            Nivå
          </span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid var(--border-soft)",
              backgroundColor: "var(--surface-alt)",
              fontSize: "0.8rem",
              color: "var(--text)",
            }}
          >
            <option value="A1">A1 – Nybegynner</option>
            <option value="A2">A2 – Grunnleggende</option>
            <option value="B1">B1 – Mellomnivå</option>
            <option value="B2">B2 – Øvet</option>
          </select>

          {timeWarning && (
            <div
              style={{
                marginTop: 4,
                fontSize: "0.8rem",
                color: "#b45309",
                padding: "3px 8px",
                borderRadius: 999,
                border: "1px solid rgba(245,158,11,0.5)",
                backgroundColor: "rgba(254,243,199,0.7)",
              }}
            >
              {timeWarning}
            </div>
          )}
        </div>
      </div>
      {!hasStarted && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: 8,
    }}
  >
    <button
      type="button"
      disabled={!topic.trim()}
      onClick={async () => {
        setHasStarted(true);
        setLoading(true);

        try {
          const res = await fetch("https://norskbuddy-backend.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_message: `Start samtalen for temaet "${topic}". Still én naturlig åpningsreplikk.`,
              topic,
              level,
            }),
          });

          const data = await res.json();

          const botMessageId = `m-bot-${Date.now()}`;

            onUpdate({
              ...conversation,
              messages: [
                {
                  id: botMessageId,
                  role: "bot",
                  text: data.reply,
                },
              ],
            });

            speak(botMessageId, data.reply);

        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }}
      style={{
        padding: "10px 18px",
        borderRadius: 999,
        border: "none",
        backgroundColor: topic.trim()
          ? "var(--primary)"
          : "rgba(148,163,184,0.5)",
        color: "#fff",
        fontSize: "0.9rem",
        fontWeight: 600,
        cursor: topic.trim() ? "pointer" : "not-allowed",
        opacity: topic.trim() ? 1 : 0.6,
      }}
    >
      Start samtale
    </button>
  </div>
)}


      {/* MESSAGES AREA */}
      <div
        style={{
          flex: 1,
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-soft)",
          backgroundColor: "var(--surface)",
          padding: "10px 10px 6px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          opacity: hasStarted ? 1 : 0.4,
          pointerEvents: hasStarted ? "auto" : "none",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: 6,
          }}
        >
            {isThinking && (
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--muted)",
            marginBottom: 6,
            fontStyle: "italic",
          }}
        >
          Norsk venn tenker…
        </div>
        )}
          {conversation.messages.length === 0 ? (
            <div
              style={{
                fontSize: "0.86rem",
                color: "var(--muted)",
                padding: "8px 4px",
              }}
            >
              Skriv første melding for scenariet{" "}
              <strong>
                “{topic || conversation.topic || "ditt valgte scenario"}”
              </strong>
              Skriv eller snakk for å starte samtalen. Jeg er klar 😊
            </div>
          ) : (
           conversation.messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              disabled={playingMessageId === m.id}
              onSpeak={
                m.role === "bot"
                  ? () => speak(m.id, m.text)
                  : undefined
              }
            />
          ))

          )}
          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM CONTROLS + INPUT */}
        <div
          style={{
            borderTop: "1px solid var(--border-soft)",
            paddingTop: 6,
            marginTop: 4,
            opacity: secondsLeft <= 0 ? 0.4 : 1,
            pointerEvents: secondsLeft <= 0 ? "none" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 6,
            }}
          >
            <button
              type="button"
              onClick={handleExplainInEnglish}
              style={{
                borderRadius: 999,
                border: "1px solid var(--border-soft)",
                padding: "5px 10px",
                fontSize: "0.78rem",
                backgroundColor: "var(--surface-alt)",
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              Forklar på {explanationLang}
            </button>
            <button
              type="button"
              onClick={() => {
                const lastBot = [...conversation.messages]
                  .reverse()
                  .find((m) => m.role === "bot");
                if (lastBot) speak(lastBot.id, lastBot.text);

              }}
              style={{
                borderRadius: 999,
                border: "1px solid var(--border-soft)",
                padding: "5px 10px",
                fontSize: "0.9rem",
                backgroundColor: "var(--surface-alt)",
                color: "var(--text)",
                cursor: "pointer",
              }}
              title="Spill av siste svar"
            >
              🔊
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
            }}
          >
            <input
              disabled={!hasStarted}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skriv svaret ditt på norsk..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid #d8cfc7",
                backgroundColor: "#fffdf9",
                color: "#2b241f",
                fontSize: "0.92rem",
              }}
            />

            {/* Mic button */}
            <button
              type="button"
              onClick={handleChatMic}
              disabled={!hasSpeechSupport}
              title={
                hasSpeechSupport
                  ? isRecording
                    ? "Stopp opptak"
                    : "Snakk"
                  : "Stemmeopptak støttes ikke i denne nettleseren"
              }
              style={{
                  borderRadius: 999,
                  border: "1px solid #d8cfc7",
                  padding: "0 10px",
                  backgroundColor: isRecording ? "#8b5a2b" : "#fffdf9",
                  color: isRecording ? "#fff" : "#2b241f",
                  fontSize: "1rem",
                  cursor: hasSpeechSupport ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isRecording
                    ? "0 0 0 3px rgba(139,90,43,0.4)"
                    : "none",
                }}
            >
              🎙️
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={loading || secondsLeft <= 0}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "8px 16px",
                backgroundColor: loading
                  ? "rgba(148,163,184,0.6)"
                  : "var(--primary)",
                color: "#f9fafb",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
              }}
            >
              {loading ? "Vent..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, onSpeak, disabled }) {
  const isUser = message.role === "user";
  const isBot = message.role === "bot";
  const isSystem = message.role === "system";

  let align = "flex-start";
  let bg = "var(--surface-alt)";
  let border = "1px solid var(--border-soft)";
  let color = "var(--text)";
  let label = "";

  if (isUser) {
    align = "flex-end";
    bg = "#f2e8dd";
    border = "1px solid #e4d6c8";
    color = "#2b241f";
    label = "Du";
  } else if (isBot) {
    align = "flex-start";
    bg = "#fffaf4";
    border = "1px solid #e6ded5";
    color = "#302922";
    label = "Norsk venn";
  } else if (isSystem) {
    align = "center";
    bg = "transparent";
    border = "none";
    color = "var(--muted)";
  }

  if (isSystem) {
    return (
      <div style={{ marginBottom: 6, fontSize: "0.8rem", color }}>
        {message.text}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: align, marginBottom: 6 }}>
      <div
        style={{
          maxWidth: "80%",
          padding: "7px 9px",
          borderRadius: 18,
          backgroundColor: bg,
          border,
          fontSize: "0.9rem",
          whiteSpace: "pre-wrap",
          color,
          position: "relative",
        }}
      >
        {label && (
          <div
            style={{
              fontSize: "0.7rem",
              color: "var(--muted)",
              marginBottom: 2,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {label}
          </div>
        )}

        {/* 🔊 Speaker for bot messages */}
        {isBot && onSpeak && (
          <button
            type="button"
            onClick={onSpeak}
            disabled={disabled}
            title="Spill av meldingen"
            style={{
              position: "absolute",
              top: 4,
              right: 6,
              border: "none",
              background: "transparent",
              cursor: disabled ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              opacity: disabled ? 0.3 : 0.7,
            }}
          >
            🔊
          </button>

        )}

        {message.text}
      </div>
    </div>
  );
}



