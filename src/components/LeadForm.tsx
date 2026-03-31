import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Lead } from "../types";

type LeadFormValues = {
  nome: string;
  telefone: string;
  interesse: string;
  observacao: string;
};

type LeadFormProps = {
  initialValues?: Partial<Lead>;
  onSubmit: (values: LeadFormValues) => void;
  submitLabel: string;
};

export function LeadForm({ initialValues, onSubmit, submitLabel }: LeadFormProps) {
  const [values, setValues] = useState<LeadFormValues>({
    nome: initialValues?.nome ?? "",
    telefone: initialValues?.telefone ?? "",
    interesse: initialValues?.interesse ?? "",
    observacao: initialValues?.observacao ?? "",
  });

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <label>
        <span>Nome</span>
        <input
          name="nome"
          value={values.nome}
          onChange={handleChange}
          placeholder="Nome do lead"
          required
        />
      </label>

      <label>
        <span>Telefone</span>
        <input
          name="telefone"
          value={values.telefone}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          required
        />
      </label>

      <label>
        <span>Interesse</span>
        <input
          name="interesse"
          value={values.interesse}
          onChange={handleChange}
          placeholder="Apartamento, casa, sala comercial..."
        />
      </label>

      <label>
        <span>Observacao</span>
        <textarea
          name="observacao"
          value={values.observacao}
          onChange={handleChange}
          placeholder="Resumo da conversa"
          rows={5}
        />
      </label>

      <button type="submit" className="primary-button wide">
        {submitLabel}
      </button>
    </form>
  );
}
