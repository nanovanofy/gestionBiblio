import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Livres
export const livreService = {
    getAll: () => api.get('/livres'),
    getById: (id) => api.get(`/livres/${id}`),
    getDisponibles: () => api.get('/livres/disponibles'),
    create: (data) => api.post('/livres', data),
    update: (id, data) => api.put(`/livres/${id}`, data),
    delete: (id) => api.delete(`/livres/${id}`),
};

// Utilisateurs
export const utilisateurService = {
    getAll: () => api.get('/utilisateurs'),
    getById: (id) => api.get(`/utilisateurs/${id}`),
    create: (data) => api.post('/utilisateurs', data),
    update: (id, data) => api.put(`/utilisateurs/${id}`, data),
    delete: (id) => api.delete(`/utilisateurs/${id}`),
};

// Emprunts
export const empruntService = {
    getAll: () => api.get('/emprunts'),
    getById: (id) => api.get(`/emprunts/${id}`),
    getEnCours: () => api.get('/emprunts/en-cours'),
    getByUtilisateur: (utilisateurId) => api.get(`/emprunts/utilisateur/${utilisateurId}`),
    create: (data) => api.post('/emprunts', data),
    retourner: (id) => api.put(`/emprunts/${id}/retourner`),
};