import { Header } from "../components/Header";
import { KanbanBoard } from "../components/KanbanBoard";
import { useLeads } from "../hooks/useLeads";
import { mudarStatus } from "../lib/leadsStorage";
import type { LeadStatus } from "../types";

export function FunnelPage() {
  const { leads, recarregar } = useLeads();

  function handleDropLead(leadId: number, status: LeadStatus) {
    mudarStatus(leadId, status);
    recarregar();
  }

  return (
    <div className="page">
      <Header title="Funil de Leads" actionLabel="Novo Lead" actionTo="/novo" />
      <section className="page-content">
        <KanbanBoard leads={leads} onDropLead={handleDropLead} />
      </section>
    </div>
  );
}
