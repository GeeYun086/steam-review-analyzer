"use client";

import { useRef } from "react";
import { useStaggerReveal } from "@/hooks/useReveal";

const POPULAR_GAMES = [
  { name: "Elden Ring",       emoji: "⚔️", color: "#92400e", appid: 1245620 },
  { name: "Counter-Strike 2", emoji: "🔫", color: "#7f1d1d", appid: 730 },
  { name: "Cyberpunk 2077",   emoji: "🌆", color: "#713f12", appid: 1091500 },
  { name: "Stardew Valley",   emoji: "🌾", color: "#14532d", appid: 413150 },
  { name: "Baldur's Gate 3",  emoji: "🧙", color: "#4c1d95", appid: 1086940 },
  { name: "Hollow Knight",    emoji: "🦋", color: "#1e3a5f", appid: 367520 },
  { name: "Hades",            emoji: "🔱", color: "#7f1d1d", appid: 1145360 },
  { name: "DAVE THE DIVER",   emoji: "🤿", color: "#164e63", appid: 1868140 },
];

interface Props {
  disabled: boolean;
  onSelect: (appid: number, name: string) => void;
}

export default function PopularGamesSection({ disabled, onSelect }: Props) {
  const cardsRef = useStaggerReveal(POPULAR_GAMES.length);

  return (
    <section className="mb-16">
      <p
        className="text-xs uppercase tracking-[0.2em] text-center mb-6 font-medium"
        style={{ color: "rgba(167,139,250,0.4)" }}
      >
        인기 게임으로 바로 시작하기
      </p>
      <div ref={cardsRef} className="grid grid-cols-4 gap-3">
        {POPULAR_GAMES.map((game) => (
          <button
            key={game.appid}
            onClick={() => onSelect(game.appid, game.name)}
            disabled={disabled}
            className="card-stagger game-card flex flex-col items-center gap-3 p-5 rounded-2xl text-center group"
            style={{
              background: `linear-gradient(160deg, ${game.color}55 0%, rgba(255,255,255,0.02) 100%)`,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{game.emoji}</span>
            <span className="text-xs font-medium leading-snug" style={{ color: "rgba(221,214,254,0.8)" }}>
              {game.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
