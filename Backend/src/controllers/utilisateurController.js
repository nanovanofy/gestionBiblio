const Utilisateur = require('../models/utilisateurModel');

const utilisateurController = {
    async getAll(req, res) {
        try {
            const utilisateurs = await Utilisateur.getAll();
            res.status(200).json(utilisateurs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const utilisateur = await Utilisateur.getById(req.params.id);
            if (!utilisateur) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            res.status(200).json(utilisateur);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const id = await Utilisateur.create(req.body);
            const utilisateur = await Utilisateur.getById(id);
            res.status(201).json(utilisateur);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const updated = await Utilisateur.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            const utilisateur = await Utilisateur.getById(req.params.id);
            res.status(200).json(utilisateur);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Utilisateur.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = utilisateurController;
