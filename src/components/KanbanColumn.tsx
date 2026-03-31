import { statusColors, statusLabels } from "../data";
import { LeadCard } from "./LeadCard";
import type { Lead, LeadStatus } from "../types";

type KanbanColumnProps = {
  status: LeadStatus;
  leads: Lead[];
  onDropLead: (leadId: number, status: LeadStatus) => void;
};

export function KanbanColumn({ status, leads, onDropLead }: KanbanColumnProps) {
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const leadId = Number(event.dataTransfer.getData("text/plain"));

    if (!Number.isNaN(leadId)) {
      onDropLead(leadId, status);
    }
  }

  return (
    <section
      className="kanban-column"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <span className={`status-dot ${statusColors[status]}`} />
        <strong>{statusLabels[status]}</strong>
        <small>{leads.length}</small>
      </div>
      <div className="kanban-column-body">
        {leads.length ? (
          leads.map((lead) => (
            <div
              key={lead.id}
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", String(lead.id))}
            >
              <LeadCard lead={lead} compact />
            </div>
          ))
        ) : (
          <div className="kanban-empty">Arraste um lead para ca.</div>
        )}
      </div>
    </section>
  );
}
