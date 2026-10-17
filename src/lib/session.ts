/**
 * The path of the very first document load in this browser tab.
 * Evaluated once, when the root layout's client bundle first loads.
 */
export const initialPathname: string | null = typeof window !== "undefined" ? window.location.pathname : null;
