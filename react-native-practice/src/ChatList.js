import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
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

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.mine ? styles.mine : styles.theirs,
      ]}
    >
      <Text style={item.mine ? styles.mineText : styles.theirsText}>
        {item.text}
      </Text>
      {item.mine && (
        <View style={styles.statusRow}>
          {item.status === "sending" && (
            <Text style={styles.statusSending}>sending…</Text>
          )}
          {item.status === "sent" && <Text style={styles.status}>sent ✓</Text>}
          {item.status === "failed" && (
            <>
              <Text style={styles.statusFailed}>failed</Text>
              <Pressable onPress={() => handleRetry(item.id)}>
                <Text style={styles.retry}>Retry</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.sub}>
        Send a message — it should appear instantly as "sending", then flip to
        "sent" (or "failed" ~30% of the time — then Retry).
      </Text>

      <FlatList
        style={styles.list}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message…"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable
          style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!draft.trim()}
        >
          <Text style={styles.sendBtnText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  sub: { color: "#64748b", fontSize: 13, marginBottom: 12 },
  list: { flex: 1 },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 8,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: "#3b82f6",
    borderBottomRightRadius: 4,
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderBottomLeftRadius: 4,
  },
  mineText: { color: "#fff", fontSize: 15 },
  theirsText: { color: "#1a202c", fontSize: 15 },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 6,
  },
  status: { color: "#dbeafe", fontSize: 11 },
  statusSending: { color: "#dbeafe", fontSize: 11, fontStyle: "italic" },
  statusFailed: { color: "#fecaca", fontSize: 11 },
  retry: {
    color: "#fff",
    fontSize: 11,
    textDecorationLine: "underline",
  },
  composer: { flexDirection: "row", gap: 8, paddingVertical: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  sendBtn: {
    paddingHorizontal: 18,
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  sendBtnDisabled: { opacity: 0.45 },
  sendBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
