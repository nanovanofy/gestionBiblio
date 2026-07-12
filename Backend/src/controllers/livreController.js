const Livre = require('../models/livreModel');

const livreController = {
    async getAll(req, res) {
        try {
            const livres = await Livre.getAll();
            res.status(200).json(livres);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const livre = await Livre.getById(req.params.id);
            if (!livre) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            res.status(200).json(livre);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const id = await Livre.create(req.body);
            const livre = await Livre.getById(id);
            res.status(201).json(livre);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const updated = await Livre.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            const livre = await Livre.getById(req.params.id);
            res.status(200).json(livre);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Livre.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            res.status(200).json({ message: 'Livre supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getDisponibles(req, res) {
        try {
            const livres = await Livre.getDisponibles();
            res.status(200).json(livres);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = livreController;
