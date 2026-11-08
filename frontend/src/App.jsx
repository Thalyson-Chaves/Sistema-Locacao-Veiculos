import { useState, useCallback } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AlertBanner from './components/ui/AlertBanner';
import AuthSection from './features/auth/AuthSection';
import VeiculosSection from './features/veiculos/VeiculosSection';
import LocacoesSection from './features/locacoes/LocacoesSection';

const STORAGE_TOKEN_KEY = 'ecodrive_token';
const STORAGE_USER_KEY = 'ecodrive_usuario';

export default function App() {
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_TOKEN_KEY)
  );
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem(STORAGE_USER_KEY);
    if (!salvo) return null;
    try {
      return JSON.parse(salvo);
    } catch {
      return null;
    }
  });

  const [abaAtiva, setAbaAtiva] = useState('veiculos'); // 'veiculos' | 'locacoes'
  const [veiculoPreSelecionadoId, setVeiculoPreSelecionadoId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleFecharFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const handleLoginSucesso = useCallback((dadosAuth) => {
    localStorage.setItem(STORAGE_TOKEN_KEY, dadosAuth.token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(dadosAuth.usuario));
    setToken(dadosAuth.token);
    setUsuario(dadosAuth.usuario);
    setAbaAtiva('veiculos');
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setToken(null);
    setUsuario(null);
    setVeiculoPreSelecionadoId(null);
    setFeedback({
      tipo: 'sucesso',
      mensagem: 'Sessão encerrada com sucesso.',
    });
  }, []);

  const handleSessaoExpirada = useCallback((mensagemBackend) => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setToken(null);
    setUsuario(null);
    setVeiculoPreSelecionadoId(null);
    setFeedback({
      tipo: 'erro',
      mensagem:
        mensagemBackend ||
        'Sua sessão expirou. Faça login novamente para continuar.',
    });
  }, []);

  const handleMudarAba = useCallback((novaAba) => {
    setAbaAtiva(novaAba);
    setFeedback(null);
  }, []);

  const handleSelecionarParaLocacao = useCallback((veiculoId) => {
    setVeiculoPreSelecionadoId(veiculoId);
    setAbaAtiva('locacoes');
    setFeedback({
      tipo: 'sucesso',
      mensagem:
        'Veículo selecionado! Defina a data prevista de devolução para concluir a locação.',
    });
  }, []);

  const isAutenticado = Boolean(token && usuario);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7f4] text-slate-900 antialiased">
      <Navbar
        usuario={isAutenticado ? usuario : null}
        abaAtiva={abaAtiva}
        onMudarAba={handleMudarAba}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-7 pb-10">
        <AlertBanner feedback={feedback} onClose={handleFecharFeedback} />

        {!isAutenticado ? (
          <AuthSection
            onLoginSucesso={handleLoginSucesso}
            onFeedback={setFeedback}
          />
        ) : abaAtiva === 'veiculos' ? (
          <VeiculosSection
            onFeedback={setFeedback}
            onSelecionarParaLocacao={handleSelecionarParaLocacao}
            onSessaoExpirada={handleSessaoExpirada}
          />
        ) : (
          <LocacoesSection
            veiculoPreSelecionadoId={veiculoPreSelecionadoId}
            onLimparPreSelecao={() => setVeiculoPreSelecionadoId(null)}
            onFeedback={setFeedback}
            onSessaoExpirada={handleSessaoExpirada}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
