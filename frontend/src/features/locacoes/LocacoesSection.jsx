import { useState, useEffect, useCallback } from 'react';
import { locacoesApi, veiculosApi } from '../../services/api';
import { formatarMoeda } from '../../utils/formatters';
import Pagination from '../../components/ui/Pagination';
import LocacaoForm from './LocacaoForm';
import LocacaoCard from './LocacaoCard';

const LOCACOES_POR_PAGINA = 3;

export default function LocacoesSection({
  veiculoPreSelecionadoId,
  onLimparPreSelecao,
  onFeedback,
  onSessaoExpirada,
}) {
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState([]);
  const [locacoes, setLocacoes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('todas'); 
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [registrando, setRegistrando] = useState(false);
  const [finalizandoId, setFinalizandoId] = useState(null);

  const buscarDadosLocacoes = useCallback(async () => {
    const [listaDisponiveis, historicoLocacoes] = await Promise.all([
      veiculosApi.listar(true),
      locacoesApi.listar(),
    ]);
    return { listaDisponiveis, historicoLocacoes };
  }, []);

  const carregarDados = useCallback(async () => {
    setCarregandoDados(true);
    try {
      const { listaDisponiveis, historicoLocacoes } =
        await buscarDadosLocacoes();
      setVeiculosDisponiveis(listaDisponiveis);
      setLocacoes(historicoLocacoes);
    } catch (error) {
      if (error.status === 401) {
        onSessaoExpirada(error.message);
        return;
      }
      onFeedback({
        tipo: 'erro',
        mensagem: error.message || 'Erro ao carregar dados de locações.',
      });
    } finally {
      setCarregandoDados(false);
    }
  }, [buscarDadosLocacoes, onFeedback, onSessaoExpirada]);

  useEffect(() => {
    let ativo = true;

    buscarDadosLocacoes()
      .then(({ listaDisponiveis, historicoLocacoes }) => {
        if (ativo) {
          setVeiculosDisponiveis(listaDisponiveis);
          setLocacoes(historicoLocacoes);
        }
      })
      .catch((error) => {
        if (!ativo) return;
        if (error.status === 401) {
          onSessaoExpirada(error.message);
          return;
        }
        onFeedback({
          tipo: 'erro',
          mensagem: error.message || 'Erro ao carregar dados de locações.',
        });
      })
      .finally(() => {
        if (ativo) {
          setCarregandoDados(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [buscarDadosLocacoes, onFeedback, onSessaoExpirada]);

  const handleMudarFiltroStatus = (novoFiltro) => {
    setFiltroStatus(novoFiltro);
    setPaginaAtual(1);
  };

  const handleRegistrarLocacao = async (dadosLocacao) => {
    onFeedback(null);
    setRegistrando(true);

    try {
      const novaLocacao = await locacoesApi.cadastrar(dadosLocacao);

      if (onLimparPreSelecao) {
        onLimparPreSelecao();
      }

      onFeedback({
        tipo: 'sucesso',
        mensagem: `Locação registrada com sucesso! Valor total calculado: ${formatarMoeda(
          novaLocacao.valorTotal
        )}.`,
      });

      setPaginaAtual(1);
      await carregarDados();
      return true;
    } catch (error) {
      if (error.status === 401) {
        onSessaoExpirada(error.message);
        return false;
      }
      onFeedback({
        tipo: 'erro',
        mensagem: error.message || 'Erro ao registrar a locação.',
      });
      return false;
    } finally {
      setRegistrando(false);
    }
  };

  const handleFinalizarLocacao = async (locacaoId) => {
    onFeedback(null);
    setFinalizandoId(locacaoId);

    try {
      const locacaoFinalizada = await locacoesApi.finalizar(locacaoId);

      onFeedback({
        tipo: 'sucesso',
        mensagem: `Locação #${locacaoFinalizada.id} finalizada com sucesso! O veículo ${
          locacaoFinalizada.veiculo
            ? `${locacaoFinalizada.veiculo.marca} ${locacaoFinalizada.veiculo.modelo}`
            : ''
        } está disponível novamente.`,
      });

      await carregarDados();
    } catch (error) {
      if (error.status === 401) {
        onSessaoExpirada(error.message);
        return;
      }
      onFeedback({
        tipo: 'erro',
        mensagem: error.message || 'Não foi possível finalizar a locação.',
      });
    } finally {
      setFinalizandoId(null);
    }
  };

  const locacoesFiltradas = locacoes.filter((loc) => {
    if (filtroStatus === 'ativas') return loc.status === 'ATIVA';
    if (filtroStatus === 'finalizadas') return loc.status === 'FINALIZADA';
    return true;
  });

  const totalAtivas = locacoes.filter((l) => l.status === 'ATIVA').length;
  const totalPaginas = Math.max(
    1,
    Math.ceil(locacoesFiltradas.length / LOCACOES_POR_PAGINA)
  );
  const paginaSegura = Math.min(paginaAtual, totalPaginas);
  const indiceInicial = (paginaSegura - 1) * LOCACOES_POR_PAGINA;
  const locacoesPaginadas = locacoesFiltradas.slice(
    indiceInicial,
    indiceInicial + LOCACOES_POR_PAGINA
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
      <div className="lg:col-span-4">
        <LocacaoForm
          veiculosDisponiveis={veiculosDisponiveis}
          veiculoPreSelecionadoId={veiculoPreSelecionadoId}
          onLimparPreSelecao={onLimparPreSelecao}
          onRegistrarLocacao={handleRegistrarLocacao}
          registrando={registrando}
          carregandoDados={carregandoDados}
          onFeedback={onFeedback}
        />
      </div>

      <section className="lg:col-span-8 bg-white border border-emerald-900/15 rounded-2xl shadow-sm p-7">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-4 border-b border-emerald-900/10">
          <div>
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-brand-accent-soft text-brand-primary border border-brand-accent px-2.5 py-0.5 rounded-full mb-1.5">
              Histórico do Usuário
            </span>
            <h2 className="text-xl font-extrabold text-brand-primary">
              Minhas Locações
            </h2>
            <p className="text-sm text-slate-600">
              Total de <strong>{locacoes.length}</strong> locação(ões) •{' '}
              <strong>{totalAtivas}</strong> ativa(s)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className="inline-flex bg-brand-primary-light p-1 rounded-lg gap-1"
              role="group"
              aria-label="Filtro de status da locação"
            >
              {[
                { id: 'todas', label: 'Todas' },
                { id: 'ativas', label: 'Ativas' },
                { id: 'finalizadas', label: 'Finalizadas' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all cursor-pointer ${
                    filtroStatus === item.id
                      ? 'bg-brand-primary text-brand-accent shadow-xs'
                      : 'text-brand-primary hover:bg-brand-primary/10'
                  }`}
                  onClick={() => handleMudarFiltroStatus(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="bg-white text-brand-primary border-2 border-brand-primary px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer hover:bg-brand-primary-light disabled:opacity-60"
              onClick={carregarDados}
              disabled={carregandoDados}
            >
              {carregandoDados ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>

        {carregandoDados ? (
          <div className="text-center py-12 px-6 bg-emerald-50/40 border-2 border-dashed border-emerald-900/15 rounded-xl text-slate-600">
            <p>Carregando histórico de locações...</p>
          </div>
        ) : locacoesFiltradas.length === 0 ? (
          <div className="text-center py-12 px-6 bg-emerald-50/40 border-2 border-dashed border-emerald-900/15 rounded-xl text-slate-600">
            <h3 className="text-base font-bold text-brand-primary mb-1">
              Nenhuma locação encontrada
            </h3>
            <p className="text-sm">
              {filtroStatus === 'ativas'
                ? 'Você não possui locações ativas no momento.'
                : filtroStatus === 'finalizadas'
                ? 'Você ainda não possui locações finalizadas.'
                : 'Utilize o formulário ao lado para registrar sua primeira locação.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {locacoesPaginadas.map((locacao) => (
                <LocacaoCard
                  key={locacao.id}
                  locacao={locacao}
                  finalizandoId={finalizandoId}
                  onFinalizarLocacao={handleFinalizarLocacao}
                />
              ))}
            </div>

            <Pagination
              paginaAtual={paginaSegura}
              totalPaginas={totalPaginas}
              totalItens={locacoesFiltradas.length}
              itensPorPagina={LOCACOES_POR_PAGINA}
              onMudarPagina={setPaginaAtual}
            />
          </>
        )}
      </section>
    </div>
  );
}
