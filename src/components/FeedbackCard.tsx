const RANK_COLORS = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-gray-500"];

interface Props {
  rank: number;
  priority: string;
}

export default function FeedbackCard({ rank, priority }: Props) {
  const color = RANK_COLORS[rank - 1] ?? RANK_COLORS[RANK_COLORS.length - 1];

  return (
    <div className="flex items-start gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
      <span
        className={`${color} text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0`}
      >
        {rank}
      </span>
      <p className="text-gray-200 text-sm leading-relaxed">{priority}</p>
    </div>
  );
}
