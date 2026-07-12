const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');

router.get('/', empruntController.getAll);
router.get('/en-cours', empruntController.getEmpruntsEnCours);
router.get('/:id', empruntController.getById);
router.get('/utilisateur/:utilisateurId', empruntController.getByUtilisateur);
router.post('/', empruntController.create);
router.put('/:id/retourner', empruntController.retourner);

module.exports = router;
