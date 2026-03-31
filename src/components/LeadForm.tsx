import { useState, type ChangeEvent, type FormEvent } from "react";
import { corLabels, corOrder, etiquetaColors, etiquetaLabels, etiquetaOrder } from "../data";
import type { Lead } from "../types";
import type { LeadCampoExtra, LeadCor, LeadEtiqueta, LeadEtiquetaCustom } from "../types";

type LeadFormValues = {
  nome: string;
  telefone: string;
  interesse: string;
  observacao: string;
  cor: LeadCor;
  etiquetas: LeadEtiqueta[];
  etiquetasCustom: LeadEtiquetaCustom[];
  camposExtras: LeadCampoExtra[];
};

type LeadFormProps = {
  initialValues?: Partial<Lead>;
  onSubmit: (values: LeadFormValues) => void;
  submitLabel: string;
};

export function LeadForm({ initialValues, onSubmit, submitLabel }: LeadFormProps) {
  const [novaEtiqueta, setNovaEtiqueta] = useState("");
  const [novaEtiquetaCor, setNovaEtiquetaCor] = useState<LeadCor>("grafite");
  const [values, setValues] = useState<LeadFormValues>({
    nome: initialValues?.nome ?? "",
    telefone: initialValues?.telefone ?? "",
    interesse: initialValues?.interesse ?? "",
    observacao: initialValues?.observacao ?? "",
    cor: initialValues?.cor ?? "azul",
    etiquetas: initialValues?.etiquetas ?? [],
    etiquetasCustom: initialValues?.etiquetasCustom ?? [],
    camposExtras: initialValues?.camposExtras ?? [],
  });

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function toggleEtiqueta(etiqueta: LeadEtiqueta) {
    setValues((current) => {
      const selected = new Set(current.etiquetas);
      if (selected.has(etiqueta)) {
        selected.delete(etiqueta);
      } else {
        selected.add(etiqueta);
      }
      return { ...current, etiquetas: Array.from(selected) };
    });
  }

  function addEtiquetaCustom(nome: string, cor: LeadCor) {
    const normalized = nome.trim().slice(0, 24);
    if (!normalized) {
      return;
    }

    setValues((current) => {
      const exists = current.etiquetasCustom.some(
        (tag) => tag.nome.toLocaleLowerCase("pt-BR") === normalized.toLocaleLowerCase("pt-BR"),
      );

      if (exists) {
        return current;
      }

      return {
        ...current,
        etiquetasCustom: [...current.etiquetasCustom, { nome: normalized, cor }].slice(0, 8),
      };
    });
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
        <span>Observação</span>
        <textarea
          name="observacao"
          value={values.observacao}
          onChange={handleChange}
          placeholder="Resumo da conversa"
          rows={5}
        />
      </label>

      <div className="form-section">
        <span className="form-section-title">Cor do card</span>
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            const next = corOrder[Math.floor(Math.random() * corOrder.length)];
            setValues((current) => ({ ...current, cor: next }));
          }}
        >
          🎲 Cor aleatória
        </button>
        <div className="color-picker">
          {corOrder.map((cor) => {
            const active = values.cor === cor;
            return (
              <button
                key={cor}
                type="button"
                className={active ? "color-option active" : "color-option"}
                data-cor={cor}
                onClick={() => setValues((current) => ({ ...current, cor }))}
              >
                <span className="color-swatch" data-cor={cor} />
                <span className="color-label">{corLabels[cor]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-section">
        <span className="form-section-title">Etiquetas</span>
        <div className="tag-custom-add">
          <input
            value={novaEtiqueta}
            onChange={(event) => setNovaEtiqueta(event.target.value)}
            placeholder="Digite o nome da etiqueta"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addEtiquetaCustom(novaEtiqueta, novaEtiquetaCor);
                setNovaEtiqueta("");
              }
            }}
          />
          <select value={novaEtiquetaCor} onChange={(event) => setNovaEtiquetaCor(event.target.value as LeadCor)}>
            {corOrder.map((cor) => (
              <option key={cor} value={cor}>
                {corLabels[cor]}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              addEtiquetaCustom(novaEtiqueta, novaEtiquetaCor);
              setNovaEtiqueta("");
            }}
          >
            + Adicionar
          </button>
        </div>

        {values.etiquetasCustom.length ? (
          <div className="tag-row">
            {values.etiquetasCustom.map((tag) => (
              <button
                key={`${tag.nome}-${tag.cor}`}
                type="button"
                className="tag-pill tag-custom"
                onClick={() => {
                  setValues((current) => ({
                    ...current,
                    etiquetasCustom: current.etiquetasCustom.filter((item) => item.nome !== tag.nome),
                  }));
                }}
                data-cor={tag.cor}
              >
                {tag.nome} ✕
              </button>
            ))}
          </div>
        ) : null}

        <div className="tag-picker">
          {etiquetaOrder.map((etiqueta) => {
            const active = values.etiquetas.includes(etiqueta);
            return (
              <button
                key={etiqueta}
                type="button"
                className={active ? `tag-chip ${etiquetaColors[etiqueta]} active` : `tag-chip ${etiquetaColors[etiqueta]}`}
                onClick={() => toggleEtiqueta(etiqueta)}
              >
                {etiquetaLabels[etiqueta]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-section">
        <span className="form-section-title">Campos extras</span>
        <div className="extra-fields">
          {values.camposExtras.map((campo, index) => (
            <div key={`${campo.chave}-${index}`} className="extra-field-row">
              <input
                value={campo.chave}
                onChange={(event) => {
                  const value = event.target.value;
                  setValues((current) => ({
                    ...current,
                    camposExtras: current.camposExtras.map((item, i) => (i === index ? { ...item, chave: value } : item)),
                  }));
                }}
                placeholder="Bairro, Origem, Valor..."
              />
              <input
                value={campo.valor}
                onChange={(event) => {
                  const value = event.target.value;
                  setValues((current) => ({
                    ...current,
                    camposExtras: current.camposExtras.map((item, i) => (i === index ? { ...item, valor: value } : item)),
                  }));
                }}
                placeholder="Preencha o valor"
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  setValues((current) => ({
                    ...current,
                    camposExtras: current.camposExtras.filter((_, i) => i !== index),
                  }));
                }}
                aria-label="Remover campo extra"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setValues((current) => ({
                ...current,
                camposExtras: [...current.camposExtras, { chave: "", valor: "" }],
              }));
            }}
          >
            + Adicionar campo
          </button>
        </div>
      </div>

      <button type="submit" className="primary-button wide">
        {submitLabel}
      </button>
    </form>
  );
}
