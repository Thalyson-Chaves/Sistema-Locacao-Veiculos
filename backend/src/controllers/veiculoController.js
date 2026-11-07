const veiculoService = require('../services/veiculoService');

const cadastrar = async (req, res) => {
    try {
        const veiculo = await veiculoService.cadastrarVeiculo(req.body);
        return res.status(201).json(veiculo);
    } catch (error) {
        return res.status(error.status || 500).json({ erro: error.message || 'Erro interno no servidor.' });
    }
};

const listar = async (req, res) => {
    try {
        const { disponivel } = req.query;
        const veiculos = await veiculoService.listarVeiculos(disponivel);
        return res.status(200).json(veiculos);
    } catch (error) {
        return res.status(error.status || 500).json({ erro: error.message || 'Erro interno no servidor.' });
    }
};

module.exports = { cadastrar, listar };