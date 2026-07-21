import React, { useState } from 'react';
import { 
    Card, Container, Row, Col, Form, Button, 
    Alert, Badge, Tabs, Tab
} from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Icon from './Icon';

const Settings = () => {
    const { settings, updateSetting, resetSettings, isDark } = useTheme();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    const handleSettingChange = (key, value) => {
        updateSetting(key, value);
        setSavedMessage('Paramètres mis à jour');
        setTimeout(() => setSavedMessage(''), 3000);
    };

    const handleReset = () => {
        resetSettings();
        setShowResetConfirm(false);
        setSavedMessage('Paramètres réinitialisés');
        setTimeout(() => setSavedMessage(''), 3000);
    };

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col>
                    <h2 className="mb-4 fw-bold text-success d-flex align-items-center gap-2">
                        <Icon name="settings" size={32} color="#2e7d32" />
                        Paramètres
                    </h2>

                    {savedMessage && (
                        <Alert variant="success" className="mb-3 d-flex align-items-center gap-2">
                            <Icon name="check" size={20} color="#28a745" />
                            {savedMessage}
                        </Alert>
                    )}

                    <Tabs defaultActiveKey="apparence" className="mb-3">
                        {/* Onglet Apparence */}
                        <Tab 
                            eventKey="apparence" 
                            title={
                                <span className="d-flex align-items-center gap-2">
                                    <Icon name="appearance" size={18} />
                                    Apparence
                                </span>
                            }
                        >
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <h5 className="mb-3 d-flex align-items-center gap-2">
                                        <Icon name="appearance" size={22} color="#2e7d32" />
                                        Thème
                                    </h5>
                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div>
                                                    <strong>Mode actuel :</strong>
                                                    <Badge 
                                                        bg={isDark ? 'dark' : 'light'} 
                                                        text={isDark ? 'light' : 'dark'} 
                                                        className="ms-2 d-inline-flex align-items-center gap-1"
                                                    >
                                                        <Icon 
                                                            name={isDark ? 'moon' : 'sun'} 
                                                            size={14} 
                                                            color={isDark ? 'white' : '#1a1a2e'} 
                                                        />
                                                        {isDark ? 'Sombre' : 'Clair'}
                                                    </Badge>
                                                </div>
                                                <ThemeToggle variant="outline-success" size="md" />
                                            </div>
                                        </Col>
                                    </Row>

                                    <h5 className="mb-3 d-flex align-items-center gap-2">
                                        <Icon name="font" size={22} color="#2e7d32" />
                                        Taille de police
                                    </h5>
                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Taille du texte</Form.Label>
                                                <Form.Select
                                                    value={settings.fontSize}
                                                    onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                                                >
                                                    <option value="small">Petite</option>
                                                    <option value="medium">Moyenne</option>
                                                    <option value="large">Grande</option>
                                                </Form.Select>
                                                <Form.Text className="text-muted">
                                                    Modifie la taille du texte dans toute l'application
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <h5 className="mb-3 d-flex align-items-center gap-2">
                                        <Icon name="layout" size={22} color="#2e7d32" />
                                        Options d'affichage
                                    </h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Check
                                                    type="switch"
                                                    id="compact-mode"
                                                    label={
                                                        <span className="d-flex align-items-center gap-2">
                                                            <Icon name="compress" size={16} />
                                                            Mode compact
                                                        </span>
                                                    }
                                                    checked={settings.compactMode}
                                                    onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                                                />
                                                <Form.Text className="text-muted">
                                                    Réduit les espaces pour afficher plus de contenu
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Check
                                                    type="switch"
                                                    id="animations"
                                                    label={
                                                        <span className="d-flex align-items-center gap-2">
                                                            <Icon name="animation" size={16} />
                                                            Activer les animations
                                                        </span>
                                                    }
                                                    checked={settings.animations}
                                                    onChange={(e) => handleSettingChange('animations', e.target.checked)}
                                                />
                                                <Form.Text className="text-muted">
                                                    Désactive les animations pour améliorer les performances
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Tab>


                        {/* Onglet À propos */}
                        <Tab 
                            eventKey="about" 
                            title={
                                <span className="d-flex align-items-center gap-2">
                                    <Icon name="about" size={18} />
                                    À propos
                                </span>
                            }
                        >
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="text-center py-4">
                                        <div className="display-1 text-success mb-3">
                                            <Icon name="book" size={64} color="#2e7d32" />
                                        </div>
                                        <h3>LIBRARY</h3>
                                        <p className="text-muted">Version 1.0.0</p>
                                        <hr />
                                        <p className="text-muted">
                                            <span className="d-flex align-items-center justify-content-center gap-2">
                                                <p>Une solution de gestion complète pour votre bibliothèque.
Centralisez, organisez et suivez                   l'ensemble de vos ressources en un seul endroit.
Avec son interface moderne et se                   s fonctionnalités intuitives, simplifiez la gestion de vos collections, de vos adhérents et de leurs emprunts au quotidien.</p>
                                               <br />
                                                
                                            </span>
                                            
                                            
                                        </p>
                                        <div className="mt-3 d-flex justify-content-center gap-2 flex-wrap">
                                            <Badge bg="success" className="d-inline-flex align-items-center gap-1">
                                                <Icon name="react" size={14} color="white" />
                                                React
                                            </Badge>
                                            <Badge bg="success" className="d-inline-flex align-items-center gap-1">
                                                <Icon name="node" size={14} color="white" />
                                                Node.js
                                            </Badge>
                                            <Badge bg="success" className="d-inline-flex align-items-center gap-1">
                                                <Icon name="mysql" size={14} color="white" />
                                                MySQL
                                            </Badge>
                                            <Badge bg="success" className="d-inline-flex align-items-center gap-1">
                                                <Icon name="bootstrap" size={14} color="white" />
                                                Bootstrap
                                            </Badge>
                                        </div>
                                        <p>© 2026 Yassal Nanovanofy. All rights reserved.</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>

                    {/* Bouton de réinitialisation */}
                    <div className="mt-3">
                        {showResetConfirm ? (
                            <Alert variant="danger" className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <span className="d-flex align-items-center gap-2">
                                    <Icon name="alert" size={20} color="#dc3545" />
                                    Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?
                                </span>
                                <div className="d-flex gap-2">
                                    <Button variant="danger" size="sm" onClick={handleReset} className="d-flex align-items-center gap-1">
                                        <Icon name="reset" size={16} color="white" />
                                        Oui, réinitialiser
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={() => setShowResetConfirm(false)}>
                                        Annuler
                                    </Button>
                                </div>
                            </Alert>
                        ) : (
                            <Button 
                                variant="outline-danger" 
                                onClick={() => setShowResetConfirm(true)}
                                className="d-flex align-items-center gap-2"
                            >
                                <Icon name="reset" size={18} />
                                Réinitialiser les paramètres
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Settings;
