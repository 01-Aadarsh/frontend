import { useEffect, useRef, useState } from "react";

/**
 * Ticks up in whole seconds while `active` is true, resets to 0 otherwise.
 *
 * Exists because real responses take 29-54s (see docs/API_CONTRACT.md) — a
 * bare spinner reads as broken after ~10s. Showing elapsed time keeps the
 * wait legible instead of looking hung.
 */
export function useElapsedSeconds(active: boolean): number {
  const [seconds, setSeconds] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setSeconds(0);
      startRef.current = null;
      return;
    }

    startRef.current = Date.now();
    const id = setInterval(() => {
      if (startRef.current !== null) {
        setSeconds(Math.floor((Date.now() - startRef.current) / 1000));
      }
    }, 250);

    return () => clearInterval(id);
  }, [active]);

  return seconds;
}
