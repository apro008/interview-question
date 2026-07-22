import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { FRUITS, useDebounce } from "./data.js";

export default function PaginatedList() {
  const [query, setQuery] = useState("");
  const searchTerm = useDebounce(query, 300);

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return FRUITS;
    return FRUITS.filter((f) => f.name.toLowerCase().includes(q));
  }, [searchTerm]);

  // --- Pagination ---
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));

  // Reset to page 1 whenever the search changes.
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <View style={styles.wrap}>
      <Text style={styles.sub}>Type to filter. Page through the results.</Text>

      <TextInput
        style={styles.search}
        placeholder="Search fruits…"
        value={query}
        onChangeText={setQuery}
        autoFocus
      />

      <Text style={styles.meta}>
        {results.length} result{results.length === 1 ? "" : "s"}
      </Text>

      {results.length === 0 ? (
        <Text style={styles.empty}>No matches for "{searchTerm}"</Text>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowText}>{item.name}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.pager}>
        <Pressable
          style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
          onPress={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          <Text style={styles.pageBtnText}>← Prev</Text>
        </Pressable>
        <Text style={styles.pageInfo}>
          Page {page} of {pageCount}
        </Text>
        <Pressable
          style={[styles.pageBtn, page === pageCount && styles.pageBtnDisabled]}
          onPress={() => setPage((p) => p + 1)}
          disabled={page === pageCount}
        >
          <Text style={styles.pageBtnText}>Next →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  sub: { color: "#64748b", fontSize: 13, marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  meta: { color: "#64748b", fontSize: 13, marginVertical: 8 },
  empty: { textAlign: "center", color: "#94a3b8", padding: 24, fontSize: 15 },
  row: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  rowText: { fontSize: 15, color: "#1a202c" },
  pager: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  pageBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  pageBtnDisabled: { opacity: 0.45 },
  pageBtnText: { fontSize: 14, color: "#1a202c" },
  pageInfo: { fontSize: 14, color: "#64748b" },
});
