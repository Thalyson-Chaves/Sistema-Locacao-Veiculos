const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async ({ nome, email, senha }) => {
    if (!nome || !email || !senha) {
        const erro = new Error('Nome, e-mail e senha sao obrigatorios.');
        erro.status = 400;
        throw erro;
    }

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
        const erro = new Error('E-mail ja cadastrado no sistema.');
        erro.status = 409;
        throw erro;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
        data: { nome, email, senha: senhaHash },
        select: {
            id: true,
            nome: true,
            email: true,
            dataCadastro: true
        }
    });

    return novoUsuario;
};

const autenticarUsuario = async ({ email, senha }) => {
    if (!email || !senha) {
        const erro = new Error('E-mail e senha sao obrigatorios.');
        erro.status = 400;
        throw erro;
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
        const erro = new Error('Credenciais invalidas.');
        erro.status = 401;
        throw erro;
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
        const erro = new Error('Credenciais invalidas.');
        erro.status = 401;
        throw erro;
    }

    const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }
    };
};

module.exports = { cadastrarUsuario, autenticarUsuario };