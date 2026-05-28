interface Props {
  quotes: string[];
}

export default function ReviewSample({ quotes }: Props) {
  if (quotes.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">AI가 선별한 유저 발언입니다.</p>
      {quotes.map((quote, i) => (
        <blockquote
          key={i}
          className="border-l-4 border-blue-500 pl-4 bg-gray-800 rounded-r-xl p-3"
        >
          <p className="text-gray-300 text-sm italic">&ldquo;{quote}&rdquo;</p>
        </blockquote>
      ))}
    </div>
  );
}
