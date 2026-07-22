import { useState, useMemo, useEffect } from "react";
import { FRUITS, useDebounce } from "./data.js";

export default function PaginatedList() {
  const [query, setQuery] = useState("");
  const searchTerm = useDebounce(query, 300);

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return FRUITS;
    return FRUITS.filter((f) => f.toLowerCase().includes(q));
  }, [searchTerm]);

  // --- Pagination ---
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));

  // Reset to page 1 whenever the search changes, so we're never stranded
  // on a page that no longer exists after filtering.
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <p className="sub">Type to filter. Page through the results below.</p>

      <input
        className="search"
        type="text"
        placeholder="Search fruits…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div className="meta">
        {results.length} result{results.length === 1 ? "" : "s"}
      </div>

      {results.length === 0 ? (
        <p className="empty">No matches for "{searchTerm}"</p>
      ) : (
        <>
          <ul>
            {visible.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <div className="pager">
            <button
              className="page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span className="page-info">
              Page {page} of {pageCount}
            </span>
            <button
              className="page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pageCount}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
