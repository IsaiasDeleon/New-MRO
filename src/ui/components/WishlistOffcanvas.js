import React, { useMemo } from 'react';
import { Offcanvas, Button, ListGroup, Alert, Badge } from 'react-bootstrap';
import { Trash2, ShoppingCart, Eye, Heart, Package } from 'react-feather';

const IMAGE_BASE_URL = 'https://ba-mro.mx/Server/Images/';
const DEFAULT_IMAGE = 'Box.jpg';

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
        background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 20px rgba(220, 38, 38, 0.20)'
    },
    title: {
        margin: 0,
        color: '#0f172a',
        fontWeight: 800,
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
    content: {
        flex: 1,
        overflowY: 'auto',
        padding: '14px'
    },
    panel: {
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e6edf5',
        padding: '10px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
    },
    panelHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '4px 8px 10px 8px',
        borderBottom: '1px solid #eef3f8',
        marginBottom: '6px'
    },
    panelTitle: {
        margin: 0,
        fontSize: '0.92rem',
        fontWeight: 800,
        color: '#111827'
    },
    panelSubtitle: {
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
        background: '#fff1f2',
        color: '#dc2626',
        fontSize: '0.74rem',
        fontWeight: 800,
        whiteSpace: 'nowrap'
    },
    successAlert: {
        border: '1px solid #bbf7d0',
        background: '#f0fdf4',
        color: '#166534',
        borderRadius: '16px',
        padding: '12px 14px',
        marginBottom: '12px',
        fontSize: '0.84rem',
        fontWeight: 700
    },
    emptyCard: {
        textAlign: 'center',
        padding: '30px 16px',
        borderRadius: '18px',
        background: '#f9fbfd'
    },
    emptyIcon: {
        width: '58px',
        height: '58px',
        borderRadius: '20px',
        margin: '0 auto 12px',
        background: '#fff1f2',
        color: '#dc2626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        display: 'grid',
        gridTemplateColumns: '72px 1fr',
        gap: '12px',
        padding: '12px 8px',
        borderBottom: '1px solid #eef3f8',
        background: '#fff'
    },
    imageBox: {
        width: '72px',
        height: '72px',
        borderRadius: '15px',
        background: '#f8fafc',
        border: '1px solid #edf2f7',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        padding: '7px'
    },
    itemContent: {
        minWidth: 0
    },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        alignItems: 'flex-start'
    },
    company: {
        display: 'inline-flex',
        marginBottom: '4px',
        padding: '3px 8px',
        borderRadius: '999px',
        background: '#eef6ff',
        color: '#205c98',
        fontSize: '0.68rem',
        fontWeight: 800
    },
    titleProduct: {
        margin: 0,
        color: '#111827',
        fontSize: '0.88rem',
        fontWeight: 600,
        lineHeight: 1.25,
        cursor: 'pointer'
    },
    priceBox: {
        textAlign: 'right',
        minWidth: '78px'
    },
    price: {
        color: '#001f34',
        fontSize: '0.98rem',
        fontWeight: 900,
        lineHeight: 1
    },
    oldPrice: {
        color: '#9ca3af',
        fontSize: '0.72rem',
        fontWeight: 700,
        textDecoration: 'line-through',
        marginBottom: '3px'
    },
    offerBadge: {
        display: 'inline-flex',
        marginTop: '5px',
        padding: '2px 7px',
        borderRadius: '999px',
        background: '#fff7d6',
        color: '#9a6700',
        fontSize: '0.64rem',
        fontWeight: 900
    },
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        marginTop: '10px'
    },
    stockBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 9px',
        borderRadius: '999px',
        background: '#f0fdf4',
        color: '#198754',
        fontSize: '0.7rem',
        fontWeight: 800
    },
    stockDanger: {
        background: '#fff1f2',
        color: '#dc3545'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '8px',
        marginTop: '10px'
    },
    iconButton: {
        width: '34px',
        height: '34px',
        borderRadius: '12px',
        border: '1px solid #e5eaf0',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
    },
    addButton: {
        height: '34px',
        borderRadius: '999px',
        border: '0',
        background: '#001f34',
        color: '#ffffff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        padding: '0 13px',
        fontSize: '0.76rem',
        fontWeight: 900
    },
    footer: {
        background: '#ffffff',
        borderTop: '1px solid #e6edf5',
        padding: '14px',
        boxShadow: '0 -12px 28px rgba(15, 23, 42, 0.06)'
    },
    footerCard: {
        borderRadius: '18px',
        padding: '13px 14px',
        background: 'linear-gradient(180deg, #f9fbfd 0%, #f4f7fb 100%)',
        border: '1px solid #e6edf5',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
    },
    footerLabel: {
        color: '#6b7280',
        fontSize: '0.82rem',
        fontWeight: 700
    },
    footerValue: {
        color: '#111827',
        fontSize: '0.98rem',
        fontWeight: 900
    }
};

const formatMoney = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
};

const getFirstImage = (img) => {
    if (!img) return DEFAULT_IMAGE;

    const images = String(img)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    return images[0] || DEFAULT_IMAGE;
};

const getPrecioFinal = (item) => {
    const precioNormal = Number(item?.monto || 0);
    const precioOferta = Number(item?.montoOferta || 0);
    const tieneOferta = Number(item?.Oferta) === 1 && precioOferta > 0;

    return {
        precioNormal,
        precioOferta,
        tieneOferta,
        precioFinal: tieneOferta ? precioOferta : precioNormal
    };
};

const WishlistItem = ({
    item,
    handleAddToCart,
    handleShowQuickViewModal,
    DeleteItemGustos
}) => {
    const image = useMemo(() => getFirstImage(item?.img), [item?.img]);
    const { precioNormal, precioOferta, tieneOferta, precioFinal } = getPrecioFinal(item);

    const stock = Number(item?.Stock || item?.stock || 0);
    const sinStock = stock <= 0;

    const openQuickView = () => {
        if (typeof handleShowQuickViewModal === 'function') {
            handleShowQuickViewModal(item);
        }
    };

    const addToCart = () => {
        if (typeof handleAddToCart === 'function') {
            handleAddToCart(item.id);
        }
    };

    const removeItem = () => {
        if (typeof DeleteItemGustos === 'function') {
            DeleteItemGustos(item.id);
        }
    };

    return (
        <div style={styles.item}>
            <div
                style={styles.imageBox}
                onClick={openQuickView}
                role="button"
                title="Ver producto"
            >
                <img
                    src={`${IMAGE_BASE_URL}${image}`}
                    alt={item?.nombre || item?.descripcion || 'Producto'}
                    style={styles.image}
                    onError={(event) => {
                        event.currentTarget.src = `${IMAGE_BASE_URL}${DEFAULT_IMAGE}`;
                    }}
                />
            </div>

            <div style={styles.itemContent}>
                <div style={styles.topRow}>
                    <div style={{ minWidth: 0 }}>
                        <span style={styles.company}>
                            {item?.empresa || 'BA-MRO'}
                        </span>

                        <h6
                            style={styles.titleProduct}
                            onClick={openQuickView}
                            title="Ver producto"
                        >
                            {item?.descripcion || item?.nombre || 'Producto sin descripción'}
                        </h6>
                    </div>

                    <div style={styles.priceBox}>
                        {tieneOferta && (
                            <div style={styles.oldPrice}>
                                {formatMoney(precioNormal)}
                            </div>
                        )}

                        <div style={styles.price}>
                            {formatMoney(precioFinal)}
                        </div>

                        {tieneOferta && (
                            <span style={styles.offerBadge}>
                                Oferta
                            </span>
                        )}
                    </div>
                </div>

                <div style={styles.metaRow}>
                    <span
                        style={{
                            ...styles.stockBadge,
                            ...(sinStock ? styles.stockDanger : {})
                        }}
                    >
                        <Package size={13} />
                        {sinStock ? 'Sin stock' : `Stock: ${stock}`}
                    </span>
                </div>

                <div style={styles.actions}>
                    <button
                        type="button"
                        style={{
                            ...styles.iconButton,
                            color: '#64748b'
                        }}
                        onClick={openQuickView}
                        title="Vista rápida"
                    >
                        <Eye size={16} />
                    </button>

                    <button
                        type="button"
                        style={styles.addButton}
                        onClick={addToCart}
                        disabled={sinStock}
                        title="Agregar al carrito"
                    >
                        <ShoppingCart size={15} />
                        Agregar
                    </button>

                    <button
                        type="button"
                        style={{
                            ...styles.iconButton,
                            color: '#dc3545',
                            background: '#fff1f2',
                            borderColor: '#ffe4e6'
                        }}
                        onClick={removeItem}
                        title="Eliminar de favoritos"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const WishlistOffcanvas = ({
    show,
    handleClose,
    elemntsGustos = [],
    handleAddToCart,
    handleRemove,
    handleShowQuickViewModal,
    showAlert,
    DeleteItemGustos
}) => {
    const wishlistItems = Array.isArray(elemntsGustos) ? elemntsGustos : [];
    const totalItems = wishlistItems.length;

    return (
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
                        <Heart size={25} fill="currentColor" />
                    </div>

                    <div>
                        <Offcanvas.Title style={styles.title}>
                            Lista de deseos
                        </Offcanvas.Title>

                        <p style={styles.subtitle}>
                            Guarda productos para comprarlos después.
                        </p>
                    </div>
                </div>
            </Offcanvas.Header>

            <Offcanvas.Body style={styles.body}>
                <div style={styles.content}>
                    {showAlert && (
                        <Alert style={styles.successAlert}>
                            <ShoppingCart size={16} className="me-2" />
                            Producto agregado al carrito.
                        </Alert>
                    )}

                    <div style={styles.panel}>
                        <div style={styles.panelHeader}>
                            <div>
                                <h6 style={styles.panelTitle}>
                                    Tus favoritos
                                </h6>

                                <p style={styles.panelSubtitle}>
                                    Revisa tus productos guardados.
                                </p>
                            </div>

                            <span style={styles.chip}>
                                {totalItems} producto{totalItems === 1 ? '' : 's'}
                            </span>
                        </div>

                        {totalItems === 0 ? (
                            <div style={styles.emptyCard}>
                                <div style={styles.emptyIcon}>
                                    <Heart size={26} />
                                </div>

                                <h5 className="fw-bold mb-2" style={{ fontSize: '1rem' }}>
                                    Tu lista está vacía
                                </h5>

                                <p className="text-muted mb-0" style={{ fontSize: '0.84rem' }}>
                                    Agrega productos a favoritos para verlos aquí.
                                </p>
                            </div>
                        ) : (
                            <ListGroup variant="flush" style={{ fontSize: '0.88rem' }}>
                                {wishlistItems.map((item) => (
                                    <WishlistItem
                                        key={item.id}
                                        item={item}
                                        handleAddToCart={handleAddToCart}
                                        handleRemove={handleRemove}
                                        handleShowQuickViewModal={handleShowQuickViewModal}
                                        DeleteItemGustos={DeleteItemGustos}
                                    />
                                ))}
                            </ListGroup>
                        )}
                    </div>
                </div>

                <div style={styles.footer}>
                    <div style={styles.footerCard}>
                        <div>
                            <div style={styles.footerLabel}>
                                Productos guardados
                            </div>
                            <div style={styles.footerValue}>
                                {totalItems}
                            </div>
                        </div>

                        <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                            Favoritos
                        </Badge>
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default WishlistOffcanvas;