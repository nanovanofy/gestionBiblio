import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Badge, Spinner } from 'react-bootstrap';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { livreService, empruntService, utilisateurService } from '../services/api';
import bookIcon from '../assets/icons/book.svg';
import userIcon from '../assets/icons/user.svg';
import borrowIcon from '../assets/icons/borrow.svg';

const Dashboard = () => {
    const [stats, setStats] = useState({
        livres: 0,
        utilisateurs: 0,
        empruntsEnCours: 0,
        livresDisponibles: 0,
        empruntsParMois: [],
        livresParCategorie: [],
        derniersEmprunts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [livresRes, utilisateursRes, empruntsRes] = await Promise.all([
                livreService.getAll(),
                utilisateurService.getAll(),
                empruntService.getAll()
            ]);

            const livres = livresRes.data || [];
            const utilisateurs = utilisateursRes.data || [];
            const emprunts = empruntsRes.data || [];

            const empruntsEnCours = emprunts.filter(e => e.statut === 'en_cours');
            const livresDisponibles = livres.filter(l => l.disponible > 0);

            // Statistiques par catégorie
            const categories = {};
            livres.forEach(l => {
                const cat = l.categorie || 'Non catégorisé';
                categories[cat] = (categories[cat] || 0) + 1;
            });
            const livresParCategorie = Object.entries(categories).map(([name, value]) => ({
                name,
                value
            }));

            // Emprunts par mois (derniers 6 mois)
            const mois = {};
            const sixMois = new Date();
            sixMois.setMonth(sixMois.getMonth() - 5);
            
            emprunts.forEach(e => {
                const date = new Date(e.date_emprunt);
                if (date >= sixMois) {
                    const key = `${date.getMonth()+1}/${date.getFullYear()}`;
                    mois[key] = (mois[key] || 0) + 1;
                }
            });
            
            const empruntsParMois = Object.entries(mois).map(([name, value]) => ({
                name,
                value
            })).slice(-6);

            setStats({
                livres: livres.length,
                utilisateurs: utilisateurs.length,
                empruntsEnCours: empruntsEnCours.length,
                livresDisponibles: livresDisponibles.length,
                empruntsParMois,
                livresParCategorie,
                derniersEmprunts: emprunts.slice(0, 5)
            });
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <Card className="stat-card h-100 border-0 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="text-muted mb-2">{title}</h6>
                        <h2 className="fw-bold mb-0">{value}</h2>
                        {subtitle && <small className="text-success">{subtitle}</small>}
                    </div>
                    <div className={`stat-icon bg-${color}`}>
                        <img src={icon} width="30" height="30" alt={title} />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );

    const COLORS = ['#2e7d32', '#dddd65', '#f2b307', '#3480a6', '#a5d6a7', '#e14720'];

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="success" />
                <p className="mt-3">Chargement du tableau de bord...</p>
            </div>
        );
    }

    return (
        <div className="dashboard fade-in">
            <h2 className="mb-4 fw-bold text-success">
                <i className="bi bi-speedometer2 me-2"></i>
                Tableau de bord
            </h2>
            
            {/* Statistiques */}
            <Row className="mb-4">
                <Col md={3} sm={6} className="mb-3">
                    <StatCard 
                        title="Total Livres" 
                        value={stats.livres} 
                        icon={bookIcon}
                        color="primary"
                    />
                </Col>
                <Col md={3} sm={6} className="mb-3">
                    <StatCard 
                        title="Livres Disponibles" 
                        value={stats.livresDisponibles} 
                        icon={bookIcon}
                        color="success"
                        subtitle={`${Math.round((stats.livresDisponibles/stats.livres)*100)}% du total`}
                    />
                </Col>
                <Col md={3} sm={6} className="mb-3">
                    <StatCard 
                        title="Utilisateurs" 
                        value={stats.utilisateurs} 
                        icon={userIcon}
                        color="info"
                    />
                </Col>
                <Col md={3} sm={6} className="mb-3">
                    <StatCard 
                        title="Emprunts en Cours" 
                        value={stats.empruntsEnCours} 
                        icon={borrowIcon}
                        color="warning"
                    />
                </Col>
            </Row>

            {/* Graphiques */}
            <Row className="mb-4">
                <Col lg={7} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold text-success">
                            <i className="bi bi-bar-chart me-2"></i>
                            Évolution des emprunts (6 derniers mois)
                        </Card.Header>
                        <Card.Body>
                            {stats.empruntsParMois.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.empruntsParMois}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#2e7d32" radius={[5, 5, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-muted">Aucune donnée disponible</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold text-success">
                            <i className="bi bi-pie-chart me-2"></i>
                            Livres par catégorie
                        </Card.Header>
                        <Card.Body>
                            {stats.livresParCategorie.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={stats.livresParCategorie}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {stats.livresParCategorie.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-muted">Aucune donnée disponible</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Derniers emprunts */}
            <Row>
                <Col md={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold text-success">
                            <i className="bi bi-clock-history me-2"></i>
                            Derniers emprunts
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>Utilisateur</th>
                                            <th>Livre</th>
                                            <th>Date emprunt</th>
                                            <th>Retour prévu</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.derniersEmprunts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    Aucun emprunt enregistré
                                                </td>
                                            </tr>
                                        ) : (
                                            stats.derniersEmprunts.map((emprunt, index) => (
                                                <tr key={index}>
                                                    <td>{emprunt.utilisateur_prenom} {emprunt.utilisateur_nom}</td>
                                                    <td>{emprunt.livre_titre}</td>
                                                    <td>{new Date(emprunt.date_emprunt).toLocaleDateString()}</td>
                                                    <td>{new Date(emprunt.date_retour_prevue).toLocaleDateString()}</td>
                                                    <td>
                                                        <Badge bg={
                                                            emprunt.statut === 'rendu' ? 'success' :
                                                            emprunt.statut === 'retard' ? 'danger' : 'warning'
                                                        }>
                                                            {emprunt.statut === 'en_cours' ? 'En cours' :
                                                             emprunt.statut === 'retard' ? 'En retard' : 'Rendu'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;