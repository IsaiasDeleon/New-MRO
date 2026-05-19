import React, { useState, useEffect, useMemo } from 'react';
import { Offcanvas, Button, ListGroup, Modal, Alert, Badge, Spinner } from 'react-bootstrap';
import CartItem from './CartItem';
import { useNavigate } from 'react-router';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

const HTTP = axios.create({
    baseURL: 'https://ba-mro.mx/Server/Data.php'
});

const PAYPAL_CLIENT_ID =
    'AUQ-HLaYkpifs1IJdRKZDY5ueRm0aVYUR_BomYGfeGOH2t7GWAUYJcsIAPvwYVth4C8gluhxu3A2ZctG';

const styles = {
    offcanvas: {
        width: '480px',
        maxWidth: '100vw',
        borderLeft: '0',
        background: '#f4f7fb',
        boxShadow: '-16px 0 42px rgba(15, 23, 42, 0.18)'
    },
    header: {
        padding: '16px 20px 14px 20px',
        borderBottom: '1px solid #e8eef5',
        background: '#ffffff'
    },
    titleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    titleIcon: {
        width: '54px',
        height: '54px',
        minWidth: '54px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #17345f 0%, #244f8f 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.45rem',
        boxShadow: '0 10px 20px rgba(23, 52, 95, 0.20)'
    },
    title: {
        margin: 0,
        color: '#0f172a',
        fontWeight: 900,
        fontSize: '1.15rem',
        lineHeight: 1.12
    },
    subtitle: {
        margin: '4px 0 0',
        color: '#6b7280',
        fontSize: '0.84rem',
        fontWeight: 500
    },
    body: {
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
    },
    itemsWrapper: {
        flex: 1,
        overflowY: 'auto',
        padding: '14px'
    },
    itemsPanel: {
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e6edf5',
        padding: '10px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
    },
    itemsPanelHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '4px 8px 10px 8px',
        borderBottom: '1px solid #eef3f8',
        marginBottom: '6px'
    },
    itemsPanelTitle: {
        margin: 0,
        fontSize: '0.92rem',
        fontWeight: 800,
        color: '#111827'
    },
    itemsPanelSubtitle: {
        margin: '2px 0 0',
        color: '#6b7280',
        fontSize: '0.76rem'
    },
    chip: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 11px',
        borderRadius: '999px',
        background: '#eef6ff',
        color: '#205c98',
        fontSize: '0.74rem',
        fontWeight: 800,
        whiteSpace: 'nowrap'
    },
    listGroupCompact: {
        fontSize: '0.88rem'
    },
    emptyCard: {
        textAlign: 'center',
        padding: '26px 16px',
        borderRadius: '18px',
        background: '#f9fbfd'
    },
    emptyIcon: {
        width: '54px',
        height: '54px',
        borderRadius: '18px',
        margin: '0 auto 12px',
        background: '#eef6ff',
        color: '#205c98',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.45rem'
    },
    footer: {
        background: '#ffffff',
        borderTop: '1px solid #e6edf5',
        padding: '14px',
        boxShadow: '0 -12px 28px rgba(15, 23, 42, 0.06)'
    },
    summaryCard: {
        borderRadius: '20px',
        padding: '14px',
        background: 'linear-gradient(180deg, #f9fbfd 0%, #f4f7fb 100%)',
        border: '1px solid #e6edf5',
        marginBottom: '12px'
    },
    summaryRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        marginBottom: '8px'
    },
    summaryLabel: {
        color: '#6b7280',
        fontSize: '0.82rem',
        fontWeight: 700
    },
    summaryValue: {
        color: '#111827',
        fontSize: '0.92rem',
        fontWeight: 900
    },
    totalValue: {
        color: '#3c8c53',
        fontSize: '1.15rem',
        fontWeight: 900,
        lineHeight: 1
    },
    actions: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px'
    },
    lightButton: {
        borderRadius: '999px',
        padding: '11px 14px',
        fontWeight: 900,
        fontSize: '0.86rem',
        border: '2px solid #53b63d',
        background: '#ffffff',
        color: '#53b63d'
    },
    darkButton: {
        borderRadius: '999px',
        padding: '11px 14px',
        fontWeight: 900,
        fontSize: '0.86rem',
        border: '0',
        background: '#001f34',
        color: '#ffffff'
    },
    modalHeader: {
        borderBottom: '1px solid #e7edf3',
        padding: '18px 20px'
    },
    modalBody: {
        background: '#f5f7fb',
        padding: '18px'
    },
    modalFooter: {
        borderTop: '1px solid #e7edf3',
        padding: '14px 18px'
    },
    checkoutHero: {
        borderRadius: '20px',
        padding: '18px',
        background: 'linear-gradient(135deg, #17345f 0%, #244f8f 100%)',
        color: '#fff',
        marginBottom: '14px',
        boxShadow: '0 14px 28px rgba(23, 52, 95, 0.16)'
    },
    checkoutHeroTitle: {
        margin: 0,
        fontSize: '1.12rem',
        fontWeight: 900,
        color:"#fff"
    },
    checkoutHeroText: {
        margin: '5px 0 0',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '0.82rem'
    },
    checkoutHeroTotal: {
        marginTop: '12px',
        fontSize: '1.55rem',
        fontWeight: 900
    },
    sectionCard: {
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e6edf5',
        padding: '14px',
        marginBottom: '14px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px'
    },
    sectionIcon: {
        width: '38px',
        height: '38px',
        borderRadius: '14px',
        background: '#eef6ff',
        color: '#205c98',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem'
    },
    sectionTitle: {
        margin: 0,
        fontSize: '0.92rem',
        fontWeight: 900,
        color: '#111827'
    },
    sectionSubtitle: {
        margin: '2px 0 0',
        fontSize: '0.76rem',
        color: '#6b7280'
    },
    infoGrid3: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '8px'
    },
    infoGridAddress: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: '8px',
        marginTop: '8px'
    },
    infoBox: {
        background: '#f8fafc',
        border: '1px solid #edf2f7',
        borderRadius: '14px',
        padding: '10px'
    },
    infoLabel: {
        color: '#6b7280',
        fontSize: '0.68rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '4px'
    },
    infoValue: {
        color: '#111827',
        fontSize: '0.84rem',
        fontWeight: 800,
        wordBreak: 'break-word'
    },
    helpAlert: {
        border: '1px solid #dbeafe',
        background: '#eff6ff',
        color: '#1d4ed8',
        borderRadius: '16px',
        padding: '12px 14px',
        cursor: 'pointer',
        marginBottom: '12px',
        fontSize: '0.84rem'
    },
    dangerAlert: {
        border: '1px solid #fecdd3',
        background: '#fff1f2',
        color: '#9f1239',
        borderRadius: '16px',
        padding: '12px 14px',
        cursor: 'pointer',
        fontSize: '0.84rem'
    },
    switchWrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        background: '#ffffff',
        border: '1px solid #e6edf5',
        borderRadius: '16px',
        padding: '10px 12px',
        marginBottom: '12px',
        fontSize: '0.84rem'
    },
    paypalCard: {
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e6edf5',
        padding: '14px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
    },
    cancelButton: {
        borderRadius: '999px',
        padding: '10px 16px',
        fontWeight: 800,
        fontSize: '0.84rem'
    }
};

const formatMoney = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
};

const safeArray = (arr) => {
    return Array.isArray(arr) ? arr : [];
};

const getPrecioFinal = (item) => {
    const precioNormal = Number(item?.monto || 0);
    const precioOferta = Number(item?.montoOferta || 0);
    const tieneOferta = Number(item?.Oferta) === 1 && precioOferta > 0;

    return tieneOferta ? precioOferta : precioNormal;
};

const getFirstRow = (response) => {
    return Array.isArray(response?.data) ? response.data[0] : undefined;
};

const CartOffcanvas = ({
    show,
    handleClose,
    elemntsCarrito = [],
    idU,
    NumElementsCarrito,
    ElementsCarrito,
    handleShowQuickViewModal
}) => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const [Telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [CP, setCP] = useState('');
    const [estado, setEstado] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [nameEstado, setNameEstado] = useState('');
    const [nameMunicipio, setNameMunicipio] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const [OtraUbiCheck, setOtraUbiCheck] = useState(true);

    const [direccion2, setDireccion2] = useState('');
    const [CP2, setCP2] = useState('');
    const [estado2, setEstado2] = useState('');
    const [municipio2, setMunicipio2] = useState('');
    const [nameEstado2, setNameEstado2] = useState('');
    const [nameMunicipio2, setNameMunicipio2] = useState('');

    useEffect(() => {
        const itemsWithQuantities = safeArray(elemntsCarrito).map((item) => ({
            ...item,
            quantity: Number(item.quantity || 1)
        }));

        setCartItems(itemsWithQuantities);
    }, [elemntsCarrito]);

    useEffect(() => {
        if (idU) {
            getD();
        }
    }, [idU]);

    const getNameEstado = async (idEstado) => {
        if (!idEstado) return '';

        try {
            const response = await HTTP.post('/getNameEstado', { idEstado });
            return response.data?.[0]?.estado || '';
        } catch (error) {
            console.error('Error al obtener nombre del estado:', error);
            return '';
        }
    };

    const getNameMunicipio = async (idEstado, idMunicipio) => {
        if (!idEstado || !idMunicipio) return '';

        try {
            const response = await HTTP.post('/getMunicipio', { Estado: idEstado });
            const municipios = Array.isArray(response.data) ? response.data : [];

            const municipioEncontrado = municipios.find(
                (item) => String(item.id) === String(idMunicipio)
            );

            return municipioEncontrado?.municipio || '';
        } catch (error) {
            console.error('Error al obtener nombre del municipio:', error);
            return '';
        }
    };

    const getD = async () => {
        try {
            setLoadingProfile(true);

            const [generalesResponse, facturacionResponse] = await Promise.all([
                HTTP.post('/getDatosGenerales2', { IdUsuario: idU }),
                HTTP.post('/getDatosGenerales2Facturacion', { IdUsuario: idU })
            ]);

            const respuesta = getFirstRow(generalesResponse);
            const respuesta2 = getFirstRow(facturacionResponse);

            if (respuesta) {
                const estadoId = respuesta.estado || '';
                const municipioId = respuesta.municipio || '';

                setTelefono(respuesta.telefono || '');
                setDireccion(respuesta.Direccion || '');
                setCP(respuesta.CP || '');
                setEstado(estadoId);
                setMunicipio(municipioId);
                setLatitude(respuesta.latitude || 0);
                setLongitude(respuesta.longitude || 0);

                const [estadoNombre, municipioNombre] = await Promise.all([
                    getNameEstado(estadoId),
                    getNameMunicipio(estadoId, municipioId)
                ]);

                setNameEstado(estadoNombre);
                setNameMunicipio(municipioNombre);
            }

            if (respuesta2) {
                const estadoFactId = respuesta2.estado || '';
                const municipioFactId = respuesta2.municipio || '';

                setDireccion2(respuesta2.Direccion2 || '');
                setCP2(respuesta2.CP2 || '');
                setEstado2(estadoFactId);
                setMunicipio2(municipioFactId);

                const [estadoFactNombre, municipioFactNombre] = await Promise.all([
                    getNameEstado(estadoFactId),
                    getNameMunicipio(estadoFactId, municipioFactId)
                ]);

                setNameEstado2(estadoFactNombre);
                setNameMunicipio2(municipioFactNombre);
            }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleQuantityChange = (itemId, quantity) => {
        const nextQuantity = Math.max(1, Number(quantity || 1));

        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        quantity: nextQuantity
                    }
                    : item
            )
        );
    };

    const totalProductos = useMemo(() => {
        return cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
    }, [cartItems]);

    const totalGlobal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            return total + getPrecioFinal(item) * Number(item.quantity || 0);
        }, 0);
    }, [cartItems]);

    const cartIsEmpty = cartItems.length === 0;

    const idsString = useMemo(() => {
        return cartItems.map((item) => item.id).join(',');
    }, [cartItems]);

    const cantidadesString = useMemo(() => {
        return cartItems.map((item) => Number(item.quantity || 1)).join(',');
    }, [cartItems]);

    const canBuy = useMemo(() => {
        if (!idU) return false;
        if (cartIsEmpty) return false;
        if (!direccion || !CP || !Telefono || !estado || !municipio) return false;

        if (!OtraUbiCheck && (!direccion2 || !CP2 || !estado2 || !municipio2)) {
            return false;
        }

        return true;
    }, [
        idU,
        cartIsEmpty,
        direccion,
        CP,
        Telefono,
        estado,
        municipio,
        OtraUbiCheck,
        direccion2,
        CP2,
        estado2,
        municipio2
    ]);

    const Cotizar = () => {
        if (!idU || cartIsEmpty) return;

        window.open(
            `https://ba-mro.mx/Server/Script.php?IP=${idsString}&IU=${idU}&cantidades=${cantidadesString}`,
            '_blank'
        );
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const EditarPerfil = () => {
        closeModal();
        handleClose?.();
        navigate('/Perfil', { replace: true });
    };

    const Comprar = () => {
        closeModal();

        if (!idU || cartIsEmpty) return;

        const params = new URLSearchParams({
            IP: idsString,
            IU: String(idU),
            cantidades: cantidadesString,
            Telefono: String(Telefono || ''),
            direccion: String(direccion || ''),
            CP: String(CP || ''),
            estado: String(estado || ''),
            municipio: String(municipio || ''),
            latitude: String(latitude || 0),
            longitude: String(longitude || 0)
        });

        window.open(
            `https://ba-mro.mx/Server/CorreoComprasCarrito.php?${params.toString()}`,
            '_blank'
        );
    };

    const renderAddressInfo = ({
        title,
        subtitle,
        icon,
        direccionValue,
        cpValue,
        telefonoValue,
        estadoValue,
        municipioValue,
        showPhone = false
    }) => {
        return (
            <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                    <div style={styles.sectionIcon}>
                        <i className={icon} />
                    </div>

                    <div>
                        <h5 style={styles.sectionTitle}>{title}</h5>
                        <p style={styles.sectionSubtitle}>{subtitle}</p>
                    </div>
                </div>

                <div style={styles.infoGrid3}>
                    <div style={styles.infoBox}>
                        <div style={styles.infoLabel}>País</div>
                        <div style={styles.infoValue}>México</div>
                    </div>

                    <div style={styles.infoBox}>
                        <div style={styles.infoLabel}>Estado</div>
                        <div style={styles.infoValue}>
                            {estadoValue || 'Sin estado'}
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div style={styles.infoLabel}>Municipio</div>
                        <div style={styles.infoValue}>
                            {municipioValue || 'Sin municipio'}
                        </div>
                    </div>
                </div>

                <div style={styles.infoGridAddress}>
                    <div style={styles.infoBox}>
                        <div style={styles.infoLabel}>Dirección</div>
                        <div style={styles.infoValue}>
                            {direccionValue || 'Sin dirección'}
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div style={styles.infoLabel}>CP</div>
                        <div style={styles.infoValue}>
                            {cpValue || 'Sin CP'}
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <div style={styles.infoLabel}>
                            {showPhone ? 'Teléfono' : 'Uso'}
                        </div>
                        <div style={styles.infoValue}>
                            {showPhone ? telefonoValue || 'Sin teléfono' : 'Facturación'}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Offcanvas
                show={show}
                onHide={handleClose}
                placement="end"
                className="d-flex flex-column"
                style={styles.offcanvas}
            >
                <Offcanvas.Header closeButton style={styles.header}>
                    <div style={styles.titleRow}>
                        <div style={styles.titleIcon}>
                            <i className="bi bi-cart3" />
                        </div>

                        <div>
                            <Offcanvas.Title style={styles.title}>
                                Carrito de compras
                            </Offcanvas.Title>

                            <p style={styles.subtitle}>
                                Revisa productos, cantidades y total.
                            </p>
                        </div>
                    </div>
                </Offcanvas.Header>

                <Offcanvas.Body style={styles.body}>
                    <div style={styles.itemsWrapper}>
                        <div style={styles.itemsPanel}>
                            <div style={styles.itemsPanelHeader}>
                                <div>
                                    <h6 style={styles.itemsPanelTitle}>
                                        Tus artículos
                                    </h6>

                                    <p style={styles.itemsPanelSubtitle}>
                                        Gestiona tu pedido antes de continuar.
                                    </p>
                                </div>

                                <span style={styles.chip}>
                                    {totalProductos} producto{totalProductos === 1 ? '' : 's'}
                                </span>
                            </div>

                            {cartIsEmpty ? (
                                <div style={styles.emptyCard}>
                                    <div style={styles.emptyIcon}>
                                        <i className="bi bi-bag-x" />
                                    </div>

                                    <h5 className="fw-bold mb-2" style={{ fontSize: '1rem' }}>
                                        Tu carrito está vacío
                                    </h5>

                                    <p className="text-muted mb-0" style={{ fontSize: '0.84rem' }}>
                                        Agrega artículos para poder cotizar o comprar.
                                    </p>
                                </div>
                            ) : (
                                <ListGroup variant="flush" style={styles.listGroupCompact}>
                                    {cartItems.map((item) => (
                                        <CartItem
                                            NumElementsCarrito={NumElementsCarrito}
                                            ElementsCarrito={ElementsCarrito}
                                            key={item.id}
                                            item={item}
                                            onQuantityChange={handleQuantityChange}
                                            handleShowQuickViewModal={handleShowQuickViewModal}
                                        />
                                    ))}
                                </ListGroup>
                            )}
                        </div>
                    </div>

                    <div style={styles.footer}>
                        <div style={styles.summaryCard}>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>
                                    Total de productos
                                </span>

                                <span style={styles.summaryValue}>
                                    {totalProductos}
                                </span>
                            </div>

                            <div style={{ ...styles.summaryRow, marginBottom: 0 }}>
                                <span style={styles.summaryLabel}>
                                    Total estimado
                                </span>

                                <span style={styles.totalValue}>
                                    {formatMoney(totalGlobal)}
                                </span>
                            </div>
                        </div>

                        <div style={styles.actions}>
                            <Button
                                onClick={Cotizar}
                                disabled={cartIsEmpty || !idU}
                                style={styles.lightButton}
                            >
                                <i className="bi bi-file-earmark-text me-2" />
                                Cotizar
                            </Button>

                            <Button
                                onClick={() => setModalOpen(true)}
                                disabled={cartIsEmpty || !idU}
                                style={styles.darkButton}
                            >
                                <i className="bi bi-credit-card me-2" />
                                Comprar
                            </Button>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <Modal
                show={modalOpen}
                onHide={closeModal}
                size="lg"
                centered
                backdrop="static"
            >
                <Modal.Header closeButton style={styles.modalHeader}>
                    <div>
                        <Modal.Title className="fw-bold" style={{ fontSize: '1.15rem' }}>
                            Finalizar compra
                        </Modal.Title>

                        <div className="text-muted small">
                            Confirma tu información antes de realizar el pago.
                        </div>
                    </div>
                </Modal.Header>

                <Modal.Body style={styles.modalBody}>
                    <div style={styles.checkoutHero}>
                        <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                            <div>
                                <h4 style={styles.checkoutHeroTitle}>
                                    Resumen de pago
                                </h4>

                                <p style={styles.checkoutHeroText}>
                                    Al completar tu pago, recibirás un correo con los datos de tus productos y proveedores.
                                </p>
                            </div>

                            <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2">
                                {totalProductos} producto{totalProductos === 1 ? '' : 's'}
                            </Badge>
                        </div>

                        <div style={styles.checkoutHeroTotal}>
                            {formatMoney(totalGlobal)}
                        </div>
                    </div>

                    {loadingProfile ? (
                        <div style={styles.sectionCard} className="text-center">
                            <Spinner animation="border" size="sm" />
                            <div className="fw-bold mt-3" style={{ fontSize: '0.88rem' }}>
                                Cargando datos de envío...
                            </div>
                        </div>
                    ) : direccion ? (
                        <>
                            <div style={styles.helpAlert} onClick={EditarPerfil}>
                                <i className="bi bi-info-circle-fill me-2" />
                                Si quieres actualizar tus datos antes de comprar, presiona{' '}
                                <b>
                                    <u>aquí</u>
                                </b>
                                .
                            </div>

                            {renderAddressInfo({
                                title: 'Dirección de envío',
                                subtitle: 'Estos datos se usarán para coordinar la entrega.',
                                icon: 'bi bi-truck',
                                direccionValue: direccion,
                                cpValue: CP,
                                telefonoValue: Telefono,
                                estadoValue: nameEstado || estado,
                                municipioValue: nameMunicipio || municipio,
                                showPhone: true
                            })}

                            <div style={styles.switchWrap}>
                                <input
                                    id="billing-address-switch-cart"
                                    className="form-check-input m-0"
                                    type="checkbox"
                                    checked={OtraUbiCheck}
                                    onChange={() => setOtraUbiCheck((prev) => !prev)}
                                />

                                <label
                                    htmlFor="billing-address-switch-cart"
                                    className="form-check-label fw-bold"
                                    style={{
                                        cursor: 'pointer',
                                        color: '#111827',
                                        fontSize: '0.84rem'
                                    }}
                                >
                                    La dirección de envío es igual a la de facturación
                                </label>
                            </div>

                            {!OtraUbiCheck && (
                                <>
                                    {direccion2 ? (
                                        renderAddressInfo({
                                            title: 'Dirección de facturación',
                                            subtitle: 'Estos datos se usarán como información fiscal o administrativa.',
                                            icon: 'bi bi-receipt-cutoff',
                                            direccionValue: direccion2,
                                            cpValue: CP2,
                                            estadoValue: nameEstado2 || estado2,
                                            municipioValue: nameMunicipio2 || municipio2,
                                            showPhone: false
                                        })
                                    ) : (
                                        <div style={styles.dangerAlert} onClick={EditarPerfil}>
                                            <i className="bi bi-exclamation-triangle-fill me-2" />
                                            La ubicación de facturación no ha sido ingresada. Ve a tu{' '}
                                            <b>
                                                <u>perfil</u>
                                            </b>{' '}
                                            para completarla.
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div style={styles.dangerAlert} onClick={EditarPerfil}>
                            <i className="bi bi-exclamation-triangle-fill me-2" />
                            Tus datos no han sido proporcionados. Te sugerimos ir a tu{' '}
                            <b>
                                <u>perfil</u>
                            </b>{' '}
                            y completarlos.
                        </div>
                    )}

                    <div style={styles.paypalCard}>
                        <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
                            <div>
                                <h5 className="fw-bold mb-1" style={{ fontSize: '0.98rem' }}>
                                    Pago con PayPal
                                </h5>

                                <div className="text-muted small">
                                    El pago se procesará de forma segura.
                                </div>
                            </div>

                            <Badge bg={canBuy ? 'success' : 'secondary'} pill>
                                {canBuy ? 'Listo para pagar' : 'Faltan datos'}
                            </Badge>
                        </div>

                        {!canBuy && (
                            <Alert variant="warning" className="rounded-4" style={{ fontSize: '0.84rem' }}>
                                Completa tus datos de envío y facturación antes de continuar con el pago.
                            </Alert>
                        )}

                        <PayPalScriptProvider
                            options={{
                                'client-id': PAYPAL_CLIENT_ID,
                                currency: 'MXN'
                            }}
                        >
                            <PayPalButtons
                                style={{
                                    layout: 'vertical',
                                    shape: 'pill',
                                    label: 'pay'
                                }}
                                disabled={!canBuy}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: totalGlobal.toFixed(2)
                                                }
                                            }
                                        ]
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then(() => {
                                        Comprar();
                                    });
                                }}
                                onError={(error) => {
                                    console.error('PayPal error:', error);
                                    alert('No se pudo procesar el pago. Intenta nuevamente.');
                                }}
                            />
                        </PayPalScriptProvider>
                    </div>
                </Modal.Body>

                <Modal.Footer style={styles.modalFooter}>
                    <Button
                        variant="outline-secondary"
                        onClick={closeModal}
                        style={styles.cancelButton}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CartOffcanvas;