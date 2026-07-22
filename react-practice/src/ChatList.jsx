import { useState } from "react";
import { fakeSendMessage } from "./data.js";

// Seed conversation. Each message: { id, text, mine, status }
//   status is only meaningful for messages you send:
//   "sending" | "sent" | "failed"
const SEED = [
  { id: "s1", text: "Hey! Did you finish the pagination task?", mine: false, status: "sent" },
  { id: "s2", text: "Yeah, moving on to the chat one now.", mine: true, status: "sent" },
  { id: "s3", text: "Nice — try optimistic updates on send.", mine: false, status: "sent" },
];

export default function ChatList() {
  const [messages, setMessages] = useState(SEED);
  const [draft, setDraft] = useState("");

  // Update a single message by id, leaving the rest untouched.
  // Always maps over `prev` so concurrent sends don't clobber each other.
  const setStatus = (id, status) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  // Send `text` under a given id (a fresh temp id on first send, or the
  // existing id on retry). Optimistically shows "sending", then reconciles.
  const deliver = async (id, text) => {
    setStatus(id, "sending");
    try {
      await fakeSendMessage(text);
      setStatus(id, "sent");
    } catch {
      setStatus(id, "failed");
    }
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    // 1. Optimistically add the message immediately, before the server replies.
    const tempId = `tmp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, text, mine: true, status: "sending" },
    ]);
    setDraft("");

    // 2. Fire the request and reconcile when it resolves/rejects.
    deliver(tempId, text);
  };

  const handleRetry = (id) => {
    const msg = messages.find((m) => m.id === id);
    if (msg) deliver(id, msg.text);
  };

  return (
    <div>
      <p className="sub">
        Send a message — it should appear instantly as "sending", then flip to
        "sent" (or "failed", ~30% of the time — then Retry).
      </p>

      <div className="chat-box">
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.mine ? "mine" : "theirs"}`}>
            <span className="bubble-text">{m.text}</span>
            {m.mine && (
              <span className={`status status-${m.status}`}>
                {m.status === "sending" && "· sending…"}
                {m.status === "sent" && "· sent ✓"}
                {m.status === "failed" && (
                  <>
                    · failed
                    <button className="retry" onClick={() => handleRetry(m.id)}>
                      Retry
                    </button>
                  </>
                )}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="composer">
        <input
          className="search"
          type="text"
          placeholder="Type a message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="page-btn" onClick={handleSend} disabled={!draft.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
