const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');

router.get('/', livreController.getAll);
router.get('/disponibles', livreController.getDisponibles);
router.get('/:id', livreController.getById);
router.post('/', livreController.create);
router.put('/:id', livreController.update);
router.delete('/:id', livreController.delete);

module.exports = router;