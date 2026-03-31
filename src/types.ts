export type LeadStatus = "novo" | "contato" | "visita" | "proposta" | "fechado";

export type LeadEtiqueta = "quente" | "frio" | "urgente" | "vip" | "retorno";

export type LeadCor = "azul" | "verde" | "roxo" | "laranja" | "vermelho" | "grafite";

export type LeadEtiquetaCustom = {
  nome: string;
  cor: LeadCor;
};

export type LeadCampoExtra = {
  chave: string;
  valor: string;
};

export type Lead = {
  id: number;
  nome: string;
  telefone: string;
  interesse: string;
  observacao: string;
  status: LeadStatus;
  cor: LeadCor;
  etiquetas: LeadEtiqueta[];
  etiquetasCustom: LeadEtiquetaCustom[];
  camposExtras: LeadCampoExtra[];
  criadoEm: string;
};
