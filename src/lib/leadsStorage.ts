import { STORAGE_KEY } from "../config";
import type { Lead, LeadStatus } from "../types";

function sortLeads(leads: Lead[]) {
  return [...leads].sort((a, b) => {
    const dateDiff = new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
    return dateDiff !== 0 ? dateDiff : b.id - a.id;
  });
}

export function carregarLeads(): Lead[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Lead[];
    return sortLeads(parsed);
  } catch {
    return [];
  }
}

export function salvarLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortLeads(leads)));
}

export function criarLead(dados: Omit<Lead, "id" | "status" | "criadoEm">): Lead {
  const leads = carregarLeads();
  const novoLead: Lead = {
    id: Date.now(),
    nome: dados.nome.trim(),
    telefone: dados.telefone.trim(),
    interesse: dados.interesse?.trim() || "",
    observacao: dados.observacao?.trim() || "",
    status: "novo",
    criadoEm: new Date().toISOString(),
  };

  salvarLeads([novoLead, ...leads]);
  return novoLead;
}

export function atualizarLead(id: number, dados: Partial<Omit<Lead, "id" | "criadoEm">>) {
  const leads = carregarLeads();
  const atualizados = leads.map((lead) =>
    lead.id === id
      ? {
          ...lead,
          ...dados,
          nome: dados.nome?.trim() ?? lead.nome,
          telefone: dados.telefone?.trim() ?? lead.telefone,
          interesse: dados.interesse?.trim() ?? lead.interesse,
          observacao: dados.observacao?.trim() ?? lead.observacao,
        }
      : lead,
  );

  salvarLeads(atualizados);
}

export function excluirLead(id: number) {
  const leads = carregarLeads().filter((lead) => lead.id !== id);
  salvarLeads(leads);
}

export function mudarStatus(id: number, status: LeadStatus) {
  atualizarLead(id, { status });
}
