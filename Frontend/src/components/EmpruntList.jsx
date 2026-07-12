import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Container, Row, Col, Card, Modal, Form } from 'react-bootstrap';
import { empruntService, livreService, utilisateurService } from '../services/api';
import borrowIcon from '../assets/icons/borrow.svg';

const EmpruntList = () => {
    const [emprunts, setEmprunts] = useState([]);
    const [livres, setLivres] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        utilisateur_id: '',
        livre_id: '',
        date_emprunt: new Date().toISOString().split('T')[0],
        date_retour_prevue: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [empruntsRes, livresRes, utilisateursRes] = await Promise.all([
                empruntService.getAll(),
                livreService.getDisponibles(),
                utilisateurService.getAll()
            ]);
            setEmprunts(empruntsRes.data || []);
            setLivres(livresRes.data || []);
            setUtilisateurs(utilisateursRes.data || []);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des données');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetour = async (id) => {
        if (window.confirm('Confirmer le retour de ce livre ?')) {
            try {
                await empruntService.retourner(id);
                await fetchAllData(); // Recharger les données
            } catch (err) {
                alert('Erreur lors du retour du livre');
            }
        }
    };

    const handleShowAddModal = () => {
        setFormData({
            utilisateur_id: '',
            livre_id: '',
            date_emprunt: new Date().toISOString().split('T')[0],
            date_retour_prevue: ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            await empruntService.create(formData);
            await fetchAllData(); // Recharger les données
            handleCloseModal();
        } catch (err) {
            alert('Erreur lors de la création de l\'emprunt');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (statut, dateRetourPrevue) => {
        if (statut === 'rendu') {
            return <Badge bg="success">Rendu</Badge>;
        }
        if (statut === 'retard') {
            return <Badge bg="danger">En retard</Badge>;
        }
        const today = new Date();
        const dateRetour = new Date(dateRetourPrevue);
        if (dateRetour < today) {
            return <Badge bg="danger">En retard</Badge>;
        }
        return <Badge bg="warning" text="dark">En cours</Badge>;
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Chargement des emprunts...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <>
            <Container fluid className="mt-4">
                <Row>
                    <Col>
                        <Card>
                            <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={borrowIcon} width="30" height="30" className="me-2" alt="Emprunts" />
                                    <h4 className="mb-0">Liste des Emprunts</h4>
                                    <Badge bg="light" text="dark" className="ms-3">
                                        {emprunts.length} emprunt(s)
                                    </Badge>
                                </div>
                                <Button variant="light" size="sm" onClick={handleShowAddModal}>
                                    <i className="bi bi-plus-circle"></i> Nouvel Emprunt
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table striped bordered hover>
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Utilisateur</th>
                                                <th>Livre</th>
                                                <th>Date d'emprunt</th>
                                                <th>Retour prévu</th>
                                                <th>Statut</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {emprunts.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        Aucun emprunt trouvé
                                                    </td>
                                                </tr>
                                            ) : (
                                                emprunts.map((emprunt, index) => (
                                                    <tr key={emprunt.id}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {emprunt.utilisateur_prenom} {emprunt.utilisateur_nom}
                                                            <br />
                                                            <small className="text-muted">ID: {emprunt.utilisateur_id}</small>
                                                        </td>
                                                        <td>
                                                            <strong>{emprunt.livre_titre}</strong>
                                                            <br />
                                                            <small className="text-muted">{emprunt.livre_auteur}</small>
                                                        </td>
                                                        <td>{new Date(emprunt.date_emprunt).toLocaleDateString()}</td>
                                                        <td>{new Date(emprunt.date_retour_prevue).toLocaleDateString()}</td>
                                                        <td>{getStatusBadge(emprunt.statut, emprunt.date_retour_prevue)}</td>
                                                        <td>
                                                            {emprunt.statut !== 'rendu' && (
                                                                <Button 
                                                                    variant="success" 
                                                                    size="sm"
                                                                    onClick={() => handleRetour(emprunt.id)}
                                                                >
                                                                    Retourner
                                                                </Button>
                                                            )}
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
            </Container>

            {/* Modal Nouvel Emprunt */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nouvel Emprunt</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Utilisateur *</Form.Label>
                                    <Form.Select
                                        name="utilisateur_id"
                                        value={formData.utilisateur_id}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">Sélectionner un utilisateur</option>
                                        {utilisateurs.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.prenom} {user.nom} - {user.email}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Livre *</Form.Label>
                                    <Form.Select
                                        name="livre_id"
                                        value={formData.livre_id}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">Sélectionner un livre</option>
                                        {livres.map(livre => (
                                            <option key={livre.id} value={livre.id}>
                                                {livre.titre} - {livre.auteur} ({livre.disponible} disponible(s))
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date d'emprunt *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date_emprunt"
                                        value={formData.date_emprunt}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date de retour prévue *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date_retour_prevue"
                                        value={formData.date_retour_prevue}
                                        onChange={handleFormChange}
                                        required
                                        min={formData.date_emprunt}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                        <Button variant="info" type="submit" disabled={submitting}>
                            {submitting ? 'Enregistrement...' : 'Ajouter l\'emprunt'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default EmpruntList;
