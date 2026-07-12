import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Container, Row, Col, Card, Modal, Form, InputGroup } from 'react-bootstrap';
import { livreService } from '../services/api';
import bookIcon from '../assets/icons/book.svg';

const LivreList = () => {
    const [livres, setLivres] = useState([]);
    const [filteredLivres, setFilteredLivres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // États pour le modal
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentLivre, setCurrentLivre] = useState(null);
    const [formData, setFormData] = useState({
        titre: '',
        auteur: '',
        isbn: '',
        editeur: '',
        annee_publication: '',
        quantite: 1,
        disponible: 1,
        categorie: '',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchLivres();
    }, []);

    useEffect(() => {
        // Filtrer les livres en fonction du terme de recherche
        const filtered = livres.filter(livre => {
            const search = searchTerm.toLowerCase();
            return (
                livre.titre?.toLowerCase().includes(search) ||
                livre.auteur?.toLowerCase().includes(search) ||
                livre.isbn?.toLowerCase().includes(search) ||
                livre.categorie?.toLowerCase().includes(search) ||
                livre.editeur?.toLowerCase().includes(search)
            );
        });
        setFilteredLivres(filtered);
    }, [searchTerm, livres]);

    const fetchLivres = async () => {
        try {
            setLoading(true);
            const response = await livreService.getAll();
            setLivres(response.data);
            setFilteredLivres(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des livres');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
            try {
                await livreService.delete(id);
                setLivres(livres.filter(livre => livre.id !== id));
            } catch (err) {
                alert('Erreur lors de la suppression du livre');
            }
        }
    };

    const handleShowAddModal = () => {
        setModalMode('add');
        setCurrentLivre(null);
        setFormData({
            titre: '',
            auteur: '',
            isbn: '',
            editeur: '',
            annee_publication: '',
            quantite: 1,
            disponible: 1,
            categorie: '',
            description: ''
        });
        setShowModal(true);
    };

    const handleShowEditModal = (livre) => {
        setModalMode('edit');
        setCurrentLivre(livre);
        setFormData({
            titre: livre.titre || '',
            auteur: livre.auteur || '',
            isbn: livre.isbn || '',
            editeur: livre.editeur || '',
            annee_publication: livre.annee_publication || '',
            quantite: livre.quantite || 1,
            disponible: livre.disponible || 1,
            categorie: livre.categorie || '',
            description: livre.description || ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentLivre(null);
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
                const response = await livreService.create(formData);
                setLivres([response.data, ...livres]);
            } else {
                await livreService.update(currentLivre.id, formData);
                setLivres(livres.map(l => 
                    l.id === currentLivre.id ? { ...l, ...formData } : l
                ));
            }
            handleCloseModal();
        } catch (err) {
            alert(`Erreur lors de ${modalMode === 'add' ? "l'ajout" : "la modification"} du livre`);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Chargement des livres...</p>
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
                            <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
                                <div className="d-flex align-items-center">
                                    <img src={bookIcon} width="30" height="30" className="me-2" alt="Livres" />
                                    <h4 className="mb-0">Liste des Livres</h4>
                                    <Badge bg="light" text="dark" className="ms-3">
                                        {filteredLivres.length} livre(s)
                                    </Badge>
                                </div>
                                <div className="d-flex gap-2 mt-2 mt-sm-0">
                                    <InputGroup style={{ maxWidth: '250px' }}>
                                        <InputGroup.Text>
                                            <i className="bi bi-search"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                    <Button variant="light" size="sm" onClick={handleShowAddModal}>
                                        <i className="bi bi-plus-circle"></i> Nouveau
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table striped bordered hover>
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Titre</th>
                                                <th>Auteur</th>
                                                <th>ISBN</th>
                                                <th>Quantité</th>
                                                <th>Disponibles</th>
                                                <th>Catégorie</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredLivres.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center">
                                                        {searchTerm ? 'Aucun livre ne correspond à votre recherche' : 'Aucun livre trouvé'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredLivres.map((livre, index) => (
                                                    <tr key={livre.id}>
                                                        <td>{index + 1}</td>
                                                        <td><strong>{livre.titre}</strong></td>
                                                        <td>{livre.auteur}</td>
                                                        <td><code>{livre.isbn || 'N/A'}</code></td>
                                                        <td>{livre.quantite}</td>
                                                        <td>
                                                            <Badge bg={livre.disponible > 0 ? 'success' : 'danger'}>
                                                                {livre.disponible > 0 ? `${livre.disponible} disponible(s)` : 'Indisponible'}
                                                            </Badge>
                                                        </td>
                                                        <td>{livre.categorie || 'Non catégorisé'}</td>
                                                        <td>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm" 
                                                                className="me-1"
                                                                onClick={() => handleShowEditModal(livre)}
                                                            >
                                                                Modifier
                                                            </Button>
                                                            <Button 
                                                                variant="outline-danger" 
                                                                size="sm"
                                                                onClick={() => handleDelete(livre.id)}
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

            {/* Modal pour ajouter/modifier */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalMode === 'add' ? 'Ajouter un nouveau livre' : 'Modifier le livre'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Titre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="titre"
                                        value={formData.titre}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Entrez le titre du livre"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Auteur *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="auteur"
                                        value={formData.auteur}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Entrez le nom de l'auteur"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>ISBN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="isbn"
                                        value={formData.isbn}
                                        onChange={handleFormChange}
                                        placeholder="Ex: 978-2-07-061275-8"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Éditeur</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="editeur"
                                        value={formData.editeur}
                                        onChange={handleFormChange}
                                        placeholder="Nom de l'éditeur"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Année de publication</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="annee_publication"
                                        value={formData.annee_publication}
                                        onChange={handleFormChange}
                                        placeholder="2023"
                                        min="1000"
                                        max={new Date().getFullYear()}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Quantité</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantite"
                                        value={formData.quantite}
                                        onChange={handleFormChange}
                                        min="1"
                                        max="999"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Catégorie</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="categorie"
                                        value={formData.categorie}
                                        onChange={handleFormChange}
                                        placeholder="Ex: Roman, Science-Fiction"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows="3"
                                        placeholder="Description du livre..."
                                    />
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

export default LivreList;