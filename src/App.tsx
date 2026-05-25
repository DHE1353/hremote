import { useState } from "react";
import type { Favorite, View } from "./types";
import { loadFavorites } from "./storage";
import { ConnectView } from "./components/ConnectView";
import { FavoritesView } from "./components/FavoritesView";

export default function App() {
  const [view, setView] = useState<View>("connect");
  const [favorites, setFavorites] = useState<Favorite[]>(loadFavorites);

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* Barre titre draggable */}
      <div
        data-tauri-drag-region
        className="h-10 flex items-center px-4 gap-2 bg-white border-b border-slate-100 flex-shrink-0"
      >
        <img src="/logo.png" alt="HRemote" className="w-5 h-5" />
        <span className="text-xs font-semibold text-slate-600 tracking-wide">
          HRemote
        </span>
        <span className="ml-auto text-xs text-slate-300">by Hsasoft</span>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-slate-100 flex-shrink-0">
        <button
          onClick={() => setView("connect")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-all duration-150 ${
            view === "connect"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          🔌 Connexion
        </button>
        <button
          onClick={() => setView("favorites")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-all duration-150 relative ${
            view === "favorites"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          ⭐ Favoris
          {favorites.length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-[9px] font-bold">
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {view === "connect" ? (
          <ConnectView
            onFavoritesAdded={(favs) => {
              setFavorites(favs);
              // Bascule sur l'onglet favoris après ajout
              setView("favorites");
            }}
          />
        ) : (
          <FavoritesView
            favorites={favorites}
            onUpdate={setFavorites}
          />
        )}
      </div>

      {/* Footer */}
      <div className="h-7 flex items-center justify-center border-t border-slate-100 flex-shrink-0">
        <p className="text-[10px] text-slate-300">
          82.29.178.71 · HRemote v1.0
        </p>
      </div>
    </div>
  );
}
