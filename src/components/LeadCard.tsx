import { Link } from "react-router-dom";
import { statusColors, statusLabels } from "../data";
import type { Lead } from "../types";

type LeadCardProps = {
  lead: Lead;
  compact?: boolean;
};

export function LeadCard({ lead, compact = false }: LeadCardProps) {
  return (
    <Link to={`/lead/${lead.id}`} className={compact ? "lead-card compact" : "lead-card"}>
      <div className="lead-card-top">
        <strong>{lead.nome}</strong>
        <span className={`status-pill ${statusColors[lead.status]}`}>{statusLabels[lead.status]}</span>
      </div>
      <p>{lead.telefone}</p>
      {lead.interesse ? <p className="muted">{lead.interesse}</p> : null}
    </Link>
  );
}
