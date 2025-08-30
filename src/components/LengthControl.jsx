export default function LengthControl({ length, onChange }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium">Length</h3>
          <p className="text-sm text-slate-400">Choose your password length</p>
        </div>
        <div className="font-mono text-lg bg-slate-900 border border-slate-700 rounded-md px-3 py-1">{length}</div>
      </div>
      <input
        type="range"
        min={6}
        max={64}
        value={length}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-indigo-500"
        aria-label="Password length"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>6</span>
        <span>64</span>
      </div>
    </div>
  );
}
