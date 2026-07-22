import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { FRUITS, useDebounce } from "./data.js";

const BATCH = 14; // how many rows we reveal at a time ("page size")

export default function InfiniteList() {
  const [query, setQuery] = useState("");
  const searchTerm = useDebounce(query, 300);

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return FRUITS;
    return FRUITS.filter((f) => f.toLowerCase().includes(q));
  }, [searchTerm]);

  // How many items are currently rendered. Grows as you reach the end.
  const [limit, setLimit] = useState(BATCH);

  // New search -> start over from the first batch.
  useEffect(() => {
    setLimit(BATCH);
  }, [searchTerm]);

  const visible = results.slice(0, limit);
  const hasMore = limit < results.length;

  // "onEndReached": reveal the next batch.
  const loadMore = useCallback(() => {
    setLimit((n) => Math.min(n + BATCH, results.length));
  }, [results.length]);

  // Watch a sentinel <div> at the bottom of the scroll box. When it scrolls
  // into view, we've reached the end -> load more. This is the web equivalent
  // of FlatList's onEndReached.
  const sentinelRef = useRef(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1.0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div>
      <p className="sub">
        Only {BATCH} rows render at first. Scroll to the bottom of the box and
        the next batch is appended (onEndReached).
      </p>

      <input
        className="search"
        type="text"
        placeholder="Search fruits…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div className="meta">
        Showing {visible.length} of {results.length}
      </div>

      {results.length === 0 ? (
        <p className="empty">No matches for "{searchTerm}"</p>
      ) : (
        <div className="scroll-box">
          <ul>
            {visible.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          {hasMore ? (
            <div ref={sentinelRef} className="sentinel">
              Loading more…
            </div>
          ) : (
            <div className="sentinel end">— end of list —</div>
          )}
        </div>
      )}
    </div>
  );
}
