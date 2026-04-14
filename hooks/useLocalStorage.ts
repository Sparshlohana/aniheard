"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(key);
      if (rawValue) {
        setValue(JSON.parse(rawValue) as T);
      }
    } catch {
      setValue(initialValue);
    } finally {
      setHasHydrated(true);
    }
  }, [initialValue, key]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write failures.
    }
  }, [hasHydrated, key, value]);

  return [value, setValue, hasHydrated] as const;
}
