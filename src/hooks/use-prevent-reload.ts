"use client";
import { useEffect } from "react";

export function usePreventRefresh(
  message = "Changes you made may not be saved. Are you sure you want to leave?",
  shouldPrevent = true
) {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        event.preventDefault();
        event.returnValue = message; // Required for most browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message,shouldPrevent]);
}
