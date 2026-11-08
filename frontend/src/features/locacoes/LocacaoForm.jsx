import { useState, useRef, useEffect } from 'react';
import {
  MS_POR_DIA,
  formatarMoeda,
  obterDataLocalISO,
} from '../../utils/formatters';

export default function LocacaoForm({
  veiculosDisponiveis,
  veiculoPreSelecionadoId,
  onLimparPreSelecao,
  onRegistrarLocacao,
  registrando,
  carregandoDados,
  onFeedback,
}) {
  const hojeStr = obterDataLocalISO(0);
  const amanhaStr = obterDataLocalISO(1);

  const [formLocacao, setFormLocacao] = useState(() => ({
    veiculoId: veiculoPreSelecionadoId ? String(veiculoPreSelecionadoId) : '',
    dataInicio: hojeStr,
    dataPrevistaDevolucao: amanhaStr,
  }));

  const [termoBuscaVeiculo, setTermoBuscaVeiculo] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const seletorRef = useRef(null);

  useEffect(() => {
    const handleClickFora = (event) => {
      if (seletorRef.current && !seletorRef.current.contains(event.target)) {
        setDropdownAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  const veiculoIdAtivo =
    formLocacao.veiculoId ||
    (veiculoPreSelecionadoId ? String(veiculoPreSelecionadoId) : '');

  const veiculoSelecionado = veiculosDisponiveis.find(
    (v) => String(v.id) === String(veiculoIdAtivo)
  );

  const termoNormalizado = termoBuscaVeiculo.trim().toLowerCase();
  const veiculosFiltrados = termoNormalizado
    ? veiculosDisponiveis
        .filter((veiculo) => {
          const textoVeiculo =
            `${veiculo.marca} ${veiculo.modelo} ${veiculo.placa} ${veiculo.ano}`.toLowerCase();
          return textoVeiculo.includes(termoNormalizado);
        })
        .slice(0, 5)
    : [];

  const handleSelecionarVeiculo = (veiculo) => {
    setFormLocacao((prev) => ({
      ...prev,
      veiculoId: String(veiculo.id),
    }));
    setTermoBuscaVeiculo('');
    setDropdownAberto(false);
    if (onLimparPreSelecao) {
      onLimparPreSelecao();
    }
  };

  const handleLimparVeiculoSelecionado = () => {
    setFormLocacao((prev) => ({
      ...prev,
      veiculoId: '',
    }));
    setTermoBuscaVeiculo('');
    setDropdownAberto(false);
    if (onLimparPreSelecao) {
      onLimparPreSelecao();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormLocacao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let diariasEstimadas = 0;
  if (formLocacao.dataInicio && formLocacao.dataPrevistaDevolucao) {
    const [anoIni, mesIni, diaIni] = formLocacao.dataInicio
      .split('-')
      .map(Number);
    const [anoFim, mesFim, diaFim] = formLocacao.dataPrevistaDevolucao
      .split('-')
      .map(Number);
    const inicio = new Date(anoIni, mesIni - 1, diaIni);
    const fim = new Date(anoFim, mesFim - 1, diaFim);
    const diff = Math.ceil((fim - inicio) / MS_POR_DIA);
    if (diff > 0) {
      diariasEstimadas = diff;
    }
  }

  const valorEstimado = veiculoSelecionado
    ? diariasEstimadas * Number(veiculoSelecionado.valorDiaria)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!veiculoIdAtivo) {
      onFeedback({
        tipo: 'erro',
        mensagem: 'Selecione um veículo disponível para realizar a locação.',
      });
      return;
    }

    if (diariasEstimadas <= 0) {
      onFeedback({
        tipo: 'erro',
        mensagem:
          'A data prevista de devolução deve ser posterior à data de início.',
      });
      return;
    }

    const agora = new Date();
    const dataPrevistaIso = new Date(
      agora.getTime() + diariasEstimadas * MS_POR_DIA
    ).toISOString();

    const sucesso = await onRegistrarLocacao({
      veiculoId: Number(veiculoIdAtivo),
      dataPrevistaDevolucao: dataPrevistaIso,
    });

    if (sucesso) {
      setFormLocacao({
        veiculoId: '',
        dataInicio: hojeStr,
        dataPrevistaDevolucao: amanhaStr,
      });
      setTermoBuscaVeiculo('');
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-lg border-2 border-emerald-900/15 bg-white text-slate-900 text-sm transition focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-accent/30';

  return (
    <aside className="bg-white border border-emerald-900/15 rounded-2xl shadow-sm p-7">
      <div className="mb-5 pb-4 border-b border-emerald-900/10">
        <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-brand-accent-soft text-brand-primary border border-brand-accent px-2.5 py-0.5 rounded-full mb-1.5">
          Nova Operação
        </span>
        <h2 className="text-xl font-extrabold text-brand-primary">
          Registrar Locação
        </h2>
        <p className="text-sm text-slate-600">
          Escolha um veículo disponível e defina o período para calcular o valor
          da locação.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 relative" ref={seletorRef}>
          <label
            htmlFor="locacao-busca-veiculo"
            className="text-sm font-bold text-slate-800"
          >
            Veículo Disponível
          </label>

          {veiculoSelecionado ? (
            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border-2 border-brand-primary bg-brand-primary-light/60">
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-brand-primary">
                  {veiculoSelecionado.marca} {veiculoSelecionado.modelo} (
                  {veiculoSelecionado.placa})
                </span>
                <span className="text-xs text-slate-600">
                  Ano {veiculoSelecionado.ano} •{' '}
                  {formatarMoeda(veiculoSelecionado.valorDiaria)}/dia
                </span>
              </div>
              <button
                type="button"
                onClick={handleLimparVeiculoSelecionado}
                className="text-xs font-bold text-brand-primary bg-white border border-brand-primary/30 px-2.5 py-1 rounded-md hover:bg-brand-primary hover:text-brand-accent transition-all cursor-pointer"
              >
                Trocar
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                id="locacao-busca-veiculo"
                type="text"
                placeholder="Digite marca, modelo, placa ou ano..."
                value={termoBuscaVeiculo}
                onFocus={() => {
                  if (termoBuscaVeiculo.trim().length > 0) {
                    setDropdownAberto(true);
                  }
                }}
                onChange={(e) => {
                  const valor = e.target.value;
                  setTermoBuscaVeiculo(valor);
                  setDropdownAberto(valor.trim().length > 0);
                }}
                className={inputClass}
                autoComplete="off"
              />

              {dropdownAberto &&
                termoNormalizado.length > 0 &&
                veiculosDisponiveis.length > 0 && (
                  <ul
                    className="absolute z-30 left-0 right-0 mt-1.5 bg-white border-2 border-brand-primary rounded-xl shadow-lg divide-y divide-emerald-900/10 overflow-hidden"
                    role="listbox"
                  >
                    {veiculosFiltrados.length === 0 ? (
                      <li className="px-3.5 py-3 text-xs text-slate-500 text-center">
                        Nenhum veículo disponível corresponde a &ldquo;
                        {termoBuscaVeiculo}&rdquo;.
                      </li>
                    ) : (
                      veiculosFiltrados.map((veiculo) => (
                        <li key={veiculo.id}>
                          <button
                            type="button"
                            onClick={() => handleSelecionarVeiculo(veiculo)}
                            className="w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-brand-accent-soft transition-colors cursor-pointer"
                          >
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {veiculo.marca} {veiculo.modelo}
                              </p>
                              <span className="text-xs text-slate-500 font-mono">
                                Placa: {veiculo.placa} • {veiculo.ano}
                              </span>
                            </div>
                            <span className="text-xs font-extrabold text-brand-primary bg-brand-primary-light px-2.5 py-1 rounded-md shrink-0">
                              {formatarMoeda(veiculo.valorDiaria)}/dia
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
            </div>
          )}

          {veiculosDisponiveis.length === 0 && !carregandoDados && (
            <small className="text-xs text-slate-500">
              Nenhum veículo disponível no momento. Cadastre um novo veículo ou
              finalize uma locação ativa.
            </small>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="locacao-inicio"
              className="text-sm font-bold text-slate-800"
            >
              Data de Início
            </label>
            <input
              id="locacao-inicio"
              name="dataInicio"
              type="date"
              min={hojeStr}
              max={hojeStr}
              value={formLocacao.dataInicio}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            <small className="text-xs text-slate-500">
              Início imediato (hoje)
            </small>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="locacao-devolucao"
              className="text-sm font-bold text-slate-800"
            >
              Devolução Prevista
            </label>
            <input
              id="locacao-devolucao"
              name="dataPrevistaDevolucao"
              type="date"
              min={amanhaStr}
              value={formLocacao.dataPrevistaDevolucao}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            <small className="text-xs text-slate-500">
              Posterior ao início
            </small>
          </div>
        </div>

        <div className="bg-brand-primary-light border-2 border-brand-primary rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-800">
            <span>Veículo selecionado:</span>
            <strong className="font-bold">
              {veiculoSelecionado
                ? `${veiculoSelecionado.marca} ${veiculoSelecionado.modelo}`
                : 'Nenhum selecionado'}
            </strong>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-800">
            <span>Valor da diária:</span>
            <strong className="font-bold">
              {veiculoSelecionado
                ? formatarMoeda(veiculoSelecionado.valorDiaria)
                : 'R$ 0,00'}
            </strong>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-800">
            <span>Quantidade de diárias:</span>
            <strong className="font-bold">
              {diariasEstimadas > 0 ? `${diariasEstimadas} dia(s)` : '—'}
            </strong>
          </div>
          <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-brand-primary/20 text-sm text-brand-primary">
            <span className="font-bold">Valor Total Estimado:</span>
            <strong className="text-lg font-black">
              {formatarMoeda(valorEstimado)}
            </strong>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-1 bg-brand-primary text-white border-2 border-brand-primary py-3 px-5 rounded-lg font-bold text-sm transition-all cursor-pointer hover:bg-brand-primary-dark hover:border-brand-accent hover:text-brand-accent disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={registrando || veiculosDisponiveis.length === 0}
        >
          {registrando ? 'Registrando Locação...' : 'Confirmar Locação'}
        </button>
      </form>
    </aside>
  );
}
