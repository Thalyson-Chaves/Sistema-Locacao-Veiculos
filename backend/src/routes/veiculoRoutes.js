const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', veiculoController.cadastrar);
router.get('/', veiculoController.listar);

module.exports = router;