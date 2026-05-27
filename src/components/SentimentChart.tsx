"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { CategorySentiment } from "@/services/aiService";

const CATEGORY_LABELS: Record<string, string> = {
  gameplay: "게임플레이",
  graphics: "그래픽",
  sound: "사운드",
  story: "스토리",
  performance: "최적화",
  price: "가격",
  multiplayer: "멀티플레이",
};

interface Props {
  category: string;
  data: CategorySentiment;
}

export default function SentimentChart({ category, data }: Props) {
  const label = CATEGORY_LABELS[category] ?? category;

  if (data.total === 0) {
    return (
      <div className="flex flex-col items-center bg-gray-800 rounded-xl p-4 border border-gray-700">
        <p className="text-sm text-gray-400 font-medium mb-1">{label}</p>
        <p className="text-xs text-gray-500 mt-6 mb-6">데이터 없음</p>
      </div>
    );
  }

  const chartData = [
    { name: "긍정", value: data.positive, color: "#22c55e" },
    { name: "부정", value: data.negative, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const positiveRate = Math.round((data.positive / data.total) * 100);

  return (
    <div className="flex flex-col items-center bg-gray-800 rounded-xl p-4 border border-gray-700">
      <p className="text-sm text-gray-300 font-medium mb-1">{label}</p>
      <p className="text-xs text-gray-400 mb-2">총 {data.total}건 · 긍정 {positiveRate}%</p>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={65}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
            itemStyle={{ color: "#e5e7eb" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
