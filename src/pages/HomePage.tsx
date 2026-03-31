import { Header } from "../components/Header";
import { LeadList } from "../components/LeadList";
import { useLeads } from "../hooks/useLeads";

export function HomePage() {
  const { leads } = useLeads();

  return (
    <div className="page">
      <Header title="Meus Leads" actionLabel="Novo Lead" actionTo="/novo" />
      <section className="page-content">
        <LeadList leads={leads} />
      </section>
    </div>
  );
}
