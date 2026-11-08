const prisma = require('../config/prisma');


const MS_POR_DIA = 24 * 60 * 60 * 1000;

const criarErro = (mensagem, status) => {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
};
const cadastrarLocacao = async ({ usuarioId, veiculoId, dataPrevistaDevolucao }) => {
    if (!usuarioId || !veiculoId || !dataPrevistaDevolucao) {
        throw criarErro('Usuario, veiculo e data prevista de devolucao são obrigatorios.', 400);
    }

    const dataInicio = new Date();
    const dataDevolucao = new Date(dataPrevistaDevolucao);

    if (isNaN(dataDevolucao.getTime()) || dataDevolucao <= dataInicio) {
        throw criarErro('A data prevista deve ser posterior ao inicio da locacao.', 400);
    }
    return prisma.$transaction(async (tx) => {
        const veiculo = await tx.veiculo.findUnique({
            where: { id: Number(veiculoId) }
        });

        if (!veiculo) {
            throw criarErro('Veiculo nao encontrado.', 404);
        }

        const reservado = await tx.veiculo.updateMany({
            where: { id: veiculo.id, disponibilidade: true },
            data: { disponibilidade: false }
        });

        if (reservado.count === 0) {
            throw criarErro('Esse veiculo nao esta disponivel para locacao.', 409);
        }

        const diarias = Math.ceil((dataDevolucao - dataInicio) / MS_POR_DIA);
        const valorTotal = diarias * veiculo.valorDiaria;

        return tx.locacao.create({
            data: {
                usuarioId,
                veiculoId: veiculo.id,
                dataInicio,
                dataPrevistaDevolucao: dataDevolucao,
                valorTotal,
                status: 'ATIVA'
            },
            include: { veiculo: true }
        });
    });
};

const listarLocacoes = async (usuarioId) => {
    return prisma.locacao.findMany({
        where: { usuarioId },
        include: { veiculo: true },
        orderBy: { dataInicio: 'desc' }
    });
};

const finalizarLocacao = async ({ id, usuarioId }) => {
    return prisma.$transaction(async (tx) => {
        const locacao = await tx.locacao.findUnique({
            where: { id: Number(id) }
        });

        if (!locacao) {
            throw criarErro('Locacao nao encontrada.', 404);
        }

        if (locacao.usuarioId !== usuarioId) {
            throw criarErro('Voce nao tem permissao para finalizar esta locacao.', 403);
        }

        const encerrada = await tx.locacao.updateMany({
            where: { id: locacao.id, dataEfetivaDevolucao: null },
            data: { dataEfetivaDevolucao: new Date(), status: 'FINALIZADA' }
        });

        if (encerrada.count === 0) {
            throw criarErro('Esta locacao ja foi finalizada.', 409);
        }

        await tx.veiculo.update({
            where: { id: locacao.veiculoId },
            data: { disponibilidade: true }
        });

        return tx.locacao.findUnique({
            where: { id: locacao.id },
            include: { veiculo: true }
        });
    });
};

module.exports = { cadastrarLocacao, listarLocacoes, finalizarLocacao };