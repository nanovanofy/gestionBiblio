const Emprunt = require('../models/empruntModel');
const Livre = require('../models/livreModel');

const empruntController = {
    async getAll(req, res) {
        try {
            const emprunts = await Emprunt.getAll();
            res.status(200).json(emprunts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const emprunt = await Emprunt.getById(req.params.id);
            if (!emprunt) {
                return res.status(404).json({ message: 'Emprunt non trouvé' });
            }
            res.status(200).json(emprunt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const { utilisateur_id, livre_id, date_emprunt, date_retour_prevue } = req.body;
            
            const livre = await Livre.getById(livre_id);
            if (!livre || livre.disponible < 1) {
                return res.status(400).json({ message: 'Livre non disponible' });
            }

            const id = await Emprunt.create(req.body);
            await Livre.updateDisponibilite(livre_id, livre.disponible - 1);
            
            const emprunt = await Emprunt.getById(id);
            res.status(201).json(emprunt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async retourner(req, res) {
        try {
            const emprunt = await Emprunt.getById(req.params.id);
            if (!emprunt) {
                return res.status(404).json({ message: 'Emprunt non trouvé' });
            }

            if (emprunt.statut === 'rendu') {
                return res.status(400).json({ message: 'Ce livre a déjà été retourné' });
            }

            await Emprunt.retourner(req.params.id);
            
            const livre = await Livre.getById(emprunt.livre_id);
            await Livre.updateDisponibilite(emprunt.livre_id, livre.disponible + 1);
            
            res.status(200).json({ message: 'Livre retourné avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getByUtilisateur(req, res) {
        try {
            const emprunts = await Emprunt.getByUtilisateur(req.params.utilisateurId);
            res.status(200).json(emprunts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getEmpruntsEnCours(req, res) {
        try {
            const emprunts = await Emprunt.getEmpruntsEnCours();
            res.status(200).json(emprunts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = empruntController;
