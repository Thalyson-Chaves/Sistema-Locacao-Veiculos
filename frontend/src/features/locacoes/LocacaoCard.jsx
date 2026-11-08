import { formatarDataHora, formatarMoeda } from '../../utils/formatters';

export default function LocacaoCard({
  locacao,
  finalizandoId,
  onFinalizarLocacao,
}) {
  const isAtiva = locacao.status === 'ATIVA';

  return (
    <article
      className={`border border-emerald-900/15 rounded-xl p-5 flex flex-col gap-4 border-l-4 ${
        isAtiva
          ? 'bg-white border-l-brand-accent'
          : 'bg-emerald-50/30 border-l-brand-primary'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="block text-xs font-bold text-slate-500 uppercase">
            Locação #{locacao.id}
          </span>
          <h3 className="text-lg font-extrabold text-brand-primary mt-0.5 mb-1">
            {locacao.veiculo
              ? `${locacao.veiculo.marca} ${locacao.veiculo.modelo}`
              : `Veículo #${locacao.veiculoId}`}
          </h3>
          {locacao.veiculo && (
            <span className="inline-block font-mono text-xs font-bold bg-brand-primary-light text-brand-primary-dark px-2.5 py-0.5 rounded-md">
              Placa: {locacao.veiculo.placa} • Ano {locacao.veiculo.ano}
            </span>
          )}
        </div>

        <span
          className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
            isAtiva
              ? 'bg-brand-accent text-brand-primary-dark'
              : 'bg-brand-primary-light text-brand-primary'
          }`}
        >
          {locacao.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50/50 p-3.5 rounded-lg">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-500 font-semibold">
            Início da Locação
          </span>
          <strong className="text-sm text-slate-900">
            {formatarDataHora(locacao.dataInicio)}
          </strong>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-500 font-semibold">
            Devolução Prevista
          </span>
          <strong className="text-sm text-slate-900">
            {formatarDataHora(locacao.dataPrevistaDevolucao)}
          </strong>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-500 font-semibold">
            Devolução Efetiva
          </span>
          <strong className="text-sm text-slate-900">
            {locacao.dataEfetivaDevolucao
              ? formatarDataHora(locacao.dataEfetivaDevolucao)
              : 'Em andamento'}
          </strong>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">
            Valor Total da Locação
          </span>
          <strong className="text-lg text-brand-primary font-black">
            {formatarMoeda(locacao.valorTotal)}
          </strong>
        </div>

        {isAtiva && (
          <button
            type="button"
            className="bg-brand-primary text-brand-accent border-2 border-brand-accent px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer hover:bg-brand-accent hover:text-brand-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => onFinalizarLocacao(locacao.id)}
            disabled={finalizandoId === locacao.id}
          >
            {finalizandoId === locacao.id
              ? 'Finalizando...'
              : 'Finalizar Locação'}
          </button>
        )}
      </div>
    </article>
  );
}
