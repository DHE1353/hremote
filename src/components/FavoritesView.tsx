import { useState } from "react";
import type { Favorite, Mode, Status } from "../types";
import { ModeSelector } from "./ModeSelector";
import { launchRustDesk, formatId } from "../rustdesk";
import { removeFavorite, updateFavorite } from "../storage";

interface Props {
  favorites: Favorite[];
  onUpdate: (favs: Favorite[]) => void;
}

interface ConnectingState {
  id: string;
  status: Status;
  error?: string;
}

export function FavoritesView({ favorites, onUpdate }: Props) {
  const [connecting, setConnecting] = useState<ConnectingState | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function handleConnect(fav: Favorite, mode: Mode) {
    setConnecting({ id: fav.id, status: "connecting" });
    try {
      await launchRustDesk(fav.machineId, mode);
      setConnecting({ id: fav.id, status: "success" });
      setTimeout(() => setConnecting(null), 2500);
    } catch {
      setConnecting({
        id: fav.id,
        status: "error",
        error: "RustDesk introuvable",
      });
      setTimeout(() => setConnecting(null), 3000);
    }
  }

  function handleDelete(id: string) {
    const updated = removeFavorite(id);
    onUpdate(updated);
  }

  function handleModeChange(fav: Favorite, mode: Mode) {
    const updated = updateFavorite(fav.id, { defaultMode: mode });
    onUpdate(updated);
  }

  function startEdit(fav: Favorite) {
    setEditingId(fav.id);
    setEditName(fav.name);
  }

  function saveEdit(id: string) {
    if (!editName.trim()) return;
    const updated = updateFavorite(id, { name: editName.trim() });
    onUpdate(updated);
    setEditingId(null);
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-8">
        <div className="text-4xl">⭐</div>
        <p className="text-sm font-medium text-slate-600">Aucun favori</p>
        <p className="text-xs text-slate-400 max-w-[200px]">
          Entrez un ID dans l'onglet Connexion et cliquez sur ★ pour ajouter une machine.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      {favorites.map((fav) => {
        const state = connecting?.id === fav.id ? connecting : null;
        const isConnecting = state?.status === "connecting";
        const isSuccess = state?.status === "success";
        const isError = state?.status === "error";
        const isEditing = editingId === fav.id;

        return (
          <div
            key={fav.id}
            className={`rounded-xl border-2 p-3 transition-all duration-150 ${
              isSuccess
                ? "border-green-400 bg-green-50"
                : isError
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {/* En-tête */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex gap-1">
                    <input
                      className="input-field !py-1 !text-xs !tracking-normal !font-sans flex-1"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(fav.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(fav.id)}
                      className="px-2 py-1 rounded-lg bg-blue-500 text-white text-xs font-semibold"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <p
                      className="text-sm font-semibold text-slate-800 truncate cursor-pointer hover:text-blue-500"
                      onClick={() => startEdit(fav)}
                      title="Cliquer pour renommer"
                    >
                      {fav.name}
                    </p>
                  </div>
                )}
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {formatId(fav.machineId)}
                </p>
              </div>

              {/* Bouton supprimer */}
              <button
                onClick={() => handleDelete(fav.id)}
                className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50"
                title="Supprimer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sélecteur de mode compact */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {(["view", "control"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(fav, m)}
                  className={`text-[10px] font-semibold py-1.5 rounded-lg border transition-all ${
                    fav.defaultMode === m
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {m === "view" ? "👁 Lecture" : "🖱 Contrôle"}
                </button>
              ))}
            </div>

            {/* Bouton connexion */}
            <button
              onClick={() => handleConnect(fav, fav.defaultMode)}
              disabled={isConnecting}
              className={`w-full py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isSuccess
                  ? "bg-green-500 text-white"
                  : isError
                  ? "bg-red-400 text-white"
                  : "bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white disabled:opacity-50"
              }`}
            >
              {isConnecting ? (
                <span className="flex items-center justify-center gap-1.5">
                  <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Connexion…
                </span>
              ) : isSuccess ? (
                "✓ Lancé !"
              ) : isError ? (
                state?.error ?? "Erreur"
              ) : (
                "Se connecter"
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
