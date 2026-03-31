import { LeadCard } from "./LeadCard";
import type { Lead } from "../types";

type LeadListProps = {
  leads: Lead[];
};

export function LeadList({ leads }: LeadListProps) {
  if (!leads.length) {
    return (
      <div className="empty-state">
        <h2>Nenhum lead ainda</h2>
        <p>Cadastre o primeiro contato para começar a organizar o funil.</p>
      </div>
    );
  }

  return (
    <div className="lead-list">
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
}
