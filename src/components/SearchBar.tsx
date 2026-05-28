"use client";

import { useState, FormEvent } from "react";

interface Props {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <label htmlFor="game-search" className="sr-only">
        게임 이름 검색
      </label>
      <input
        id="game-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="게임 이름 검색 (예: Elden Ring)"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
      >
        검색
      </button>
    </form>
  );
}
