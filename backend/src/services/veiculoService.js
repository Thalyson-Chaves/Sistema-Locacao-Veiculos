const prisma = require('../config/prisma');

const cadastrarVeiculo = async ({ marca, modelo, placa, ano, valorDiaria }) => {
    if (!marca || !modelo || !placa || !ano || valorDiaria === undefined) {
        const erro = new Error('Todos os campos do veiculo sao obrigatorios.');
        erro.status = 400;
        throw erro;
    }

    const diariaNumerica = Number(valorDiaria);
    const anoNumerico = Number(ano);

    if (isNaN(diariaNumerica) || diariaNumerica <= 0) {
        const erro = new Error('O valor da diaria deve ser um numero positivo.');
        erro.status = 400;
        throw erro;
    }

    if (isNaN(anoNumerico) || anoNumerico < 1900) {
        const erro = new Error('Ano do veiculo invalido.');
        erro.status = 400;
        throw erro;
    }

    const placaExistente = await prisma.veiculo.findUnique({ where: { placa } });
    if (placaExistente) {
        const erro = new Error('Ja existe um veiculo cadastrado com esta placa.');
        erro.status = 409;
        throw erro;
    }

    return await prisma.veiculo.create({
        data: {
            marca,
            modelo,
            placa,
            ano: anoNumerico,
            valorDiaria: diariaNumerica,
            disponibilidade: true
        }
    });
};

const listarVeiculos = async (apenasDisponiveis) => {
    const filtro = {};
    if (apenasDisponiveis === 'true') {
        filtro.disponibilidade = true;
    }

    return await prisma.veiculo.findMany({
        where: filtro,
        orderBy: { id: 'desc' }
    });
};

module.exports = { cadastrarVeiculo, listarVeiculos };