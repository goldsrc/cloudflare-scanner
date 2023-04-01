import { type State } from "swr";
const CACHE_KEY = "swr-cache";
export const localStorageProvider = () => {
  const isServer = typeof window === "undefined";
  const localStorageData: unknown = JSON.parse(
    (!isServer && localStorage.getItem(CACHE_KEY)) || "[]"
  );

  const map = new Map<string, State<unknown, unknown> | undefined>(
    Array.isArray(localStorageData) ? localStorageData : []
  );

  if (!isServer) {
    // Before unloading the app, we write back all the data into `localStorage`.
    window.addEventListener("beforeunload", () => {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem(CACHE_KEY, appCache);
    });
  }

  // We still use the map for write & read for performance.
  return map;
};
