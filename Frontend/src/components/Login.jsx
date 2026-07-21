import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import logo from '../assets/icons/logo.svg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 👈 Nouvel état
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = login(email, password);
            if (success) {
                navigate('/');
            } else {
                setError('Email ou mot de passe incorrect');
            }
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour basculer l'affichage du mot de passe
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container fluid className="login-page min-vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <Card className="shadow-lg border-0">
                        <Card.Header className="bg-primary text-white text-center py-4 border-0">
                            <img 
                                src={logo} 
                                width="60" 
                                height="60" 
                                alt="Logo Bibliothèque"
                                className="mb-2"
                                style={{ filter: 'brightness(0) invert(1)' }}
                            />
                            <h3 className="mb-0">LIBRARY</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {error && (
                                <Alert variant="danger" className="text-center">
                                    {error}
                                </Alert>
                            )}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder=""
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder=""
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={togglePasswordVisibility}
                                            style={{
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Connexion...' : 'Se connecter'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;