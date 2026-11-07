const authService = require('../services/authService');

const cadastrar = async (req, res) => {
    try {
        const usuario = await authService.cadastrarUsuario(req.body);
        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(error.status || 500).json({ erro: error.message || 'Erro interno no servidor.' });
    }
};

const login = async (req, res) => {
    try {
        const dados = await authService.autenticarUsuario(req.body);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(error.status || 500).json({ erro: error.message || 'Erro interno no servidor.' });
    }
};

module.exports = { cadastrar, login };