const express = require('express');
const authMiddleWare = require('../middlewares/authMiddleware');
const locacaoController = require('../controllers/locacaoController');

const router = express.Router();

router.post('/', authMiddleWare, locacaoController.cadastrar);
router.get('/', authMiddleWare, locacaoController.listar);
router.patch('/:id/finalizar', authMiddleWare, locacaoController.finalizar);


module.exports = router;