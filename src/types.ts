export type Mode = "view" | "control";
export type Status = "idle" | "connecting" | "error" | "success";
export type View = "connect" | "favorites";

export interface Favorite {
  id: string;        // UUID local
  name: string;      // Nom affiché (ex: "PC Bureau David")
  machineId: string; // ID RustDesk (9 chiffres)
  defaultMode: Mode;
  addedAt: number;   // timestamp
}
