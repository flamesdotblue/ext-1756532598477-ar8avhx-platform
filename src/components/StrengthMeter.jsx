const COLORS = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-emerald-500",
];

function labelForScore(score) {
  switch (score) {
    case 0:
      return "Very Weak";
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Strong";
    case 4:
      return "Excellent";
    default:
      return "";
  }
}

export default function StrengthMeter({ score, entropy }) {
  const activeColor = COLORS[Math.min(score, COLORS.length - 1)];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Strength</h3>
        <div className="text-sm text-slate-400">{labelForScore(score)}</div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${i <= score ? activeColor : "bg-slate-700"}`}
          />
        ))}
      </div>
      <div className="text-xs text-slate-500 mt-2">Approx. entropy {Math.round(entropy)} bits</div>
    </div>
  );
}
