export default function OptionsPanel({ options, onChange }) {
  const Toggle = ({ label, checked, onCheckedChange, description }) => (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/40 cursor-pointer border border-transparent hover:border-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500"
      />
      <div>
        <div className="font-medium leading-none">{label}</div>
        {description ? <div className="text-xs text-slate-400 mt-1">{description}</div> : null}
      </div>
    </label>
  );

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <h3 className="font-medium mb-3">Character set</h3>
      <div className="grid grid-cols-1 gap-1">
        <Toggle
          label="Lowercase (a-z)"
          checked={options.lowercase}
          onCheckedChange={(v) => onChange({ lowercase: v })}
        />
        <Toggle
          label="Uppercase (A-Z)"
          checked={options.uppercase}
          onCheckedChange={(v) => onChange({ uppercase: v })}
        />
        <Toggle
          label="Numbers (0-9)"
          checked={options.numbers}
          onCheckedChange={(v) => onChange({ numbers: v })}
        />
        <Toggle
          label="Symbols (!@#…)"
          checked={options.symbols}
          onCheckedChange={(v) => onChange({ symbols: v })}
        />
      </div>

      <h3 className="font-medium mt-4 mb-3">Filters</h3>
      <div className="grid grid-cols-1 gap-1">
        <Toggle
          label="Exclude similar characters"
          description="Avoid characters like 0/O and l/1 to reduce confusion"
          checked={options.excludeSimilar}
          onCheckedChange={(v) => onChange({ excludeSimilar: v })}
        />
        <Toggle
          label="Avoid ambiguous symbols"
          description="Exclude brackets, quotes, slashes, and similar"
          checked={options.avoidAmbiguous}
          onCheckedChange={(v) => onChange({ avoidAmbiguous: v })}
        />
      </div>
    </div>
  );
}
