import { useCallback, useEffect, useMemo, useState } from "react";
import PasswordDisplay from "./components/PasswordDisplay";
import LengthControl from "./components/LengthControl";
import OptionsPanel from "./components/OptionsPanel";
import StrengthMeter from "./components/StrengthMeter";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUM = "0123456789";
const SYM = "!@#$%^&*()_+[]{}|;:,.<>?/~-=`" + "'\\\"";

const SIMILAR = new Set(["l", "I", "1", "|", "o", "O", "0", "S", "5", "B", "8", "Z", "2"]);
const AMBIGUOUS = new Set(["{", "}", "[", "]", "(", ")", "/", "\\", "'", '"', "`", ",", ";", ":", ".", "<", ">", "~"]);

function filterChars(chars, { excludeSimilar, avoidAmbiguous }) {
  return [...chars]
    .filter((ch) => (excludeSimilar ? !SIMILAR.has(ch) : true))
    .filter((ch) => (avoidAmbiguous ? !AMBIGUOUS.has(ch) : true))
    .join("");
}

function estimateStrength(password, opts) {
  const { length } = opts;
  const poolSize =
    (opts.lowercase ? filterChars(LOWER, opts).length : 0) +
    (opts.uppercase ? filterChars(UPPER, opts).length : 0) +
    (opts.numbers ? filterChars(NUM, opts).length : 0) +
    (opts.symbols ? filterChars(SYM, opts).length : 0);

  // Rough entropy estimate: log2(pool^length) = length * log2(pool)
  const entropy = poolSize > 0 ? length * Math.log2(poolSize) : 0;

  // Map entropy to score 0-4
  let score = 0;
  if (entropy > 35) score = 1;
  if (entropy > 50) score = 2;
  if (entropy > 65) score = 3;
  if (entropy > 80) score = 4;

  // Penalize for missing variety when length is short
  const variety = [opts.lowercase, opts.uppercase, opts.numbers, opts.symbols].filter(Boolean).length;
  if (length < 10 && variety <= 1) score = Math.max(0, score - 1);

  return { entropy, score };
}

function usePassword(options) {
  const generate = useCallback((opts) => {
    const pools = [];
    const reqChars = [];

    const pushPool = (enabled, chars) => {
      if (!enabled) return;
      const filtered = filterChars(chars, opts);
      if (filtered.length > 0) {
        pools.push(filtered);
        // Ensure at least one from each selected class
        reqChars.push(filtered[Math.floor(Math.random() * filtered.length)]);
      }
    };

    pushPool(opts.lowercase, LOWER);
    pushPool(opts.uppercase, UPPER);
    pushPool(opts.numbers, NUM);
    pushPool(opts.symbols, SYM);

    const all = pools.join("");
    if (all.length === 0) return "";

    const remaining = opts.length - reqChars.length;
    const chars = [...reqChars];
    for (let i = 0; i < remaining; i++) {
      const ch = all[Math.floor(Math.random() * all.length)];
      chars.push(ch);
    }

    // Shuffle (Fisher-Yates)
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join("");
  }, []);

  const [password, setPassword] = useState("");

  const regenerate = useCallback(() => {
    setPassword(generate(options));
  }, [generate, options]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  return { password, regenerate };
}

export default function App() {
  const [options, setOptions] = useState({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: true,
    avoidAmbiguous: true,
  });

  // Ensure at least one character set enabled
  useEffect(() => {
    if (!options.lowercase && !options.uppercase && !options.numbers && !options.symbols) {
      setOptions((o) => ({ ...o, lowercase: true }));
    }
  }, [options.lowercase, options.uppercase, options.numbers, options.symbols]);

  const { password, regenerate } = usePassword(options);
  const strength = useMemo(() => estimateStrength(password, options), [password, options]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <header className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-2xl font-semibold tracking-tight">Password Generator</h1>
          <p className="text-slate-400 text-sm mt-1">Create strong, unique passwords with smart defaults and instant feedback.</p>
        </header>

        <main className="p-6 space-y-6">
          <PasswordDisplay
            password={password}
            onRegenerate={regenerate}
          />

          <StrengthMeter score={strength.score} entropy={strength.entropy} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LengthControl
              length={options.length}
              onChange={(len) => setOptions((o) => ({ ...o, length: len }))}
            />

            <OptionsPanel
              options={options}
              onChange={(partial) => setOptions((o) => ({ ...o, ...partial }))}
            />
          </div>
        </main>

        <footer className="px-6 py-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Tip: Use a unique password for every account and store them in a password manager.</span>
          <span className="font-medium">Entropy: {Math.round(strength.entropy)} bits</span>
        </footer>
      </div>
    </div>
  );
}
