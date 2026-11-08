import { useState } from 'react';

export default function VeiculoForm({ onCadastrar, cadastrando }) {
  const [formVeiculo, setFormVeiculo] = useState({
    marca: '',
    modelo: '',
    placa: '',
    ano: new Date().getFullYear().toString(),
    valorDiaria: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormVeiculo((prev) => ({
      ...prev,
      [name]: name === 'placa' ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sucesso = await onCadastrar({
      marca: formVeiculo.marca.trim(),
      modelo: formVeiculo.modelo.trim(),
      placa: formVeiculo.placa.trim().toUpperCase(),
      ano: Number(formVeiculo.ano),
      valorDiaria: Number(formVeiculo.valorDiaria),
    });

    if (sucesso) {
      setFormVeiculo({
        marca: '',
        modelo: '',
        placa: '',
        ano: new Date().getFullYear().toString(),
        valorDiaria: '',
      });
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-lg border-2 border-emerald-900/15 bg-white text-slate-900 text-sm transition focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-accent/30';

  return (
    <aside className="bg-white border border-emerald-900/15 rounded-2xl shadow-sm p-7">
      <div className="mb-5 pb-4 border-b border-emerald-900/10">
        <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-brand-accent-soft text-brand-primary border border-brand-accent px-2.5 py-0.5 rounded-full mb-1.5">
          Novo Registro
        </span>
        <h2 className="text-xl font-extrabold text-brand-primary">
          Cadastrar Veículo
        </h2>
        <p className="text-sm text-slate-600">
          Adicione um novo veículo à frota para disponibilizá-lo para locação.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="veiculo-marca"
            className="text-sm font-bold text-slate-800"
          >
            Marca
          </label>
          <input
            id="veiculo-marca"
            name="marca"
            type="text"
            placeholder="Ex.: Toyota, Volkswagen, Fiat"
            value={formVeiculo.marca}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="veiculo-modelo"
            className="text-sm font-bold text-slate-800"
          >
            Modelo
          </label>
          <input
            id="veiculo-modelo"
            name="modelo"
            type="text"
            placeholder="Ex.: Corolla, Nivus, Argo"
            value={formVeiculo.modelo}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="veiculo-placa"
              className="text-sm font-bold text-slate-800"
            >
              Placa
            </label>
            <input
              id="veiculo-placa"
              name="placa"
              type="text"
              placeholder="ABC-1234 ou ABC1D23"
              maxLength={8}
              value={formVeiculo.placa}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="veiculo-ano"
              className="text-sm font-bold text-slate-800"
            >
              Ano
            </label>
            <input
              id="veiculo-ano"
              name="ano"
              type="number"
              min="1900"
              max="2100"
              placeholder="2025"
              value={formVeiculo.ano}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="veiculo-diaria"
            className="text-sm font-bold text-slate-800"
          >
            Valor da Diária (R$)
          </label>
          <input
            id="veiculo-diaria"
            name="valorDiaria"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Ex.: 150.00"
            value={formVeiculo.valorDiaria}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-1 bg-brand-primary text-white border-2 border-brand-primary py-3 px-5 rounded-lg font-bold text-sm transition-all cursor-pointer hover:bg-brand-primary-dark hover:border-brand-accent hover:text-brand-accent disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={cadastrando}
        >
          {cadastrando ? 'Salvando Veículo...' : 'Cadastrar Veículo'}
        </button>
      </form>
    </aside>
  );
}
