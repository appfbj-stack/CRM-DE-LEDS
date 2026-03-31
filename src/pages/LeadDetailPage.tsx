import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { LeadForm } from "../components/LeadForm";
import { etiquetaColors, etiquetaLabels, statusLabels, statusOrder } from "../data";
import { useLeads } from "../hooks/useLeads";
import { atualizarLead, excluirLead, mudarStatus } from "../lib/leadsStorage";
import type { LeadStatus } from "../types";

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, recarregar } = useLeads();

  const lead = useMemo(() => leads.find((item) => item.id === Number(id)), [id, leads]);

  if (!lead) {
    return (
      <div className="page">
        <Header title="Lead não encontrado" />
        <section className="page-content">
          <div className="empty-state">
            <p>Esse lead não existe mais.</p>
            <Link to="/" className="primary-button">
              Voltar para lista
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const criadoEm = lead.criadoEm ? new Date(lead.criadoEm) : null;

  return (
    <div className="page">
      <Header title={lead.nome} />
      <section className="page-content detail-stack">
        <div className="panel detail-meta">
          <div>
            <span className="muted">Telefone</span>
            <strong>{lead.telefone}</strong>
          </div>
          {lead.interesse ? (
            <div>
              <span className="muted">Interesse</span>
              <strong>{lead.interesse}</strong>
            </div>
          ) : null}
          {lead.etiquetas.length || lead.etiquetasCustom.length ? (
            <div>
              <span className="muted">Etiquetas</span>
              <div className="tag-row">
                {lead.etiquetas.map((tag) => (
                  <span key={tag} className={`tag-pill ${etiquetaColors[tag]}`}>
                    {etiquetaLabels[tag]}
                  </span>
                ))}
                {lead.etiquetasCustom.map((tag) => (
                  <span key={`${tag.nome}-${tag.cor}`} className="tag-pill tag-custom" data-cor={tag.cor}>
                    {tag.nome}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {lead.camposExtras.length ? (
            <div>
              <span className="muted">Campos extras</span>
              <div className="extra-summary">
                {lead.camposExtras.map((campo, index) => (
                  <div key={`${campo.chave}-${index}`} className="extra-summary-row">
                    <strong>{campo.chave}</strong>
                    <span className="muted">{campo.valor}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {criadoEm && !Number.isNaN(criadoEm.getTime()) ? (
            <div>
              <span className="muted">Criado em</span>
              <strong>{criadoEm.toLocaleString("pt-BR")}</strong>
            </div>
          ) : null}
          <label>
            <span className="muted">Status</span>
            <select
              value={lead.status}
              onChange={(event) => {
                mudarStatus(lead.id, event.target.value as LeadStatus);
                recarregar();
              }}
            >
              {statusOrder.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <LeadForm
          initialValues={lead}
          submitLabel="Salvar alteracoes"
          onSubmit={(values) => {
            atualizarLead(lead.id, values);
            recarregar();
          }}
        />

        <button
          type="button"
          className="danger-button"
          onClick={() => {
            excluirLead(lead.id);
            navigate("/");
          }}
        >
          Excluir lead
        </button>
      </section>
    </div>
  );
}
