import { formatarMoeda } from '../../utils/formatters';

export default function VeiculoCard({ veiculo, onSelecionarParaLocacao }) {
  const disponivel = veiculo.disponibilidade;

  return (
    <article
      className={`border border-emerald-900/15 rounded-xl p-5 flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
        disponivel
          ? 'bg-white border-t-4 border-t-brand-accent'
          : 'bg-slate-50 border-t-4 border-t-slate-400'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold bg-brand-primary-light text-brand-primary-dark px-2.5 py-1 rounded-md">
          {veiculo.placa}
        </span>
        <span
          className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
            disponivel
              ? 'bg-brand-accent text-brand-primary-dark'
              : 'bg-slate-200 text-slate-600'
          }`}
        >
          {disponivel ? 'Disponível' : 'Indisponível / Locado'}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-0.5">
          {veiculo.marca} {veiculo.modelo}
        </h3>
        <p className="text-xs text-slate-600">
          Ano de fabricação: {veiculo.ano}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-dashed border-emerald-900/15">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">
            Valor da diária
          </span>
          <strong className="text-lg text-brand-primary font-black">
            {formatarMoeda(veiculo.valorDiaria)}
          </strong>
        </div>

        {disponivel && (
          <button
            type="button"
            className="bg-brand-accent text-brand-primary-dark px-4 py-2 rounded-lg font-extrabold text-xs transition-all cursor-pointer hover:bg-brand-accent-hover hover:-translate-y-0.5"
            onClick={() => onSelecionarParaLocacao(veiculo.id)}
          >
            Locar Veículo
          </button>
        )}
      </div>
    </article>
  );
}
