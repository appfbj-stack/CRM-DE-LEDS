import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { LeadForm } from "../components/LeadForm";
import { criarLead } from "../lib/leadsStorage";

export function NewLeadPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <Header title="Novo Lead" />
      <section className="page-content">
        <LeadForm
          submitLabel="Salvar Lead"
          onSubmit={(values) => {
            criarLead(values);
            navigate("/");
          }}
        />
      </section>
    </div>
  );
}
