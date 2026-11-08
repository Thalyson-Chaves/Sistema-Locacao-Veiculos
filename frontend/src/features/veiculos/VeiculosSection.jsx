import { useState, useEffect, useCallback } from 'react';
import { veiculosApi } from '../../services/api';
import Pagination from '../../components/ui/Pagination';
import VeiculoForm from './VeiculoForm';
import VeiculoCard from './VeiculoCard';

const VEICULOS_POR_PAGINA = 4;

export default function VeiculosSection({
  onFeedback,
  onSelecionarParaLocacao,
  onSessaoExpirada,
}) {
  const [veiculos, setVeiculos] = useState([]);
  const [filtroDisponibilidade, setFiltroDisponibilidade] = useState('todos'); 
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [cadastrando, setCadastrando] = useState(false);

  const buscarVeiculos = useCallback(async (filtroAtual) => {
    const apenasDisponiveisApi = filtroAtual === 'disponiveis';
    const lista = await veiculosApi.listar(apenasDisponiveisApi);
    return filtroAtual === 'indisponiveis'
      ? lista.filter((v) => !v.disponibilidade)
      : lista;
  }, []);

  const carregarVeiculos = useCallback(
    async (filtroAtual = filtroDisponibilidade) => {
      setCarregandoLista(true);
      try {
        const resultado = await buscarVeiculos(filtroAtual);
        setVeiculos(resultado);
      } catch (error) {
        if (error.status === 401) {
          onSessaoExpirada(error.message);
          return;
        }
        onFeedback({
          tipo: 'erro',
          mensagem: error.message || 'Erro ao carregar a lista de veículos.',
        });
      } finally {
        setCarregandoLista(false);
      }
    },
    [filtroDisponibilidade, buscarVeiculos, onFeedback, onSessaoExpirada]
  );

  useEffect(() => {
    let ativo = true;

    buscarVeiculos(filtroDisponibilidade)
      .then((resultado) => {
        if (ativo) {
          setVeiculos(resultado);
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
          mensagem: error.message || 'Erro ao carregar a lista de veículos.',
        });
      })
      .finally(() => {
        if (ativo) {
          setCarregandoLista(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [filtroDisponibilidade, buscarVeiculos, onFeedback, onSessaoExpirada]);

  const handleMudarFiltro = (novoFiltro) => {
    if (novoFiltro !== filtroDisponibilidade) {
      setCarregandoLista(true);
      setPaginaAtual(1);
      setFiltroDisponibilidade(novoFiltro);
    }
  };

  const handleCadastrarVeiculo = async (dadosVeiculo) => {
    onFeedback(null);
    setCadastrando(true);

    try {
      const novoVeiculo = await veiculosApi.cadastrar(dadosVeiculo);

      onFeedback({
        tipo: 'sucesso',
        mensagem: `Veículo ${novoVeiculo.marca} ${novoVeiculo.modelo} (${novoVeiculo.placa}) cadastrado com sucesso!`,
      });

      setPaginaAtual(1);
      await carregarVeiculos(filtroDisponibilidade);
      return true;
    } catch (error) {
      if (error.status === 401) {
        onSessaoExpirada(error.message);
        return false;
      }
      onFeedback({
        tipo: 'erro',
        mensagem: error.message || 'Não foi possível cadastrar o veículo.',
      });
      return false;
    } finally {
      setCadastrando(false);
    }
  };

  const totalDisponiveis = veiculos.filter((v) => v.disponibilidade).length;
  const totalPaginas = Math.max(
    1,
    Math.ceil(veiculos.length / VEICULOS_POR_PAGINA)
  );
  const paginaSegura = Math.min(paginaAtual, totalPaginas);
  const indiceInicial = (paginaSegura - 1) * VEICULOS_POR_PAGINA;
  const veiculosPaginados = veiculos.slice(
    indiceInicial,
    indiceInicial + VEICULOS_POR_PAGINA
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
      <div className="lg:col-span-4">
        <VeiculoForm
          onCadastrar={handleCadastrarVeiculo}
          cadastrando={cadastrando}
        />
      </div>

      <section className="lg:col-span-8 bg-white border border-emerald-900/15 rounded-2xl shadow-sm p-7">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-4 border-b border-emerald-900/10">
          <div>
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-brand-accent-soft text-brand-primary border border-brand-accent px-2.5 py-0.5 rounded-full mb-1.5">
              Frota Cadastrada
            </span>
            <h2 className="text-xl font-extrabold text-brand-primary">
              Listagem de Veículos
            </h2>
            <p className="text-sm text-slate-600">
              Total de <strong>{veiculos.length}</strong> veículo(s) •{' '}
              <strong>{totalDisponiveis}</strong> disponível(is) nesta
              visualização
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className="inline-flex bg-brand-primary-light p-1 rounded-lg gap-1"
              role="group"
              aria-label="Filtro de disponibilidade"
            >
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'disponiveis', label: 'Disponíveis' },
                { id: 'indisponiveis', label: 'Locados' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all cursor-pointer ${
                    filtroDisponibilidade === item.id
                      ? 'bg-brand-primary text-brand-accent shadow-xs'
                      : 'text-brand-primary hover:bg-brand-primary/10'
                  }`}
                  onClick={() => handleMudarFiltro(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="bg-white text-brand-primary border-2 border-brand-primary px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer hover:bg-brand-primary-light disabled:opacity-60"
              onClick={() => carregarVeiculos(filtroDisponibilidade)}
              disabled={carregandoLista}
            >
              {carregandoLista ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>

        {carregandoLista ? (
          <div className="text-center py-12 px-6 bg-emerald-50/40 border-2 border-dashed border-emerald-900/15 rounded-xl text-slate-600">
            <p>Consultando veículos no servidor...</p>
          </div>
        ) : veiculos.length === 0 ? (
          <div className="text-center py-12 px-6 bg-emerald-50/40 border-2 border-dashed border-emerald-900/15 rounded-xl text-slate-600">
            <h3 className="text-base font-bold text-brand-primary mb-1">
              Nenhum veículo encontrado
            </h3>
            <p className="text-sm">
              {filtroDisponibilidade === 'disponiveis'
                ? 'Não há veículos disponíveis para locação no momento.'
                : filtroDisponibilidade === 'indisponiveis'
                ? 'Não há veículos locados neste momento.'
                : 'Cadastre o primeiro veículo no formulário ao lado para iniciar a frota.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {veiculosPaginados.map((veiculo) => (
                <VeiculoCard
                  key={veiculo.id}
                  veiculo={veiculo}
                  onSelecionarParaLocacao={onSelecionarParaLocacao}
                />
              ))}
            </div>

            <Pagination
              paginaAtual={paginaSegura}
              totalPaginas={totalPaginas}
              totalItens={veiculos.length}
              itensPorPagina={VEICULOS_POR_PAGINA}
              onMudarPagina={setPaginaAtual}
            />
          </>
        )}
      </section>
    </div>
  );
}
