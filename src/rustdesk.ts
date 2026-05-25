import { Command } from "@tauri-apps/plugin-shell";
import type { Mode } from "./types";

const SERVER_ID = "82.29.178.71";
const SERVER_KEY = "NRn5b6AAO1Vts7n0DwTeExSFeTz0Dh+pazl15e3DS9Q=";

export async function launchRustDesk(machineId: string, mode: Mode): Promise<void> {
  const args = [
    "--connect", machineId,
    "--id-server", SERVER_ID,
    "--relay-server", SERVER_ID,
    "--key", SERVER_KEY,
  ];
  if (mode === "view") {
    args.push("--view-only");
  }
  const cmd = Command.create("rustdesk", args);
  await cmd.spawn();
}

export function formatId(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}
