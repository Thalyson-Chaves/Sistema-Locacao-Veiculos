const locacaoService = require('../services/locacaoService');

const tratarErro = (res, erro) => {
    const status = erro.status || 500;
    const mensagem = erro.status ? erro.message : 'Erro interno do servidor. ';
    return res.status(status).json({erro: mensagem});
};
const cadastrar = async (req, res) => {
    try {
        const locacao = await locacaoService.cadastrarLocacao({
            usuarioId: req.usuarioId,
            veiculoId: req.body.veiculoId,
            dataPrevistaDevolucao: req.body.dataPrevistaDevolucao
        });
        return res.status(201).json(locacao);
    } catch (erro) {
        return tratarErro(res, erro);
    }

};
const listar = async (req, res) =>{
    try {
        const locacoes = await locacaoService.listarLocacoes(req.usuarioId);
        return res.status(200).json(locacoes);
    } catch (erro) {
        return tratarErro(res, erro);
    }
};

const finalizar = async (req, res) => {
    try {
        const locacao = await locacaoService.finalizarLocacao({
            id: req.params.id,
            usuarioId: req.usuarioId
        });
        return res.status(200).json(locacao);
    } catch (erro) {
        return tratarErro (res, erro);
    }

};
module.exports = { cadastrar, listar, finalizar };

  