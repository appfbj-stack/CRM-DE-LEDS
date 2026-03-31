import type { LeadCor, LeadEtiqueta, LeadStatus } from "./types";

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

export const etiquetaOrder: LeadEtiqueta[] = ["quente", "frio", "urgente", "vip", "retorno"];

export const etiquetaLabels: Record<LeadEtiqueta, string> = {
  quente: "Quente",
  frio: "Frio",
  urgente: "Urgente",
  vip: "VIP",
  retorno: "Retorno",
};

export const etiquetaColors: Record<LeadEtiqueta, string> = {
  quente: "tag-quente",
  frio: "tag-frio",
  urgente: "tag-urgente",
  vip: "tag-vip",
  retorno: "tag-retorno",
};

export const corOrder: LeadCor[] = ["azul", "verde", "roxo", "laranja", "vermelho", "grafite"];

export const corLabels: Record<LeadCor, string> = {
  azul: "Azul",
  verde: "Verde",
  roxo: "Roxo",
  laranja: "Laranja",
  vermelho: "Vermelho",
  grafite: "Grafite",
};
