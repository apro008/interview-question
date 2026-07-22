import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import PaginatedList from "./src/PaginatedList.js";
import InfiniteList from "./src/InfiniteList.js";
import ChatList from "./src/ChatList.js";

const TABS = [
  { key: "pagination", label: "Pagination" },
  { key: "infinite", label: "Infinite" },
  { key: "chat", label: "Chat" },
];

export default function App() {
  const [tab, setTab] = useState("pagination");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Searchable List</Text>

        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === "pagination" && <PaginatedList />}
        {tab === "infinite" && <InfiniteList />}
        {tab === "chat" && <ChatList />}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f0f4f8" },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#1a202c", marginBottom: 16 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 20 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  tabText: { fontSize: 14, color: "#64748b" },
  tabTextActive: { color: "#fff", fontWeight: "600" },
});
