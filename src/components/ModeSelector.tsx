import type { Mode } from "../types";

interface Props {
  value: Mode;
  onChange: (m: Mode) => void;
}

export function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["view", "control"] as Mode[]).map((m) => (
        <div
          key={m}
          className={`mode-card ${value === m ? "active" : "inactive"}`}
          onClick={() => onChange(m)}
        >
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              value === m ? "border-blue-500" : "border-slate-300"
            }`}
          >
            {value === m && (
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">
              {m === "view" ? "Lecture" : "Contrôle"}
            </p>
            <p className="text-[10px] text-slate-400">
              {m === "view" ? "Vue seule" : "Prise en main"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
