/**
 * Persistance des favoris via localStorage (compatible Tauri WebView).
 * Pas besoin du plugin store Tauri — localStorage persiste dans le profil WebView2.
 */
import type { Favorite } from "./types";

const KEY = "hremote_favorites";

export function loadFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Favorite[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favs: Favorite[]): void {
  localStorage.setItem(KEY, JSON.stringify(favs));
}

export function addFavorite(fav: Favorite): Favorite[] {
  const favs = loadFavorites();
  const updated = [...favs, fav];
  saveFavorites(updated);
  return updated;
}

export function removeFavorite(id: string): Favorite[] {
  const favs = loadFavorites().filter((f) => f.id !== id);
  saveFavorites(favs);
  return favs;
}

export function updateFavorite(id: string, patch: Partial<Favorite>): Favorite[] {
  const favs = loadFavorites().map((f) => (f.id === id ? { ...f, ...patch } : f));
  saveFavorites(favs);
  return favs;
}

export function generateId(): string {
  return crypto.randomUUID();
}
