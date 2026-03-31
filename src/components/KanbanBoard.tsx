import { statusOrder } from "../data";
import { KanbanColumn } from "./KanbanColumn";
import type { Lead, LeadStatus } from "../types";

type KanbanBoardProps = {
  leads: Lead[];
  onDropLead: (leadId: number, status: LeadStatus) => void;
};

export function KanbanBoard({ leads, onDropLead }: KanbanBoardProps) {
  return (
    <div className="kanban-board">
      {statusOrder.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          leads={leads.filter((lead) => lead.status === status)}
          onDropLead={onDropLead}
        />
      ))}
    </div>
  );
}
