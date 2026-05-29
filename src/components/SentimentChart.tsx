"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { CategorySentiment } from "@/services/aiService";
import { CATEGORY_LABELS, type CategoryKey } from "@/constants/categories";

const TOOLTIP_CONTENT_STYLE = { backgroundColor: "#1f2937", border: "none", borderRadius: "8px" };
const TOOLTIP_ITEM_STYLE = { color: "#e5e7eb" };
const LEGEND_WRAPPER_STYLE = { fontSize: "12px", color: "#9ca3af" };

interface Props {
  category: CategoryKey;
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
      <ResponsiveContainer width="100%" height={160} aria-label={`${label} 감성 분포 차트`}>
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
          <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} />
          <Legend wrapperStyle={LEGEND_WRAPPER_STYLE} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
