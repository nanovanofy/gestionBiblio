import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { livreService } from '../services/api';
import bookIcon from '../assets/icons/book.svg';

const LivreForm = ({ onSuccess, onCancel }) => {
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
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            await livreService.create(formData);
            setSuccess(true);
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
            if (onSuccess) {
                setTimeout(onSuccess, 1500);
            }
        } catch (err) {
            setError('Erreur lors de l\'ajout du livre. Veuillez vérifier les champs.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container fluid>
            <Card className="mb-4">
                <Card.Header className="bg-success text-white d-flex align-items-center">
                    <img src={bookIcon} width="30" height="30" className="me-2" alt="Ajouter" />
                    <h4 className="mb-0">Ajouter un nouveau livre</h4>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Livre ajouté avec succès !</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Titre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="titre"
                                        value={formData.titre}
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Description du livre..."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex gap-2">
                            <Button 
                                variant="success" 
                                type="submit" 
                                disabled={submitting}
                            >
                                {submitting ? 'Ajout en cours...' : 'Ajouter le livre'}
                            </Button>
                            {onCancel && (
                                <Button variant="secondary" onClick={onCancel}>
                                    Annuler
                                </Button>
                            )}
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LivreForm;