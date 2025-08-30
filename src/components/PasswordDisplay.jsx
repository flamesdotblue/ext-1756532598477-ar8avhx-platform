import { useEffect, useState } from "react";
import { Copy, Check, RefreshCw, Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordDisplay({ password, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [password]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // no-op
    }
  };

  const display = reveal ? password : password.replace(/./g, "•");

  return (
    <div className="group/box bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center gap-3 focus-within:ring-2 ring-slate-500 transition">
      <div className="shrink-0 text-slate-400"><Lock size={18} /></div>
      <div className="flex-1">
        <div className="font-mono text-lg tracking-wider select-all break-all" aria-live="polite">{display || ""}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setReveal((v) => !v)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600 focus:outline-none focus-visible:ring-2 ring-slate-500"
          aria-label={reveal ? "Hide password" : "Show password"}
        >
          {reveal ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600 focus:outline-none focus-visible:ring-2 ring-slate-500"
          aria-label="Copy password"
        >
          {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 focus:outline-none focus-visible:ring-2 ring-indigo-400"
        >
          <RefreshCw size={18} />
          <span className="hidden sm:inline">Generate</span>
        </button>
      </div>
    </div>
  );
}
