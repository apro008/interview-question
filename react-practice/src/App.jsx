import { useState } from "react";
import PaginatedList from "./PaginatedList.jsx";
import InfiniteList from "./InfiniteList.jsx";
import ChatList from "./ChatList.jsx";

const TABS = [
  { key: "pagination", label: "Pagination" },
  { key: "infinite", label: "Infinite Scroll" },
  { key: "chat", label: "Chat" },
];

export default function App() {
  const [tab, setTab] = useState("pagination");

  return (
    <div className="container">
      <h1>Searchable List</h1>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pagination" && <PaginatedList />}
      {tab === "infinite" && <InfiniteList />}
      {tab === "chat" && <ChatList />}
    </div>
  );
}
