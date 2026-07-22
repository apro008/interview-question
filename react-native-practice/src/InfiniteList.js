import { useState, useMemo, useEffect, useCallback } from "react";
import {
	View,
	Text,
	TextInput,
	FlatList,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { FRUITS, useDebounce } from "./data.js";

const BATCH = 14; // how many rows we reveal at a time

function debounce(val, delay) {
	const [debounceVal, setDebounceVal] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounceVal(val);
		}, delay);
		return () => {
			clearTimeout(timer);
		};
	}, [val]);

	return debounceVal;
}

export default function InfiniteList() {
	const [query, setQuery] = useState("");
	const [pageNo, setPageNo] = useState(1);

	const searchTerm = debounce(query, 500);

	const results = useMemo(() => {
		if (searchTerm) {
			return FRUITS.filter((fruit) =>
				fruit.name.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}
		return FRUITS;
	}, [searchTerm]);

  console.log("results", results);
  
  useEffect(() => { setPageNo(1); }, [searchTerm]);

	const visible = results.length ? results.slice(0, pageNo * BATCH) : [];

	const hasMore = results?.length > visible?.length;

	const handleEndReached = () => {
		if (hasMore) {
			setPageNo((n) => n + 1);
    }
	};

	return (
		<View style={styles.wrap}>
			<Text style={styles.sub}>
				{BATCH} rows load at first. Scroll to the end and the next batch is
				appended (onEndReached).
			</Text>

			<TextInput
				style={styles.search}
				placeholder="Search fruits…"
				value={query}
				onChangeText={setQuery}
				autoFocus
			/>

			<Text style={styles.meta}>
				Showing {visible.length} of {results.length}
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
					onEndReached={handleEndReached}
					onEndReachedThreshold={0.5} // fire when within half a screen of the end
					ListFooterComponent={
					  hasMore ? (
					    <ActivityIndicator style={styles.footer} />
					  ) : (
					    <Text style={styles.footerEnd}>— end of list —</Text>
					  )
					}
				/>
			)}
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
	footer: { paddingVertical: 16 },
	footerEnd: {
		textAlign: "center",
		color: "#cbd5e1",
		fontSize: 13,
		paddingVertical: 16,
	},
});
