const db = require('../config/database');

class Emprunt {
    static async getAll() {
        const [rows] = await db.query(`
            SELECT e.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                   l.titre as livre_titre, l.auteur as livre_auteur
            FROM emprunts e
            JOIN utilisateurs u ON e.utilisateur_id = u.id
            JOIN livres l ON e.livre_id = l.id
            ORDER BY e.date_emprunt DESC
        `);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(`
            SELECT e.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                   l.titre as livre_titre, l.auteur as livre_auteur
            FROM emprunts e
            JOIN utilisateurs u ON e.utilisateur_id = u.id
            JOIN livres l ON e.livre_id = l.id
            WHERE e.id = ?
        `, [id]);
        return rows[0];
    }

    static async getByUtilisateur(utilisateurId) {
        const [rows] = await db.query(`
            SELECT e.*, l.titre as livre_titre, l.auteur as livre_auteur
            FROM emprunts e
            JOIN livres l ON e.livre_id = l.id
            WHERE e.utilisateur_id = ?
            ORDER BY e.date_emprunt DESC
        `, [utilisateurId]);
        return rows;
    }

    static async create(empruntData) {
        const { utilisateur_id, livre_id, date_emprunt, date_retour_prevue } = empruntData;
        const [result] = await db.query(
            'INSERT INTO emprunts (utilisateur_id, livre_id, date_emprunt, date_retour_prevue) VALUES (?, ?, ?, ?)',
            [utilisateur_id, livre_id, date_emprunt, date_retour_prevue]
        );
        return result.insertId;
    }

    static async retourner(id) {
        const [result] = await db.query(
            'UPDATE emprunts SET date_retour_effective = CURDATE(), statut = "rendu" WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async getEmpruntsEnCours() {
        const [rows] = await db.query(`
            SELECT e.*, u.nom as utilisateur_nom, u.prenom as utilisateur_prenom, 
                   l.titre as livre_titre
            FROM emprunts e
            JOIN utilisateurs u ON e.utilisateur_id = u.id
            JOIN livres l ON e.livre_id = l.id
            WHERE e.statut = 'en_cours'
            ORDER BY e.date_retour_prevue ASC
        `);
        return rows;
    }
}

module.exports = Emprunt;