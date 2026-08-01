import type { SavedSignature } from "@/types/element";

const KEY = "saved-signatures";
const EVENT = "saved-signatures-changed";

let cache: SavedSignature[] | null = null;

const listeners = new Set<() => void>();

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT));
}

function readFromStorage(): SavedSignature[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function refresh() {
  cache = readFromStorage();
  for (const listener of listeners) listener();
}

function write(next: SavedSignature[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    emit();
  } catch {
    // Kuota localStorage penuh — abaikan, fitur tetap berjalan tanpa simpan.
  }
}

export function getSavedSignatures(): SavedSignature[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

export function subscribeToSavedSignatures(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", refresh);
  return () => {
    listeners.delete(listener);
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", refresh);
  };
}

export function saveSignature(item: SavedSignature): SavedSignature[] {
  const list = getSavedSignatures();
  const deduped = list.filter(
    (s) => !(s.type === item.type && s.data === item.data)
  );
  const next = [item, ...deduped].slice(0, 8);
  write(next);
  return next;
}

export function removeSignature(id: string): SavedSignature[] {
  const next = getSavedSignatures().filter((s) => s.id !== id);
  write(next);
  return next;
}
