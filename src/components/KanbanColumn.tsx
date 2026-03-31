import { statusColors, statusLabels } from "../data";
import { LeadCard } from "./LeadCard";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Lead, LeadStatus } from "../types";

type KanbanColumnProps = {
  status: LeadStatus;
  leads: Lead[];
  draggingLeadId: number | null;
  isActiveDropzone: boolean;
};

export function KanbanColumn({
  status,
  leads,
  draggingLeadId,
  isActiveDropzone,
}: KanbanColumnProps) {
  const droppableId = `col-${status}`;
  const { setNodeRef } = useDroppable({
    id: droppableId,
    data: { type: "column", status },
  });

  return (
    <section
      className={isActiveDropzone ? `kanban-column ${statusColors[status]} drop-active` : "kanban-column"}
      ref={setNodeRef}
    >
      <div className="kanban-column-header">
        <span className={`status-dot ${statusColors[status]}`} />
        <strong>{statusLabels[status]}</strong>
        <small>{leads.length}</small>
      </div>
      <div className="kanban-column-body">
        {leads.length ? (
          leads.map((lead) => (
            <KanbanDraggableCard
              key={lead.id}
              lead={lead}
              isDraggingLead={draggingLeadId === lead.id}
            />
          ))
        ) : (
          <div className="kanban-empty">Arraste um lead para cá.</div>
        )}
      </div>
    </section>
  );
}

type KanbanDraggableCardProps = {
  lead: Lead;
  isDraggingLead: boolean;
};

function KanbanDraggableCard({ lead, isDraggingLead }: KanbanDraggableCardProps) {
  const draggableId = `lead-${lead.id}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggableId,
    data: { type: "lead", leadId: lead.id, status: lead.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : ("transform 160ms ease" as const),
    touchAction: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDraggingLead || isDragging ? "kanban-card-wrapper dragging" : "kanban-card-wrapper"}
      {...attributes}
      {...listeners}
    >
      <LeadCard lead={lead} compact />
    </div>
  );
}
