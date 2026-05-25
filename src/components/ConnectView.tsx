import { useState } from "react";
import type { Favorite, Mode, Status } from "../types";
import { ModeSelector } from "./ModeSelector";
import { launchRustDesk, formatId } from "../rustdesk";
import { addFavorite, generateId } from "../storage";

interface Props {
  onFavoritesAdded: (favs: Favorite[]) => void;
}

export function ConnectView({ onFavoritesAdded }: Props) {
  const [rawId, setRawId] = useState("");
  const [mode, setMode] = useState<Mode>("control");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState("");

  const displayId = formatId(rawId);
  const cleanId = rawId.replace(/\D/g, "");
  const isReady = cleanId.length >= 6;

  async function handleConnect() {
    if (!isReady) return;
    setStatus("connecting");
    setErrorMsg("");
    try {
      await launchRustDesk(cleanId, mode);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setErrorMsg("Impossible de lancer RustDesk. Vérifiez qu'il est bien installé.");
    }
  }

  function handleSave() {
    if (!saveName.trim() || !isReady) return;
    const fav: Favorite = {
      id: generateId(),
      name: saveName.trim(),
      machineId: cleanId,
      defaultMode: mode,
      addedAt: Date.now(),
    };
    const updated = addFavorite(fav);
    onFavoritesAdded(updated);
    setShowSave(false);
    setSaveName("");
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
          <img src="/logo.png" alt="HRemote" className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            HRemote
          </h1>
          <p className="text-[11px] text-slate-400">Prise en main à distance sécurisée</p>
        </div>
      </div>

      {/* Champ ID */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          ID de la machine
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="123 456 789"
            value={displayId}
            onChange={(e) => setRawId(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            maxLength={11}
            autoFocus
          />
          {/* Bouton ajouter aux favoris */}
          {isReady && (
            <button
              type="button"
              title="Ajouter aux favoris"
              onClick={() => setShowSave((v) => !v)}
              className={`px-3 rounded-xl border-2 transition-all duration-150 ${
                showSave
                  ? "border-blue-500 bg-blue-50 text-blue-500"
                  : "border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-300 hover:text-blue-400"
              }`}
            >
              ★
            </button>
          )}
        </div>

        {/* Panel sauvegarde favoris */}
        {showSave && isReady && (
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              className="input-field flex-1 !tracking-normal !font-sans"
              placeholder="Nom de la machine (ex: PC David)"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-semibold
                         disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-600 hover:to-violet-600 transition-all"
            >
              OK
            </button>
          </div>
        )}
      </div>

      {/* Mode */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Mode d'accès
        </label>
        <ModeSelector value={mode} onChange={setMode} />
      </div>

      {/* Bouton connexion */}
      <button
        className="btn-primary"
        onClick={handleConnect}
        disabled={!isReady || status === "connecting"}
      >
        {status === "connecting" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Connexion…
          </span>
        ) : status === "success" ? (
          "✓ RustDesk lancé !"
        ) : (
          "Se connecter"
        )}
      </button>

      {status === "error" && (
        <p className="text-xs text-red-500 text-center -mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
