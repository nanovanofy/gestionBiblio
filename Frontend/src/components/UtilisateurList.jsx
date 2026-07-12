import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Container, Row, Col, Card, Modal, Form } from 'react-bootstrap';
import { utilisateurService } from '../services/api';
import userIcon from '../assets/icons/user.svg';

const UtilisateurList = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentUtilisateur, setCurrentUtilisateur] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        statut: 'actif'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUtilisateurs();
    }, []);

    const fetchUtilisateurs = async () => {
        try {
            setLoading(true);
            const response = await utilisateurService.getAll();
            setUtilisateurs(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await utilisateurService.delete(id);
                setUtilisateurs(utilisateurs.filter(user => user.id !== id));
            } catch (err) {
                alert('Erreur lors de la suppression de l\'utilisateur');
            }
        }
    };

    const handleShowAddModal = () => {
        setModalMode('add');
        setCurrentUtilisateur(null);
        setFormData({
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            adresse: '',
            statut: 'actif'
        });
        setShowModal(true);
    };

    const handleShowEditModal = (utilisateur) => {
        setModalMode('edit');
        setCurrentUtilisateur(utilisateur);
        setFormData({
            nom: utilisateur.nom || '',
            prenom: utilisateur.prenom || '',
            email: utilisateur.email || '',
            telephone: utilisateur.telephone || '',
            adresse: utilisateur.adresse || '',
            statut: utilisateur.statut || 'actif'
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentUtilisateur(null);
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
            if (modalMode === 'add') {
                const response = await utilisateurService.create(formData);
                setUtilisateurs([response.data, ...utilisateurs]);
            } else {
                await utilisateurService.update(currentUtilisateur.id, formData);
                setUtilisateurs(utilisateurs.map(u => 
                    u.id === currentUtilisateur.id ? { ...u, ...formData } : u
                ));
            }
            handleCloseModal();
        } catch (err) {
            alert(`Erreur lors de ${modalMode === 'add' ? "l'ajout" : "la modification"} de l'utilisateur`);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Chargement des utilisateurs...</p>
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
                            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={userIcon} width="30" height="30" className="me-2" alt="Utilisateurs" />
                                    <h4 className="mb-0">Liste des Utilisateurs</h4>
                                    <Badge bg="light" text="dark" className="ms-3">
                                        {utilisateurs.length} utilisateur(s)
                                    </Badge>
                                </div>
                                <Button variant="light" size="sm" onClick={handleShowAddModal}>
                                    <i className="bi bi-plus-circle"></i> Nouvel Utilisateur
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table striped bordered hover>
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Nom</th>
                                                <th>Prénom</th>
                                                <th>Email</th>
                                                <th>Téléphone</th>
                                                <th>Statut</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {utilisateurs.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center">
                                                        Aucun utilisateur trouvé
                                                    </td>
                                                </tr>
                                            ) : (
                                                utilisateurs.map((user, index) => (
                                                    <tr key={user.id}>
                                                        <td>{index + 1}</td>
                                                        <td><strong>{user.nom}</strong></td>
                                                        <td>{user.prenom}</td>
                                                        <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                                        <td>{user.telephone || 'N/A'}</td>
                                                        <td>
                                                            <Badge bg={user.statut === 'actif' ? 'success' : 'secondary'}>
                                                                {user.statut || 'actif'}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm" 
                                                                className="me-1"
                                                                onClick={() => handleShowEditModal(user)}
                                                            >
                                                                Modifier
                                                            </Button>
                                                            <Button 
                                                                variant="outline-danger" 
                                                                size="sm"
                                                                onClick={() => handleDelete(user.id)}
                                                            >
                                                                Supprimer
                                                            </Button>
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

            {/* Modal Utilisateur */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalMode === 'add' ? 'Ajouter un nouvel utilisateur' : 'Modifier l\'utilisateur'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Nom de l'utilisateur"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Prénom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Prénom de l'utilisateur"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="email@exemple.com"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Téléphone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleFormChange}
                                        placeholder="0123456789"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="adresse"
                                        value={formData.adresse}
                                        onChange={handleFormChange}
                                        rows="2"
                                        placeholder="Adresse de l'utilisateur"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Statut</Form.Label>
                                    <Form.Select
                                        name="statut"
                                        value={formData.statut}
                                        onChange={handleFormChange}
                                    >
                                        <option value="actif">Actif</option>
                                        <option value="inactif">Inactif</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                        <Button variant="success" type="submit" disabled={submitting}>
                            {submitting ? 'Enregistrement...' : modalMode === 'add' ? 'Ajouter' : 'Modifier'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default UtilisateurList;
