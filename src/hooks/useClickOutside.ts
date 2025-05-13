import { useEffect, useRef } from "react";

export function useClickOutside(callback: (event: MouseEvent) => void) {
  const callbackRef = useRef<(event: MouseEvent) => void>(callback);
  const innerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (innerRef.current && callbackRef.current && !innerRef.current.contains(event.target as Node)) {
        callbackRef.current(event);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return innerRef;
}