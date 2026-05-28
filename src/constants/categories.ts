export const CATEGORY_KEYS = [
  "gameplay",
  "graphics",
  "sound",
  "story",
  "performance",
  "price",
  "multiplayer",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  gameplay: "게임플레이",
  graphics: "그래픽",
  sound: "사운드",
  story: "스토리",
  performance: "최적화",
  price: "가격",
  multiplayer: "멀티플레이",
};
