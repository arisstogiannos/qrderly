"use client";
import { useRef, useCallback,useState, useEffect } from "react";

export const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return [debouncedValue];
};
