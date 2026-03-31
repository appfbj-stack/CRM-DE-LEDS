import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { LeadForm } from "../components/LeadForm";
import { statusLabels, statusOrder } from "../data";
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
        <Header title="Lead nao encontrado" />
        <section className="page-content">
          <div className="empty-state">
            <p>Esse lead nao existe mais.</p>
            <Link to="/" className="primary-button">
              Voltar para lista
            </Link>
          </div>
        </section>
      </div>
    );
  }

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
