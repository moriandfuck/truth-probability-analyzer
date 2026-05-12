interface ReasoningDisplayProps {
  reasoning: string
}

export function ReasoningDisplay({ reasoning }: ReasoningDisplayProps) {
  const cleaned = reasoning
    .replace(/Thinking\.\.\./g, '')
    .replace(/done thinking\./g, '')
    .trim()

  if (!cleaned) {
    return (
      <div className="py-8 text-center text-gray-400">
        <p>No reasoning data available</p>
      </div>
    )
  }

  // Split by 【analysis】 / 【tend】 markers for formatting
  const parts = cleaned.split(/【(分析|倾向)】[:：]?\s*/i)

  return (
    <div className="prose prose-sm max-w-none">
      {parts.length > 1 ? (
        <div className="space-y-4">
          {parts.map((part, i) => {
            if (part === '分析' || part === '倾向') return null
            const label = i === 1 ? 'Analysis' : i === 3 ? 'Verdict' : null
            return (
              <div key={i}>
                {label && <div className="text-xs font-semibold text-gray-400 uppercase mb-1">{label}</div>}
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{part.trim()}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{cleaned}</p>
      )}
    </div>
  )
}
