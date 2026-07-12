const db = require('../config/database');

class Livre {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM livres ORDER BY id DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM livres WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(livreData) {
        const { titre, auteur, isbn, editeur, annee_publication, quantite, disponible, categorie, description } = livreData;
        const [result] = await db.query(
            'INSERT INTO livres (titre, auteur, isbn, editeur, annee_publication, quantite, disponible, categorie, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [titre, auteur, isbn, editeur, annee_publication, quantite, disponible, categorie, description]
        );
        return result.insertId;
    }

    static async update(id, livreData) {
        const { titre, auteur, isbn, editeur, annee_publication, quantite, disponible, categorie, description } = livreData;
        const [result] = await db.query(
            'UPDATE livres SET titre = ?, auteur = ?, isbn = ?, editeur = ?, annee_publication = ?, quantite = ?, disponible = ?, categorie = ?, description = ? WHERE id = ?',
            [titre, auteur, isbn, editeur, annee_publication, quantite, disponible, categorie, description, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM livres WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getDisponibles() {
        const [rows] = await db.query('SELECT * FROM livres WHERE disponible > 0');
        return rows;
    }

    static async updateDisponibilite(id, quantite) {
        const [result] = await db.query('UPDATE livres SET disponible = ? WHERE id = ?', [quantite, id]);
        return result.affectedRows > 0;
    }
}

module.exports = Livre;
