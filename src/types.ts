export type LeadStatus = "novo" | "contato" | "visita" | "proposta" | "fechado";

export type Lead = {
  id: number;
  nome: string;
  telefone: string;
  interesse?: string;
  observacao?: string;
  status: LeadStatus;
  criadoEm: string;
};
