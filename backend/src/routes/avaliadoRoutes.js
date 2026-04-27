const express = require('express');
const {
    listAvaliadosController,
    createAvaliadoController,
    updateAvaliadoController,
    getAvaliadoByRaController,
    deleteAvaliadoController,
} = require('../controllers/avaliadoController');

const router = express.Router();

router.get('/', listAvaliadosController);
router.post('/', createAvaliadoController);
router.put('/:ra', updateAvaliadoController);
router.get('/:ra', getAvaliadoByRaController);
router.delete('/:id', deleteAvaliadoController);

module.exports = router;
