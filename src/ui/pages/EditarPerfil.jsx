import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Spinner,
    Badge,
    InputGroup
} from 'react-bootstrap';

import { AuthContext } from '../../auth/AuthContext';
import { useFetchData } from '../../hooks/useFetchData';
import { Noti } from '../components/Notificaciones';
import Footer from '../components/footer';

const HTTP = axios.create({
    baseURL: 'https://badgercore.cloud/MRO/Server/Data.php'
    // baseURL: "http://localhost/Server/Data.php"
});

const DEFAULT_USER_IMAGE = 'https://badgercore.cloud/MRO/Server/Images/Ge.jpg';
const IMAGE_BASE_URL = 'https://badgercore.cloud/MRO/Server/ImagesUser/';

const styles = {
    page: {
        background: '#f5f7fb',
        minHeight: '100vh'
    },
    heroCard: {
        border: '0',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)'
    },
    heroHeader: {
        height: '120px',
        background: 'linear-gradient(135deg, #111827 0%, #34495E 55%, #205c98 100%)'
    },
    avatarWrapper: {
        width: '150px',
        height: '150px',
        margin: '-75px auto 0',
        borderRadius: '50%',
        border: '6px solid #fff',
        background: '#fff',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)'
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    cameraButton: {
        position: 'absolute',
        right: '4px',
        bottom: '8px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    softCard: {
        border: '0',
        borderRadius: '22px',
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)'
    },
    sectionTitle: {
        fontWeight: 800,
        color: '#111827',
        marginBottom: '4px'
    },
    sectionSubtitle: {
        color: '#6b7280',
        fontSize: '0.92rem',
        marginBottom: 0
    },
    infoItem: {
        padding: '14px 0',
        borderBottom: '1px solid #eef2f7'
    },
    infoLabel: {
        color: '#6b7280',
        fontSize: '0.82rem',
        marginBottom: '2px'
    },
    infoValue: {
        color: '#111827',
        fontWeight: 700,
        wordBreak: 'break-word'
    },
    formControl: {
        borderRadius: '14px',
        padding: '11px 14px'
    },
    actionBar: {
        gap: '10px',
        flexWrap: 'wrap'
    },
    sellerCard: {
        border: '0',
        borderRadius: '22px',
        background: 'linear-gradient(135deg, #111827 0%, #263447 100%)',
        color: '#fff',
        overflow: 'hidden',
        boxShadow: '0 14px 32px rgba(15, 23, 42, 0.16)'
    }
};

const EstadoMunicipioSelector = ({
    estado,
    setEstado,
    municipio,
    setMunicipio,
    label = '',
    setNameEstado,
    setNameMunicipio,
    disabled = false
}) => {
    const [valuesEstado, setValuesEstado] = useState([]);
    const [valuesMunicipio, setValuesMunicipio] = useState([]);
    const [loadingEstados, setLoadingEstados] = useState(false);
    const [loadingMunicipios, setLoadingMunicipios] = useState(false);

    useEffect(() => {
        getEstados();
    }, []);

    useEffect(() => {
        if (estado) {
            getMunicipios(estado);
        } else {
            setValuesMunicipio([]);
            if (setNameEstado) setNameEstado('');
        }
    }, [estado]);
    useEffect(() => {
        if (!municipio || valuesMunicipio.length === 0) {
            if (setNameMunicipio) setNameMunicipio('');
            return;
        }
    
        const municipioEncontrado = valuesMunicipio.find(
            (item) => String(item.id) === String(municipio)
        );
    
        if (setNameMunicipio) {
            setNameMunicipio(municipioEncontrado?.municipio || '');
        }
    }, [municipio, valuesMunicipio, setNameMunicipio]);
    const getEstados = async () => {
        try {
            setLoadingEstados(true);
            const response = await HTTP.post('/getEstado', { N: '2' });
            setValuesEstado(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al obtener estados:', error);
            setValuesEstado([]);
        } finally {
            setLoadingEstados(false);
        }
    };

    const getMunicipios = async (idEstado) => {
        try {
            setLoadingMunicipios(true);

            const [municipiosResponse, estadoNombreResponse] = await Promise.all([
                HTTP.post('/getMunicipio', { Estado: idEstado }),
                HTTP.post('/getNameEstado', { idEstado })
            ]);

            setValuesMunicipio(
                Array.isArray(municipiosResponse.data) ? municipiosResponse.data : []
            );

            const nombreEstado = estadoNombreResponse.data?.[0]?.estado || '';
            if (setNameEstado) setNameEstado(nombreEstado);
        } catch (error) {
            console.error('Error al obtener municipios:', error);
            setValuesMunicipio([]);
            if (setNameEstado) setNameEstado('');
        } finally {
            setLoadingMunicipios(false);
        }
    };

    return (
        <Row className="g-3">
            <Col md={6}>
                <Form.Group>
                    <Form.Label className="fw-semibold">
                        {label ? `${label} Estado` : 'Estado'}
                    </Form.Label>
                    <Form.Select
                        value={estado || ''}
                        onChange={(e) => setEstado(e.target.value)}
                        disabled={disabled || loadingEstados}
                        style={styles.formControl}
                    >
                        <option value="">
                            {loadingEstados ? 'Cargando estados...' : 'Selecciona un estado'}
                        </option>

                        {valuesEstado.map((val) => (
                            <option key={val.id} value={val.id}>
                                {val.estado}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>

            <Col md={6}>
                <Form.Group>
                    <Form.Label className="fw-semibold">
                        {label ? `${label} Municipio` : 'Municipio'}
                    </Form.Label>
                    <Form.Select
                        value={municipio || ''}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                        
                            setMunicipio(selectedId);
                        
                            const selectedMunicipio = valuesMunicipio.find(
                                (item) => String(item.id) === String(selectedId)
                            );
                        
                            if (setNameMunicipio) {
                                setNameMunicipio(selectedMunicipio?.municipio || '');
                            }
                        }}
                        disabled={disabled || !estado || loadingMunicipios}
                        style={styles.formControl}
                    >
                        <option value="">
                            {loadingMunicipios ? 'Cargando municipios...' : 'Selecciona un municipio'}
                        </option>

                        {valuesMunicipio.map((val) => (
                            <option key={val.id} value={val.id}>
                                {val.municipio}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Col>
        </Row>
    );
};

export const EditarPerfil = ({ numArticulos, setMenu }) => {
    const { user } = useContext(AuthContext);
    const idU = user?.id;

    const fileInputRef = useRef(null);

    const [notiCarrito, setNotiCarrito] = useState('');
    const [activeNoti, setActiveNoti] = useState(false);

    const [otraUbiCheck, setOtraUbiCheck] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [savingProfile, setSavingProfile] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [savingLocation, setSavingLocation] = useState(false);

    const [nameEstado, setNameEstado] = useState('');
    const [nameEstado2, setNameEstado2] = useState('');
    const [nameMunicipio, setNameMunicipio] = useState('');
const [nameMunicipio2, setNameMunicipio2] = useState('');

    const [errors, setErrors] = useState({});

    const {
        nombre,
        setNombre,
        telefono,
        setTelefono,
        pass,
        setPass,
        direccion,
        setDireccion,
        cp,
        setCP,
        correo,
        google,
        pais,
        estado,
        setEstado,
        municipio,
        setMunicipio,
        latitude,
        longitude,
        direccion2,
        setDireccion2,
        cp2,
        setCP2,
        estado2,
        setEstado2,
        municipio2,
        setMunicipio2,
        compras
    } = useFetchData(idU);

    const userImage = useMemo(() => {
        if (user?.google === 1 && user?.img) return user.img;
        if (user?.img) return `${IMAGE_BASE_URL}${user.img}`;
        return DEFAULT_USER_IMAGE;
    }, [user]);

    const isGoogleUser = Number(google) === 1 || Number(user?.google) === 1;

    const showMessage = (message, time = 4500) => {
        setNotiCarrito(message);
        setActiveNoti(true);

        setTimeout(() => {
            setActiveNoti(false);
        }, time);
    };

    const onlyNumbers = (value = '') => {
        return String(value).replace(/\D/g, '');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!String(nombre || '').trim()) {
            newErrors.nombre = 'El nombre es obligatorio.';
        }

        const cleanPhone = onlyNumbers(telefono);
        if (!cleanPhone) {
            newErrors.telefono = 'El teléfono es obligatorio.';
        } else if (cleanPhone.length < 10) {
            newErrors.telefono = 'El teléfono debe tener al menos 10 dígitos.';
        }

        if (!isGoogleUser && !String(pass || '').trim()) {
            newErrors.pass = 'La contraseña es obligatoria.';
        }

        if (!String(direccion || '').trim()) {
            newErrors.direccion = 'La dirección es obligatoria.';
        }

        const cleanCP = onlyNumbers(cp);
        if (!cleanCP) {
            newErrors.cp = 'El código postal es obligatorio.';
        } else if (cleanCP.length !== 5) {
            newErrors.cp = 'El código postal debe tener 5 dígitos.';
        }

        if (!estado) {
            newErrors.estado = 'Selecciona un estado.';
        }

        if (!municipio) {
            newErrors.municipio = 'Selecciona un municipio.';
        }

        if (!otraUbiCheck) {
            if (!String(direccion2 || '').trim()) {
                newErrors.direccion2 = 'La dirección de facturación es obligatoria.';
            }

            const cleanCP2 = onlyNumbers(cp2);
            if (!cleanCP2) {
                newErrors.cp2 = 'El CP de facturación es obligatorio.';
            } else if (cleanCP2.length !== 5) {
                newErrors.cp2 = 'El CP de facturación debe tener 5 dígitos.';
            }

            if (!estado2) {
                newErrors.estado2 = 'Selecciona el estado de facturación.';
            }

            if (!municipio2) {
                newErrors.municipio2 = 'Selecciona el municipio de facturación.';
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = ({ target }) => {
        const { name, value } = target;

        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
            [name.toLowerCase()]: undefined
        }));

        switch (name) {
            case 'Nombre':
                setNombre(value);
                break;

            case 'Telefono':
                setTelefono(onlyNumbers(value).slice(0, 10));
                break;

            case 'Password':
                setPass(value);
                break;

            case 'Direccion':
                setDireccion(value);
                break;

            case 'CP':
                setCP(onlyNumbers(value).slice(0, 5));
                break;

            case 'Direccion2':
                setDireccion2(value);
                break;

            case 'CP2':
                setCP2(onlyNumbers(value).slice(0, 5));
                break;

            default:
                break;
        }
    };

    const handleCheckboxChange = () => {
        setOtraUbiCheck((prev) => !prev);
        setErrors({});
    };

    const SaveDetailsUser = async () => {
        if (!validateForm()) {
            showMessage('Revisa los campos marcados antes de guardar.');
            return;
        }

        const datos = {
            idU,
            Nombre: String(nombre || '').trim(),
            Telefono: String(telefono || '').trim(),
            Password: pass,
            Direccion: String(direccion || '').trim(),
            CP: String(cp || '').trim(),
            Estado: estado,
            Municipio: municipio,
            OtraUbiCheck: otraUbiCheck ? 1 : 0,
            Direccion2: otraUbiCheck ? '' : String(direccion2 || '').trim(),
            CP2: otraUbiCheck ? '' : String(cp2 || '').trim(),
            Estado2: otraUbiCheck ? 1 : estado2,
            Municipio2: otraUbiCheck ? 1 : municipio2
        };

        try {
            setSavingProfile(true);

            const response = await HTTP.post('/SaveDetailsUser', datos);

            if (response.data === 'Actualizado') {
                showMessage('Datos actualizados correctamente.');
            } else {
                showMessage(
                    typeof response.data === 'string'
                        ? response.data
                        : 'No se pudo actualizar la información.'
                );
            }
        } catch (error) {
            console.error('Error al guardar datos:', error);
            showMessage('No se pudo guardar la información. Intenta nuevamente.');
        } finally {
            setSavingProfile(false);
        }
    };

    const validateImage = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSizeMB = 5;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (!file) {
            return 'Selecciona una imagen.';
        }

        if (!allowedTypes.includes(file.type)) {
            return 'Solo se permiten imágenes JPG o PNG.';
        }

        if (file.size > maxSizeBytes) {
            return `La imagen no debe pesar más de ${maxSizeMB}MB.`;
        }

        return null;
    };

    const uploadUserImage = async (file) => {
        const errorMessage = validateImage(file);

        if (errorMessage) {
            showMessage(errorMessage);
            return;
        }

        try {
            setUploadingImage(true);

            const formData = new FormData();
            formData.set('file', file);

            const imageResponse = await HTTP.post('/ImagesUser', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const imageName = imageResponse.data;

            if (!imageName) {
                showMessage('No se pudo subir la imagen.');
                return;
            }

            const updateResponse = await HTTP.post('/UpdateImagesUser', {
                NameImg: imageName,
                idU
            });

            showMessage(
                typeof updateResponse.data === 'string'
                    ? updateResponse.data
                    : 'Foto actualizada correctamente.',
                5000
            );
        } catch (error) {
            console.error('Error al subir imagen:', error);
            showMessage('No se pudo actualizar la foto. Intenta nuevamente.');
        } finally {
            setUploadingImage(false);
        }
    };

    const inputChange = (event) => {
        const file = event.target.files?.[0];

        if (file) {
            uploadUserImage(file);
        }

        event.target.value = '';
    };

    const openFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDropImage = (event) => {
        event.preventDefault();

        const file = event.dataTransfer.files?.[0];

        if (file) {
            uploadUserImage(file);
        }
    };

    const handleDragOverImage = (event) => {
        event.preventDefault();
    };

    const UbicaionMessage = () => {
        if (!navigator.geolocation) {
            showMessage('Tu navegador no permite obtener la ubicación.');
            return;
        }

        setSavingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const currentLatitude = position.coords.latitude;
                    const currentLongitude = position.coords.longitude;

                    if (!currentLatitude || !currentLongitude) {
                        showMessage('No se pudo obtener tu ubicación actual.');
                        return;
                    }

                    const response = await HTTP.post('/saveUbicacion', {
                        idU,
                        latitude: currentLatitude,
                        longitude: currentLongitude
                    });

                    if (response.data === 'Guardada') {
                        showMessage('Ubicación guardada correctamente.');
                    } else {
                        showMessage('No se pudo guardar la ubicación.');
                    }
                } catch (error) {
                    console.error('Error al guardar ubicación:', error);
                    showMessage('Ocurrió un error al guardar la ubicación.');
                } finally {
                    setSavingLocation(false);
                }
            },
            (error) => {
                console.error('Error de ubicación:', error);

                let message = 'No se pudo obtener tu ubicación.';

                if (error.code === 1) {
                    message = 'Permiso de ubicación denegado. Actívalo en tu navegador.';
                } else if (error.code === 2) {
                    message = 'La ubicación no está disponible en este momento.';
                } else if (error.code === 3) {
                    message = 'La solicitud de ubicación tardó demasiado.';
                }

                showMessage(message, 7000);
                setSavingLocation(false);
            },
            {
                maximumAge: 0,
                timeout: 8000,
                enableHighAccuracy: true
            }
        );
    };

    const openMap = () => {
        if (!latitude || !longitude) {
            showMessage('Todavía no tienes una ubicación guardada.');
            return;
        }

        window.open(`https://maps.google.com/maps?q=${latitude},${longitude}`, '_blank');
    };

    const goToSellerRequest = () => {
        if (typeof setMenu === 'function') {
            setMenu('vendedor');
            return;
        }

        showMessage('Solicitud de vendedor disponible próximamente.');
    };

    return (
        <main className="contenedorIndex" style={styles.page}>
            <Container className="py-4 py-lg-5">
                <Row className="g-4">
                    <Col lg={4}>
                        <Card style={styles.heroCard}>
                            <div style={styles.heroHeader} />

                            <Card.Body className="text-center px-4 pb-4">
                                <div
                                    style={styles.avatarWrapper}
                                    onDrop={handleDropImage}
                                    onDragOver={handleDragOverImage}
                                >
                                    <img
                                        src={userImage}
                                        style={styles.avatar}
                                        alt="Usuario"
                                        onError={(event) => {
                                            event.currentTarget.src = DEFAULT_USER_IMAGE;
                                        }}
                                    />

                                    <Button
                                        variant="warning"
                                        style={styles.cameraButton}
                                        onClick={openFileInput}
                                        disabled={uploadingImage}
                                        title="Actualizar foto"
                                    >
                                        {uploadingImage ? (
                                            <Spinner size="sm" animation="border" />
                                        ) : (
                                            <i className="bi bi-camera-fill" />
                                        )}
                                    </Button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    onChange={inputChange}
                                    id="Images"
                                    name="Images"
                                    type="file"
                                    className="file"
                                    accept="image/jpeg, image/png, image/jpg"
                                    style={{ display: 'none' }}
                                />

                                <h4 className="mt-3 mb-1 fw-bold">
                                    {nombre || 'Usuario'}
                                </h4>

                                <p className="text-muted mb-2">
                                    {correo || 'Sin correo registrado'}
                                </p>

                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <Badge bg={isGoogleUser ? 'primary' : 'dark'} pill>
                                        {isGoogleUser ? 'Cuenta Google' : 'Cuenta BA-MRO'}
                                    </Badge>

                                    {numArticulos > 0 && (
                                        <Badge bg="warning" text="dark" pill>
                                            {numArticulos} artículos
                                        </Badge>
                                    )}
                                </div>

                                <Button
                                    variant="outline-dark"
                                    className="mt-4 rounded-pill px-4"
                                    onClick={openFileInput}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <>
                                            <Spinner
                                                size="sm"
                                                animation="border"
                                                className="me-2"
                                            />
                                            Subiendo...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-image me-2" />
                                            Cambiar foto
                                        </>
                                    )}
                                </Button>

                                <p className="text-muted small mt-3 mb-0">
                                    Puedes arrastrar una imagen JPG o PNG sobre la foto.
                                </p>
                            </Card.Body>
                        </Card>

                        <Card className="mt-4" style={styles.softCard}>
                            <Card.Body className="p-4">
                                <div className="mb-3">
                                    <h5 style={styles.sectionTitle}>
                                        Información general
                                    </h5>
                                    <p style={styles.sectionSubtitle}>
                                        Datos principales de tu cuenta.
                                    </p>
                                </div>

                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Teléfono</div>
                                    <div style={styles.infoValue}>
                                        {telefono || 'Sin teléfono'}
                                    </div>
                                </div>

                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>País</div>
                                    <div style={styles.infoValue}>
                                        {pais || 'México'}
                                    </div>
                                </div>

                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Estado</div>
                                    <div style={styles.infoValue}>
                                        {nameEstado || 'Sin estado'}
                                    </div>
                                </div>

                                <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Municipio</div>
<div style={styles.infoValue}>
    {nameMunicipio || 'Sin municipio'}
</div>
                                </div>

                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Dirección</div>
                                    <div style={styles.infoValue}>
                                        {direccion || 'Sin dirección'}
                                    </div>
                                </div>

                                <div style={{ padding: '14px 0 0' }}>
                                    <div style={styles.infoLabel}>Código Postal</div>
                                    <div style={styles.infoValue}>
                                        {cp || 'Sin CP'}
                                    </div>
                                </div>

                                {latitude && longitude && (
                                    <Button
                                        variant="dark"
                                        className="w-100 mt-4 rounded-pill"
                                        onClick={openMap}
                                    >
                                        <i className="bi bi-geo-alt-fill me-2" />
                                        Ver ubicación en mapa
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={8}>
                        <Card style={styles.softCard}>
                            <Card.Body className="p-4 p-lg-5">
                                <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
                                    <div>
                                        <h4 style={styles.sectionTitle}>
                                            Editar perfil
                                        </h4>
                                        <p style={styles.sectionSubtitle}>
                                            Actualiza tu información personal, dirección y datos de acceso.
                                        </p>
                                    </div>

                                    <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">
                                        <i className="bi bi-shield-check me-2 text-success" />
                                        Perfil seguro
                                    </Badge>
                                </div>

                                <Form>
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3">
                                            <i className="bi bi-person-lines-fill me-2 text-primary" />
                                            Datos personales
                                        </h6>

                                        <Row className="g-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Nombre
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Nombre completo"
                                                        name="Nombre"
                                                        value={nombre || ''}
                                                        onChange={handleInputChange}
                                                        isInvalid={!!errors.nombre}
                                                        style={styles.formControl}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.nombre}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Teléfono
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="10 dígitos"
                                                        name="Telefono"
                                                        value={telefono || ''}
                                                        onChange={handleInputChange}
                                                        isInvalid={!!errors.telefono}
                                                        style={styles.formControl}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.telefono}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    {!isGoogleUser && (
                                        <div className="mb-4">
                                            <h6 className="fw-bold mb-3">
                                                <i className="bi bi-lock-fill me-2 text-primary" />
                                                Seguridad
                                            </h6>

                                            <Row className="g-3">
                                                <Col md={7}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Contraseña
                                                        </Form.Label>

                                                        <InputGroup>
                                                            <Form.Control
                                                                type={showPassword ? 'text' : 'password'}
                                                                placeholder="Contraseña"
                                                                name="Password"
                                                                value={pass || ''}
                                                                onChange={handleInputChange}
                                                                isInvalid={!!errors.pass}
                                                                style={{
                                                                    ...styles.formControl,
                                                                    borderTopRightRadius: 0,
                                                                    borderBottomRightRadius: 0
                                                                }}
                                                            />

                                                            <Button
                                                                variant="outline-secondary"
                                                                onClick={() => setShowPassword((prev) => !prev)}
                                                                style={{
                                                                    borderTopRightRadius: '14px',
                                                                    borderBottomRightRadius: '14px'
                                                                }}
                                                            >
                                                                <i
                                                                    className={
                                                                        showPassword
                                                                            ? 'bi bi-eye-slash'
                                                                            : 'bi bi-eye'
                                                                    }
                                                                />
                                                            </Button>

                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.pass}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3">
                                            <i className="bi bi-house-door-fill me-2 text-primary" />
                                            Dirección de envío
                                        </h6>

                                        <Row className="g-3 mb-3">
                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        País
                                                    </Form.Label>
                                                    <Form.Select
                                                        name="Pais"
                                                        value={pais || 'México'}
                                                        disabled
                                                        style={styles.formControl}
                                                    >
                                                        <option value="México">México</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            <Col md={8}>
                                            <EstadoMunicipioSelector
    estado={estado}
    setEstado={setEstado}
    municipio={municipio}
    setMunicipio={setMunicipio}
    label=""
    setNameEstado={setNameEstado}
    setNameMunicipio={setNameMunicipio}
/>

                                                {(errors.estado || errors.municipio) && (
                                                    <div className="text-danger small mt-2">
                                                        {errors.estado || errors.municipio}
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>

                                        <Row className="g-3">
                                            <Col md={8}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Dirección
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Calle, número, colonia"
                                                        name="Direccion"
                                                        value={direccion || ''}
                                                        onChange={handleInputChange}
                                                        isInvalid={!!errors.direccion}
                                                        style={styles.formControl}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.direccion}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Código Postal
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="CP"
                                                        name="CP"
                                                        value={cp || ''}
                                                        onChange={handleInputChange}
                                                        isInvalid={!!errors.cp}
                                                        style={styles.formControl}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.cp}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="mb-4">
                                        <Form.Check
                                            type="switch"
                                            id="billing-address-switch"
                                            checked={otraUbiCheck}
                                            onChange={handleCheckboxChange}
                                            label="La dirección de envío es igual a la de facturación"
                                            className="fw-semibold"
                                        />
                                    </div>

                                    {!otraUbiCheck && (
                                        <div className="mb-4">
                                            <Alert
                                                variant="light"
                                                className="border rounded-4 px-4 py-3"
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3 fs-4 text-primary">
                                                        <i className="bi bi-receipt-cutoff" />
                                                    </div>
                                                    <div>
                                                        <strong>Dirección de facturación</strong>
                                                        <div className="text-muted small">
                                                            Captura los datos fiscales o de facturación si son distintos.
                                                        </div>
                                                    </div>
                                                </div>
                                            </Alert>

                                            <Row className="g-3 mb-3">
                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            País
                                                        </Form.Label>
                                                        <Form.Select
                                                            name="Pais"
                                                            value={pais || 'México'}
                                                            disabled
                                                            style={styles.formControl}
                                                        >
                                                            <option value="México">México</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={8}>
                                                <EstadoMunicipioSelector
    estado={estado2}
    setEstado={setEstado2}
    municipio={municipio2}
    setMunicipio={setMunicipio2}
    label="Facturación"
    setNameEstado={setNameEstado2}
    setNameMunicipio={setNameMunicipio2}
/>

                                                    {(errors.estado2 || errors.municipio2) && (
                                                        <div className="text-danger small mt-2">
                                                            {errors.estado2 || errors.municipio2}
                                                        </div>
                                                    )}
                                                </Col>
                                            </Row>

                                            <Row className="g-3">
                                                <Col md={8}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Dirección
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Dirección de facturación"
                                                            name="Direccion2"
                                                            value={direccion2 || ''}
                                                            onChange={handleInputChange}
                                                            isInvalid={!!errors.direccion2}
                                                            style={styles.formControl}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.direccion2}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold">
                                                            Código Postal
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            inputMode="numeric"
                                                            placeholder="CP"
                                                            name="CP2"
                                                            value={cp2 || ''}
                                                            onChange={handleInputChange}
                                                            isInvalid={!!errors.cp2}
                                                            style={styles.formControl}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.cp2}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}

                                    <div
                                        className="d-flex justify-content-between align-items-center mt-4"
                                        style={styles.actionBar}
                                    >
                                        <Button
                                            variant="outline-dark"
                                            className="rounded-pill px-4"
                                            onClick={UbicaionMessage}
                                            disabled={savingLocation}
                                        >
                                            {savingLocation ? (
                                                <>
                                                    <Spinner
                                                        size="sm"
                                                        animation="border"
                                                        className="me-2"
                                                    />
                                                    Guardando ubicación...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-crosshair me-2" />
                                                    Guardar ubicación GPS
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            variant="success"
                                            className="rounded-pill px-4"
                                            onClick={SaveDetailsUser}
                                            disabled={savingProfile}
                                        >
                                            {savingProfile ? (
                                                <>
                                                    <Spinner
                                                        size="sm"
                                                        animation="border"
                                                        className="me-2"
                                                    />
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check2-circle me-2" />
                                                    Guardar datos
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>

                        <Row className="g-4 mt-1">
                            <Col xl={7}>
                                <Card style={styles.softCard}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 style={styles.sectionTitle}>
                                                    Historial de compras
                                                </h5>
                                                <p style={styles.sectionSubtitle}>
                                                    Últimos productos adquiridos.
                                                </p>
                                            </div>

                                            <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                                                {Array.isArray(compras) ? compras.length : 0}
                                            </Badge>
                                        </div>

                                        {!Array.isArray(compras) || compras.length === 0 ? (
                                            <Alert variant="light" className="border rounded-4 mb-0">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-bag-x fs-4 me-3 text-muted" />
                                                    <div>
                                                        <strong>Sin compras todavía</strong>
                                                        <div className="text-muted small">
                                                            Cuando compres productos, aparecerán aquí.
                                                        </div>
                                                    </div>
                                                </div>
                                            </Alert>
                                        ) : (
                                            <div className="d-flex flex-column gap-3">
                                                {compras.slice(0, 6).map((elementsCompras) => (
                                                    <div
                                                        key={elementsCompras.idArticulo}
                                                        className="d-flex justify-content-between align-items-center border rounded-4 p-3"
                                                    >
                                                        <div>
                                                            <div className="fw-bold">
                                                                {elementsCompras.nombreArticulo}
                                                            </div>
                                                            <div className="text-muted small">
                                                                {elementsCompras.fechaCompra}
                                                            </div>
                                                        </div>

                                                        <Badge bg="success" pill>
                                                            Compra
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xl={5}>
                                <Card style={styles.sellerCard}>
                                    <Card.Body className="p-4">
                                        <div className="fs-2 mb-3">
                                            <i className="bi bi-shop-window" />
                                        </div>

                                        <h5 className="fw-bold mb-2 text-white">
                                            ¿Quieres vender en BA-MRO?
                                        </h5>

                                        <p className="mb-4" style={{ color: 'rgba(255,255,255,0.78)' }}>
                                            Publica productos, administra inventario y conecta con compradores industriales.
                                        </p>

                                        <Button
                                            variant="warning"
                                            className="rounded-pill px-4 fw-bold"
                                            onClick={goToSellerRequest}
                                        >
                                            Convertirse en vendedor
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
            </Container>

            <Footer />
        </main>
    );
};