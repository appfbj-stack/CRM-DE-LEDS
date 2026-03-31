import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { statusLabels, statusOrder } from "../data";
import { KanbanColumn } from "./KanbanColumn";
import { LeadCard } from "./LeadCard";
import type { Lead, LeadStatus } from "../types";

type KanbanBoardProps = {
  leads: Lead[];
  onDropLead: (leadId: number, status: LeadStatus) => void;
};

export function KanbanBoard({ leads, onDropLead }: KanbanBoardProps) {
  const [draggingLeadId, setDraggingLeadId] = useState<number | null>(null);
  const [activeColumn, setActiveColumn] = useState<LeadStatus | null>(null);
  const [lastMove, setLastMove] = useState<{ nome: string; status: LeadStatus } | null>(null);

  const draggingLead = useMemo(
    () => leads.find((lead) => lead.id === draggingLeadId) ?? null,
    [draggingLeadId, leads],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 160, tolerance: 8 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const leadId = event.active.data.current?.leadId as number | undefined;
    if (typeof leadId === "number") {
      setDraggingLeadId(leadId);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const status = event.over?.data.current?.status as LeadStatus | undefined;
    setActiveColumn(status ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const leadId = event.active.data.current?.leadId as number | undefined;
    const nextStatus = event.over?.data.current?.status as LeadStatus | undefined;

    if (typeof leadId === "number" && nextStatus) {
      const movedLead = leads.find((lead) => lead.id === leadId);
      if (movedLead && movedLead.status !== nextStatus) {
        onDropLead(leadId, nextStatus);
        setLastMove({ nome: movedLead.nome, status: nextStatus });
      }
    }

    setDraggingLeadId(null);
    setActiveColumn(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setDraggingLeadId(null);
        setActiveColumn(null);
      }}
    >
      <div className="kanban-shell">
        {draggingLead ? (
          <div className="kanban-banner">
            Arrastando <strong>{draggingLead.nome}</strong>
            {activeColumn ? ` para ${statusLabels[activeColumn]}` : "."}
          </div>
        ) : null}

        {lastMove ? (
          <div className="kanban-last-move">
            <strong>{lastMove.nome}</strong> movido para <strong>{statusLabels[lastMove.status]}</strong>
          </div>
        ) : null}

        <div className="kanban-board">
          {statusOrder.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              leads={leads.filter((lead) => lead.status === status)}
              draggingLeadId={draggingLeadId}
              isActiveDropzone={activeColumn === status}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {draggingLead ? (
          <div className="kanban-overlay">
            <LeadCard lead={draggingLead} compact />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
