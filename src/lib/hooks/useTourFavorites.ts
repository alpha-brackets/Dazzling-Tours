"use client";
import { useCallback, useSyncExternalStore } from "react";

/**
 * Favourited tour ids, backed by localStorage.
 *
 * localStorage is an external store, so it is read through useSyncExternalStore
 * rather than copied into state by a mount effect. That matters for two reasons:
 *
 *  - Hydration. The server has no localStorage, so the server snapshot is empty
 *    and React knows to render that first and re-render once mounted. Reading
 *    localStorage in a useState initialiser instead would make the first client
 *    render disagree with the server HTML.
 *  - Consistency. Every component using this hook — and every browser tab —
 *    sees the same value, because they all read the one store.
 */

const STORAGE_KEY = "tourFavorites";
const CHANGE_EVENT = "tour-favorites-change";

/** Stable empty array so snapshots can be compared by reference. */
const EMPTY: string[] = [];

// getSnapshot must return a referentially stable value while the underlying
// data is unchanged, or React re-renders forever. The parsed result is cached
// and only recomputed when the raw string actually differs.
let cachedRaw: string | null = null;
let cachedValue: string[] = EMPTY;

const readFavorites = (): string[] => {
  let raw: string | null = null;

  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can throw when blocked (private mode, disabled cookies).
    return EMPTY;
  }

  if (raw === cachedRaw) {
    return cachedValue;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedValue = EMPTY;
    return cachedValue;
  }

  try {
    const parsed = JSON.parse(raw);
    cachedValue = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }

  return cachedValue;
};

const subscribe = (onStoreChange: () => void) => {
  // "storage" covers other tabs; the custom event covers this one, since
  // localStorage.setItem does not notify the tab that made the change.
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
};

const getServerSnapshot = (): string[] => EMPTY;

export const useTourFavorites = () => {
  const favorites = useSyncExternalStore(
    subscribe,
    readFavorites,
    getServerSnapshot,
  );

  const toggleFavorite = useCallback((tourId: string) => {
    const current = readFavorites();
    const next = current.includes(tourId)
      ? current.filter((id) => id !== tourId)
      : [...current, tourId];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Nothing useful to do if storage is unavailable.
      return;
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const isFavorite = useCallback(
    (tourId: string) => favorites.includes(tourId),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
};
