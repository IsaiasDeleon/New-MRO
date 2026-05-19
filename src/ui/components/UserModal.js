import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Noti } from '../components/Notificaciones';
import { gapi } from 'gapi-script';
import LoginB from './LoginB';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    UserPlus,
    Shield,
    X
} from 'react-feather';

const HTTP = axios.create({
    baseURL: 'https://ba-mro.mx/Server/Data.php'
});

const clientId =
    '834174042599-ok7fjvug6opngk4devckt6kgcrc3iclf.apps.googleusercontent.com';

const styles = {
    modalContent: {
        border: '0',
        borderRadius: '30px',
        overflow: 'hidden',
        background: '#f5f7fb',
        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18)',
        willChange: 'transform, opacity'
    },

    modalBody: {
        padding: 0,
        background: '#f5f7fb'
    },

    headerHero: {
        position: 'relative',
        padding: '24px 24px 22px',
        background: 'linear-gradient(135deg, #001f34 0%, #17345f 48%, #2d5f9a 100%)',
        color: '#ffffff',
        overflow: 'hidden',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px'
    },

    heroCircleOne: {
        position: 'absolute',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
        top: '-70px',
        right: '-45px',
        pointerEvents: 'none'
    },

    heroCircleTwo: {
        position: 'absolute',
        width: '95px',
        height: '95px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.045)',
        bottom: '-48px',
        left: '-28px',
        pointerEvents: 'none'
    },

    headerContent: {
        position: 'relative',
        zIndex: 2
    },

    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px'
    },

    iconBox: {
        width: '60px',
        height: '60px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.13)',
        border: '1px solid rgba(255,255,255,0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '14px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
    },

    closeButton: {
        width: '40px',
        height: '40px',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'rgba(255,255,255,0.10)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    title: {
        margin: 0,
        fontSize: '1.75rem',
        fontWeight: 950,
        letterSpacing: '-0.03em',
        color: '#ffffff'
    },

    subtitle: {
        margin: '8px 0 0',
        color: 'rgba(255,255,255,0.80)',
        fontSize: '0.95rem',
        lineHeight: 1.55,
        maxWidth: '560px'
    },

    switchWrap: {
        marginTop: '18px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        padding: '6px',
        borderRadius: '999px',
        background: 'rgba(255,255,255,0.11)',
        border: '1px solid rgba(255,255,255,0.14)'
    },

    switchButton: {
        border: 0,
        borderRadius: '999px',
        padding: '11px 12px',
        fontSize: '0.86rem',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.78)',
        background: 'transparent'
    },

    switchButtonActive: {
        background: '#ffffff',
        color: '#001f34',
        boxShadow: '0 8px 18px rgba(0,0,0,0.10)'
    },

    formArea: {
        padding: '20px'
    },

    formCard: {
        background: '#ffffff',
        border: '1px solid #e6edf5',
        borderRadius: '26px',
        padding: '20px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.055)'
    },

    label: {
        color: '#111827',
        fontSize: '0.84rem',
        fontWeight: 900,
        marginBottom: '8px'
    },

    inputGroup: {
        position: 'relative'
    },

    inputIcon: {
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b',
        zIndex: 2
    },

    input: {
        borderRadius: '18px',
        border: '1px solid #dfe7ef',
        padding: '14px 46px',
        fontSize: '0.94rem',
        fontWeight: 700,
        color: '#111827',
        background: '#f8fafc',
        boxShadow: 'none'
    },

    passToggle: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '36px',
        height: '36px',
        borderRadius: '12px',
        border: 0,
        background: 'transparent',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3
    },

    submitButton: {
        width: '100%',
        borderRadius: '999px',
        padding: '14px 16px',
        fontWeight: 950,
        fontSize: '0.98rem',
        border: 0,
        background: '#001f34',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '9px',
        boxShadow: '0 10px 22px rgba(0, 31, 52, 0.15)'
    },

    googleBox: {
        marginTop: '14px',
        paddingTop: '14px',
        borderTop: '1px solid #edf2f7'
    },

    googleTitle: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.8rem',
        fontWeight: 800,
        marginBottom: '12px'
    },

    googleShell: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },

    helperAlert: {
        border: '1px solid #dbeafe',
        background: '#eff6ff',
        color: '#1e3a8a',
        borderRadius: '16px',
        fontSize: '0.83rem',
        fontWeight: 700,
        padding: '12px 14px'
    },

    errorAlert: {
        border: '1px solid #fecdd3',
        background: '#fff1f2',
        color: '#9f1239',
        borderRadius: '16px',
        fontSize: '0.83rem',
        fontWeight: 800,
        padding: '12px 14px'
    },

    footerText: {
        marginTop: '16px',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.9rem',
        fontWeight: 700
    },

    footerButton: {
        padding: 0,
        border: 0,
        background: 'transparent',
        color: '#205c98',
        fontWeight: 950,
        textDecoration: 'underline'
    },

    securityRow: {
        marginTop: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: '#64748b',
        fontSize: '0.8rem',
        fontWeight: 800
    }
};

const UserModal = ({ show, handleClose }) => {
    const { Log } = useContext(AuthContext);
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();

    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const notify = (message) => {
        setNotiCarrito(message);
        setActiveNoti(true);

        setTimeout(() => {
            setActiveNoti(false);
        }, 5000);
    };

    const resetErrors = () => {
        setLocalError('');
    };

    const resetForm = () => {
        setNombre('');
        setCorreo('');
        setPass('');
        setLocalError('');
        setShowPassword(false);
        setLoading(false);
    };

    const closeModal = () => {
        resetForm();

        if (typeof handleClose === 'function') {
            handleClose();
        }
    };

    const toggleForm = () => {
        setIsSignUp((prev) => !prev);
        resetForm();
    };

    const onInputChange = ({ target }) => {
        const { name, value } = target;

        resetErrors();

        switch (name) {
            case 'Correo':
                setCorreo(value);
                break;

            case 'Contrasena':
                setPass(value);
                break;

            case 'Nombre':
                setNombre(value);
                break;

            default:
                break;
        }
    };

    const validateLogin = () => {
        if (!correo.trim()) {
            setLocalError('Ingresa tu correo electrónico.');
            notify('CorreoVacio');
            return false;
        }

        if (!pass.trim()) {
            setLocalError('Ingresa tu contraseña.');
            notify('PassVacio');
            return false;
        }

        return true;
    };

    const validateRegister = () => {
        if (!nombre.trim()) {
            setLocalError('Ingresa tu nombre.');
            notify('NombreVacio');
            return false;
        }

        if (!correo.trim()) {
            setLocalError('Ingresa tu correo electrónico.');
            notify('CorreoVacio');
            return false;
        }

        if (!pass.trim()) {
            setLocalError('Ingresa una contraseña.');
            notify('PassVacio');
            return false;
        }

        if (pass.trim().length < 6) {
            setLocalError('Tu contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        return true;
    };

    const onLogin = async (e) => {
        e.preventDefault();

        if (!validateLogin()) return;

        try {
            setLoading(true);

            const response = await HTTP.post('/Login', {
                user: correo.trim(),
                pass
            });

            if (response.data) {
                const lastPath = localStorage.getItem('lastPath') || '/';
                const data = response.data;

                Log(
                    data.Nombre,
                    data.id,
                    data.img,
                    data.tipoUser,
                    0,
                    true,
                    data.Empresa
                );

                navigate(lastPath, { replace: true });
                closeModal();
            } else {
                setLocalError('El correo o la contraseña no son correctos.');
                notify('UsuarioIncorrecto');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setLocalError('No pudimos iniciar sesión. Intenta nuevamente.');
            notify('UsuarioIncorrecto');
        } finally {
            setLoading(false);
        }
    };

    const onRegister = async (e) => {
        e.preventDefault();

        if (!validateRegister()) return;

        try {
            setLoading(true);

            const response = await HTTP.post('/Registrar', {
                nombre: nombre.trim(),
                correo: correo.trim(),
                pass
            });

            notify(response.data);

            if (String(response.data).toLowerCase().includes('registr')) {
                setIsSignUp(false);
                setPass('');
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setLocalError('No pudimos completar el registro. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId,
                scope: ''
            });
        }

        try {
            gapi.load('client:auth2', start);
        } catch (error) {
            console.error('Error al cargar Google Auth:', error);
        }
    }, []);

    return (
        <>
            <style>{`
                .user-auth-modal-dialog {
                    max-width: 760px;
                }

                .modal-backdrop.show {
                    opacity: 0.45;
                }

                .google-login-shell,
                .google-login-shell > div,
                .google-login-shell iframe {
                    width: 100% !important;
                    min-width: 100% !important;
                    max-width: 100% !important;
                }

                .google-login-shell > div {
                    display: flex !important;
                    justify-content: center !important;
                }

                .google-login-shell div[role="button"] {
                    width: 100% !important;
                    min-height: 52px !important;
                    border-radius: 18px !important;
                    overflow: hidden !important;
                    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.08) !important;
                }

                .google-login-shell iframe {
                    border-radius: 18px !important;
                }

                @media (max-width: 576px) {
                    .user-auth-modal-dialog {
                        max-width: calc(100% - 20px);
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
            `}</style>

            <Modal
                show={show}
                onHide={closeModal}
                centered
                animation={false}
                contentClassName="border-0 bg-transparent"
                dialogClassName="modal-dialog-centered user-auth-modal-dialog"
            >
                <div style={styles.modalContent}>
                    <Modal.Body style={styles.modalBody}>
                        <div style={styles.headerHero}>
                            <div style={styles.heroCircleOne} />
                            <div style={styles.heroCircleTwo} />

                            <div style={styles.headerContent}>
                                <div style={styles.topRow}>
                                    <div>
                                        <div style={styles.iconBox}>
                                            {isSignUp ? <UserPlus size={26} /> : <LogIn size={26} />}
                                        </div>

                                        <h3 style={styles.title}>
                                            {isSignUp ? 'Crear cuenta' : 'Bienvenido'}
                                        </h3>

                                        <p style={styles.subtitle}>
                                            {isSignUp
                                                ? 'Regístrate para guardar favoritos, comprar y cotizar más rápido.'
                                                : 'Inicia sesión para continuar con tus compras, favoritos y cotizaciones.'}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        style={styles.closeButton}
                                        onClick={closeModal}
                                        aria-label="Cerrar"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div style={styles.switchWrap}>
                                    <button
                                        type="button"
                                        style={{
                                            ...styles.switchButton,
                                            ...(!isSignUp ? styles.switchButtonActive : {})
                                        }}
                                        onClick={() => {
                                            setIsSignUp(false);
                                            resetForm();
                                        }}
                                    >
                                        Iniciar sesión
                                    </button>

                                    <button
                                        type="button"
                                        style={{
                                            ...styles.switchButton,
                                            ...(isSignUp ? styles.switchButtonActive : {})
                                        }}
                                        onClick={() => {
                                            setIsSignUp(true);
                                            resetForm();
                                        }}
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={styles.formArea}>
                            <div style={styles.formCard}>
                                {localError ? (
                                    <Alert style={styles.errorAlert}>
                                        {localError}
                                    </Alert>
                                ) : (
                                    <Alert style={styles.helperAlert}>
                                        {isSignUp
                                            ? 'Completa tus datos para crear una cuenta nueva.'
                                            : 'Accede con tu correo y contraseña registrados.'}
                                    </Alert>
                                )}

                                <Form onSubmit={isSignUp ? onRegister : onLogin}>
                                    {isSignUp && (
                                        <Form.Group className="mb-3" controlId="Nombre">
                                            <Form.Label style={styles.label}>
                                                Nombre
                                            </Form.Label>

                                            <div style={styles.inputGroup}>
                                                <User size={17} style={styles.inputIcon} />

                                                <Form.Control
                                                    type="text"
                                                    name="Nombre"
                                                    value={nombre}
                                                    placeholder="Tu nombre completo"
                                                    onChange={onInputChange}
                                                    required
                                                    style={styles.input}
                                                />
                                            </div>
                                        </Form.Group>
                                    )}

                                    <Form.Group className="mb-3" controlId="Correo">
                                        <Form.Label style={styles.label}>
                                            Correo electrónico
                                        </Form.Label>

                                        <div style={styles.inputGroup}>
                                            <Mail size={17} style={styles.inputIcon} />

                                            <Form.Control
                                                type="email"
                                                name="Correo"
                                                value={correo}
                                                placeholder="correo@empresa.com"
                                                onChange={onInputChange}
                                                required
                                                style={styles.input}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="Contrasena">
                                        <Form.Label style={styles.label}>
                                            Contraseña
                                        </Form.Label>

                                        <div style={styles.inputGroup}>
                                            <Lock size={17} style={styles.inputIcon} />

                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                name="Contrasena"
                                                value={pass}
                                                placeholder="Ingresa tu contraseña"
                                                onChange={onInputChange}
                                                required
                                                style={styles.input}
                                            />

                                            <button
                                                type="button"
                                                style={styles.passToggle}
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                aria-label={
                                                    showPassword
                                                        ? 'Ocultar contraseña'
                                                        : 'Mostrar contraseña'
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={17} />
                                                ) : (
                                                    <Eye size={17} />
                                                )}
                                            </button>
                                        </div>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        style={styles.submitButton}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" animation="border" />
                                                Procesando...
                                            </>
                                        ) : isSignUp ? (
                                            <>
                                                <UserPlus size={17} />
                                                Crear cuenta
                                            </>
                                        ) : (
                                            <>
                                                <LogIn size={17} />
                                                Iniciar sesión
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                {!isSignUp && (
                                    <div style={styles.googleBox}>
                                        <div style={styles.googleTitle}>
                                            O continúa con Google
                                        </div>

                                        <div
                                            className="google-login-shell"
                                            style={styles.googleShell}
                                        >
                                            <LoginB handleClose={closeModal} />
                                        </div>
                                    </div>
                                )}

                                <div style={styles.footerText}>
                                    {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta aún?'}{' '}
                                    <button
                                        type="button"
                                        style={styles.footerButton}
                                        onClick={toggleForm}
                                    >
                                        {isSignUp ? 'Iniciar sesión' : 'Registrarse'}
                                    </button>
                                </div>

                                <div style={styles.securityRow}>
                                    <Shield size={15} />
                                    Acceso seguro para compradores y vendedores
                                </div>
                            </div>
                        </div>
                    </Modal.Body>

                    <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
                </div>
            </Modal>
        </>
    );
};

export default UserModal;