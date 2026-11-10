import { useEffect, useState } from "react";

/** Simulates sensor updates: increments a reading every few seconds. Swap for a websocket/API later. */
export function useLiveReading(initial: number, intervalMs = 5000) {
  const [value, setValue] = useState(initial);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  useEffect(() => {
    setUpdatedAt(new Date());
    const id = setInterval(() => {
      setValue((v) => v + Math.round(Math.random() * 3));
      setUpdatedAt(new Date());
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return { value, updatedAt };
}
