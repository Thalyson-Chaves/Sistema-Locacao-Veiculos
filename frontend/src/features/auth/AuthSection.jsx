import { useState } from 'react';
import { authApi } from '../../services/api';

export default function AuthSection({ onLoginSucesso, onFeedback }) {
  const [modo, setModo] = useState('login'); 
  const [carregando, setCarregando] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    senha: '',
  });

  const [cadastroForm, setCadastroForm] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  const alternarModo = (novoModo) => {
    setModo(novoModo);
    onFeedback(null);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCadastroChange = (e) => {
    const { name, value } = e.target;
    setCadastroForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    onFeedback(null);
    setCarregando(true);

    try {
      const dados = await authApi.login({
        email: loginForm.email.trim(),
        senha: loginForm.senha,
      });

      setLoginForm({ email: '', senha: '' });
      onLoginSucesso(dados);
      onFeedback({
        tipo: 'sucesso',
        mensagem: `Bem-vindo(a), ${dados.usuario.nome}! Autenticação realizada com sucesso.`,
      });
    } catch (error) {
      onFeedback({
        tipo: 'erro',
        mensagem: error.message || 'Falha ao realizar login.',
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmitCadastro = async (e) => {
    e.preventDefault();
    onFeedback(null);
    setCarregando(true);

    try {
      const novoUsuario = await authApi.cadastrar({
        nome: cadastroForm.nome.trim(),
        email: cadastroForm.email.trim(),
        senha: cadastroForm.senha,
      });

      setLoginForm({
        email: novoUsuario.email || cadastroForm.email.trim(),
        senha: '',
      });
      setCadastroForm({ nome: '', email: '', senha: '' });
      setModo('login');

      onFeedback({
        tipo: 'sucesso',
        mensagem: `Usuário "${novoUsuario.nome}" cadastrado com sucesso! Faça login para acessar o sistema.`,
      });
    } catch (error) {
      onFeedback({
        tipo: 'erro',
        mensagem: error.message || 'Falha ao realizar cadastro.',
      });
    } finally {
      setCarregando(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-lg border-2 border-emerald-900/15 bg-white text-slate-900 text-sm transition focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-accent/30';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
      <div className="lg:col-span-7 bg-linear-to-br from-brand-primary to-brand-primary-dark text-white p-10 min-h-[490px] rounded-2xl flex flex-col justify-start border-l-8 border-brand-accent shadow-xl">
        <span className="self-start bg-brand-accent text-brand-primary-dark font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full mb-5">
          Frota Inteligente
        </span>
        <h2 className="text-3xl font-extrabold leading-tight mb-4">
          Gerencie veículos e locações com agilidade e segurança
        </h2>
        <p className="text-emerald-100/90 text-base mb-6 leading-relaxed">
          Plataforma integrada com controle de disponibilidade de frota,
          registro de locações, cálculo automático de diárias e histórico
          completo por usuário autenticado.
        </p>
        <ul className="flex flex-col gap-3.5 text-sm text-emerald-50">
          <li className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent shrink-0" />
            Cadastro e consulta de veículos com filtro de disponibilidade em
            tempo real
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent shrink-0" />
            Registro de locações com cálculo de diárias e valor total
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent shrink-0" />
            Histórico detalhado e finalização de locação com liberação
            automática do veículo
          </li>
        </ul>
      </div>

      <div className="lg:col-span-5 bg-white border border-emerald-900/15 rounded-2xl shadow-sm p-7 min-h-[490px] flex flex-col justify-start">
        <div
          className="grid grid-cols-2 gap-1.5 bg-brand-primary-light p-1.5 rounded-xl mb-6"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'login'}
            className={`py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
              modo === 'login'
                ? 'bg-brand-primary text-brand-accent shadow-sm'
                : 'text-brand-primary hover:bg-brand-primary/10'
            }`}
            onClick={() => alternarModo('login')}
          >
            Entrar (Login)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'cadastro'}
            className={`py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
              modo === 'cadastro'
                ? 'bg-brand-primary text-brand-accent shadow-sm'
                : 'text-brand-primary hover:bg-brand-primary/10'
            }`}
            onClick={() => alternarModo('cadastro')}
          >
            Criar Conta
          </button>
        </div>

        {modo === 'login' ? (
          <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
            <div className="mb-1">
              <h3 className="text-xl font-extrabold text-brand-primary">
                Acesso ao Sistema
              </h3>
              <p className="text-sm text-slate-600">
                Informe suas credenciais para acessar as operações protegidas.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-sm font-bold text-slate-800"
              >
                E-mail
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={loginForm.email}
                onChange={handleLoginChange}
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-senha"
                className="text-sm font-bold text-slate-800"
              >
                Senha
              </label>
              <input
                id="login-senha"
                name="senha"
                type="password"
                placeholder="Digite sua senha"
                value={loginForm.senha}
                onChange={handleLoginChange}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-brand-primary text-white border-2 border-brand-primary py-3 px-5 rounded-lg font-bold text-sm transition-all cursor-pointer hover:bg-brand-primary-dark hover:border-brand-accent hover:text-brand-accent disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={carregando}
            >
              {carregando ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitCadastro} className="flex flex-col gap-4">
            <div className="mb-1">
              <h3 className="text-xl font-extrabold text-brand-primary">
                Cadastro de Usuário
              </h3>
              <p className="text-sm text-slate-600">
                Crie sua conta para cadastrar veículos e realizar locações.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="cadastro-nome"
                className="text-sm font-bold text-slate-800"
              >
                Nome completo
              </label>
              <input
                id="cadastro-nome"
                name="nome"
                type="text"
                placeholder="Ex.: Carlos Silva"
                value={cadastroForm.nome}
                onChange={handleCadastroChange}
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="cadastro-email"
                className="text-sm font-bold text-slate-800"
              >
                E-mail
              </label>
              <input
                id="cadastro-email"
                name="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={cadastroForm.email}
                onChange={handleCadastroChange}
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="cadastro-senha"
                className="text-sm font-bold text-slate-800"
              >
                Senha
              </label>
              <input
                id="cadastro-senha"
                name="senha"
                type="password"
                placeholder="Crie uma senha segura"
                value={cadastroForm.senha}
                onChange={handleCadastroChange}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-brand-primary text-white border-2 border-brand-primary py-3 px-5 rounded-lg font-bold text-sm transition-all cursor-pointer hover:bg-brand-primary-dark hover:border-brand-accent hover:text-brand-accent disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Confirmar Cadastro'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
