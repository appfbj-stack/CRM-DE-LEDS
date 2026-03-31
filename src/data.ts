import { STORAGE_KEY } from "./config";
import type { LeadStatus } from "./types";

export const statusOrder: LeadStatus[] = ["novo", "contato", "visita", "proposta", "fechado"];

export const statusLabels: Record<LeadStatus, string> = {
  novo: "Novo",
  contato: "Contato",
  visita: "Visita",
  proposta: "Proposta",
  fechado: "Fechado",
};

export const statusColors: Record<LeadStatus, string> = {
  novo: "status-novo",
  contato: "status-contato",
  visita: "status-visita",
  proposta: "status-proposta",
  fechado: "status-fechado",
};
