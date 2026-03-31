import { useCallback, useEffect, useState } from "react";
import { carregarLeads } from "../lib/leadsStorage";
import type { Lead } from "../types";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => carregarLeads());

  const recarregar = useCallback(() => {
    setLeads(carregarLeads());
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key) {
        recarregar();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [recarregar]);

  return { leads, recarregar };
}
