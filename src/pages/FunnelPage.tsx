import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { KanbanBoard } from "../components/KanbanBoard";
import { useLeads } from "../hooks/useLeads";
import { mudarStatus } from "../lib/leadsStorage";
import { corLabels, corOrder } from "../data";
import type { LeadCor, LeadStatus } from "../types";

export function FunnelPage() {
  const { leads, recarregar } = useLeads();
  const [filtroCor, setFiltroCor] = useState<LeadCor | "todas">("todas");

  const leadsFiltrados = useMemo(() => {
    if (filtroCor === "todas") {
      return leads;
    }
    return leads.filter((lead) => lead.cor === filtroCor);
  }, [filtroCor, leads]);

  function handleDropLead(leadId: number, status: LeadStatus) {
    mudarStatus(leadId, status);
    recarregar();
  }

  return (
    <div className="page">
      <Header title="Funil de Leads" actionLabel="Novo Lead" actionTo="/novo" />
      <section className="page-content">
        <div className="filter-bar">
          <button
            type="button"
            className={filtroCor === "todas" ? "filter-chip active" : "filter-chip"}
            onClick={() => setFiltroCor("todas")}
          >
            Todos
          </button>
          {corOrder.map((cor) => (
            <button
              key={cor}
              type="button"
              className={filtroCor === cor ? "filter-chip active" : "filter-chip"}
              data-cor={cor}
              onClick={() => setFiltroCor(cor)}
            >
              <span className="filter-swatch" data-cor={cor} />
              {corLabels[cor]}
            </button>
          ))}
        </div>

        <KanbanBoard leads={leadsFiltrados} onDropLead={handleDropLead} />
      </section>
    </div>
  );
}
