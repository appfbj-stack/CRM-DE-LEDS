import { STORAGE_KEY } from "../config";
import { corOrder, etiquetaOrder, statusOrder } from "../data";
import type { Lead, LeadCampoExtra, LeadCor, LeadEtiqueta, LeadEtiquetaCustom, LeadStatus } from "../types";

function sortLeads(leads: Lead[]) {
  return [...leads].sort((a, b) => {
    const dateDiff = new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
    return dateDiff !== 0 ? dateDiff : b.id - a.id;
  });
}

function normalizarEtiquetas(raw: unknown): LeadEtiqueta[] {
  const etiquetas = Array.isArray(raw) ? raw : [];
  return etiquetas
    .map((value) => String(value) as LeadEtiqueta)
    .filter((value): value is LeadEtiqueta => etiquetaOrder.includes(value));
}

function normalizarCamposExtras(raw: unknown): LeadCampoExtra[] {
  const campos = Array.isArray(raw) ? raw : [];
  return campos
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const chave = String((item as { chave?: unknown }).chave ?? "").trim();
      const valor = String((item as { valor?: unknown }).valor ?? "").trim();

      if (!chave && !valor) {
        return null;
      }

      return { chave, valor };
    })
    .filter((item): item is LeadCampoExtra => Boolean(item?.chave));
}

function normalizarStatus(raw: unknown): LeadStatus {
  const status = String(raw) as LeadStatus;
  return statusOrder.includes(status) ? status : "novo";
}

function normalizarCor(raw: unknown): LeadCor {
  const cor = String(raw) as LeadCor;
  return corOrder.includes(cor) ? cor : "azul";
}

function normalizarEtiquetaCustomNome(raw: unknown) {
  return String(raw ?? "")
    .trim()
    .slice(0, 24);
}

function normalizarEtiquetasCustom(raw: unknown): LeadEtiquetaCustom[] {
  const etiquetas = Array.isArray(raw) ? raw : [];
  const normalizadas = etiquetas
    .map((value) => {
      if (typeof value === "string") {
        const nome = normalizarEtiquetaCustomNome(value);
        return nome ? { nome, cor: "grafite" as const } : null;
      }

      if (!value || typeof value !== "object") {
        return null;
      }

      const nome = normalizarEtiquetaCustomNome((value as { nome?: unknown }).nome);
      if (!nome) {
        return null;
      }

      return { nome, cor: normalizarCor((value as { cor?: unknown }).cor) };
    })
    .filter((item): item is LeadEtiquetaCustom => Boolean(item?.nome));

  const seen = new Set<string>();
  const unique: LeadEtiquetaCustom[] = [];
  for (const item of normalizadas) {
    const key = item.nome.toLocaleLowerCase("pt-BR");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }

  return unique.slice(0, 8);
}

export function carregarLeads(): Lead[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    const leads = Array.isArray(parsed) ? parsed : [];
    const normalizados = leads
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const lead = item as Partial<Lead>;
        const id = Number(lead.id);

        if (Number.isNaN(id)) {
          return null;
        }

        const criadoEm = typeof lead.criadoEm === "string" ? lead.criadoEm : new Date().toISOString();

        return {
          id,
          nome: String(lead.nome ?? "").trim(),
          telefone: String(lead.telefone ?? "").trim(),
          interesse: String(lead.interesse ?? "").trim(),
          observacao: String(lead.observacao ?? "").trim(),
          status: normalizarStatus(lead.status),
          cor: normalizarCor(lead.cor),
          etiquetas: normalizarEtiquetas(lead.etiquetas),
          etiquetasCustom: normalizarEtiquetasCustom((lead as Partial<Lead>).etiquetasCustom),
          camposExtras: normalizarCamposExtras(lead.camposExtras),
          criadoEm,
        } satisfies Lead;
      })
      .filter((lead): lead is Lead => Boolean(lead?.nome && lead?.telefone));

    return sortLeads(normalizados);
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
    cor: normalizarCor(dados.cor),
    etiquetas: normalizarEtiquetas(dados.etiquetas),
    etiquetasCustom: normalizarEtiquetasCustom(dados.etiquetasCustom),
    camposExtras: normalizarCamposExtras(dados.camposExtras),
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
          status: dados.status ? normalizarStatus(dados.status) : lead.status,
          cor: dados.cor ? normalizarCor(dados.cor) : lead.cor,
          etiquetas: dados.etiquetas ? normalizarEtiquetas(dados.etiquetas) : lead.etiquetas ?? [],
          etiquetasCustom: dados.etiquetasCustom
            ? normalizarEtiquetasCustom(dados.etiquetasCustom)
            : lead.etiquetasCustom ?? [],
          camposExtras: dados.camposExtras ? normalizarCamposExtras(dados.camposExtras) : lead.camposExtras ?? [],
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
