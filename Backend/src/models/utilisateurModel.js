const db = require('../config/database');

class Utilisateur {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM utilisateurs ORDER BY id DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM utilisateurs WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(utilisateurData) {
        const { nom, prenom, email, telephone, adresse } = utilisateurData;
        const [result] = await db.query(
            'INSERT INTO utilisateurs (nom, prenom, email, telephone, adresse) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, telephone, adresse]
        );
        return result.insertId;
    }

    static async update(id, utilisateurData) {
        const { nom, prenom, email, telephone, adresse, statut } = utilisateurData;
        const [result] = await db.query(
            'UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ?, statut = ? WHERE id = ?',
            [nom, prenom, email, telephone, adresse, statut, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM utilisateurs WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Utilisateur;