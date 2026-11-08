import axios from 'axios';

const STORAGE_TOKEN_KEY = 'ecodrive_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error(
          'Não foi possível conectar ao servidor da API. Verifique se o backend está em execução na porta 3000.'
        )
      );
    }

    const { status, data } = error.response;
    const mensagemErro =
      (data && (data.erro || data.message)) ||
      `Erro na requisição (status ${status}).`;

    const erroPadronizado = new Error(mensagemErro);
    erroPadronizado.status = status;
    return Promise.reject(erroPadronizado);
  }
);

export const authApi = {
  cadastrar: async (dadosUsuario) => {
    const { data } = await api.post('/auth/cadastro', dadosUsuario);
    return data;
  },

  login: async (credenciais) => {
    const { data } = await api.post('/auth/login', credenciais);
    return data;
  },
};

export const veiculosApi = {
  listar: async (apenasDisponiveis = false) => {
    const params = apenasDisponiveis ? { disponivel: 'true' } : {};
    const { data } = await api.get('/veiculos', { params });
    return data;
  },

  cadastrar: async (dadosVeiculo) => {
    const { data } = await api.post('/veiculos', dadosVeiculo);
    return data;
  },
};

export const locacoesApi = {
  listar: async () => {
    const { data } = await api.get('/locacoes');
    return data;
  },

  cadastrar: async (dadosLocacao) => {
    const { data } = await api.post('/locacoes', dadosLocacao);
    return data;
  },

  finalizar: async (locacaoId) => {
    const { data } = await api.patch(`/locacoes/${locacaoId}/finalizar`);
    return data;
  },
};

export default api;
