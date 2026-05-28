"use client";

import Image from "next/image";
import type { GameSearchResult } from "@/services/steamService";

interface Props {
  game: GameSearchResult;
  onSelect: (game: GameSearchResult) => void;
  selected?: boolean;
  loading?: boolean;
}

export default function GameCard({ game, onSelect, selected, loading }: Props) {
  return (
    <button
      onClick={() => onSelect(game)}
      disabled={loading}
      className={`flex items-center gap-3 w-full p-3 rounded-lg border text-left transition-colors ${
        selected
          ? "border-blue-500 bg-blue-900/30"
          : "border-gray-700 bg-gray-800 hover:border-gray-500"
      } disabled:opacity-50`}
    >
      {game.icon && (
        <Image
          src={game.icon}
          alt={game.name}
          width={32}
          height={32}
          className="rounded"
          unoptimized
        />
      )}
      <span className="text-white font-medium truncate">{game.name}</span>
    </button>
  );
}
