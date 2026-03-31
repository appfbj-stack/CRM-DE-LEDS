import { Link } from "react-router-dom";
import { etiquetaColors, etiquetaLabels, statusColors, statusLabels } from "../data";
import type { Lead } from "../types";

type LeadCardProps = {
  lead: Lead;
  compact?: boolean;
};

export function LeadCard({ lead, compact = false }: LeadCardProps) {
  const etiquetas = lead.etiquetas;
  const etiquetasCustom = lead.etiquetasCustom;
  const etiquetasVisiveis = compact ? etiquetas.slice(0, 2) : etiquetas.slice(0, 4);
  const restantes = etiquetas.length - etiquetasVisiveis.length;
  const criadoEm = lead.criadoEm ? new Date(lead.criadoEm) : null;
  const customVisiveis = compact ? etiquetasCustom.slice(0, 1) : etiquetasCustom.slice(0, 2);

  return (
    <Link
      to={`/lead/${lead.id}`}
      data-status={lead.status}
      data-cor={lead.cor}
      className={compact ? "lead-card compact" : "lead-card"}
    >
      <div className="lead-card-top">
        <strong>{lead.nome}</strong>
        <span className={`status-pill ${statusColors[lead.status]}`}>{statusLabels[lead.status]}</span>
      </div>
      <p>{lead.telefone}</p>
      {etiquetasVisiveis.length || customVisiveis.length ? (
        <div className="tag-row">
          {etiquetasVisiveis.map((tag) => (
            <span key={tag} className={`tag-pill ${etiquetaColors[tag]}`}>
              {etiquetaLabels[tag]}
            </span>
          ))}
          {customVisiveis.map((tag) => (
            <span key={`${tag.nome}-${tag.cor}`} className="tag-pill tag-custom" data-cor={tag.cor}>
              {tag.nome}
            </span>
          ))}
          {restantes > 0 ? <span className="tag-more">+{restantes}</span> : null}
        </div>
      ) : null}
      {lead.interesse ? <p className="muted">{lead.interesse}</p> : null}
      {!compact && criadoEm && !Number.isNaN(criadoEm.getTime()) ? (
        <p className="muted small">Criado em {criadoEm.toLocaleDateString("pt-BR")}</p>
      ) : null}
    </Link>
  );
}
