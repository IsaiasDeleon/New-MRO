import { useEffect, useMemo, useState } from 'react';

const IMAGE_BASE_URL = 'https://badgercore.cloud/MRO/Server/Images/';
const DEFAULT_IMAGE = 'Box.jpg';

const styles = {
    card: {
        display: 'flex',
        gap: '18px',
        width: '100%',
        padding: '18px',
        marginBottom: '16px',
        background: '#ffffff',
        border: '1px solid #edf1f5',
        borderRadius: '22px',
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
        transition: 'all 0.18s ease'
    },
    imageWrap: {
        position: 'relative',
        width: '120px',
        minWidth: '120px',
        height: '120px',
        borderRadius: '18px',
        overflow: 'hidden',
        background: '#f3f6f9',
        border: '1px solid #edf1f5'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        padding: '10px'
    },
    offerBadge: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        padding: '4px 10px',
        borderRadius: '999px',
        background: '#ffc107',
        color: '#111827',
        fontSize: '0.72rem',
        fontWeight: 800
    },
    content: {
        flex: 1,
        minWidth: 0
    },
    mainRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '14px'
    },
    companyBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '999px',
        background: '#eef6ff',
        color: '#205c98',
        fontSize: '0.75rem',
        fontWeight: 800
    },
    stockBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 800
    },
    stockSuccess: {
        background: '#e9f8ef',
        color: '#198754'
    },
    stockDanger: {
        background: '#fff1f2',
        color: '#dc3545'
    },
    title: {
        margin: '6px 0 8px',
        color: '#111827',
        fontSize: '1rem',
        fontWeight: 800,
        lineHeight: 1.35
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    star: {
        fontSize: '0.95rem',
        marginRight: '3px'
    },
    ratingText: {
        color: '#6b7280',
        fontSize: '0.82rem',
        fontWeight: 700
    },
    deleteBtn: {
        width: '42px',
        height: '42px',
        minWidth: '42px',
        border: 0,
        borderRadius: '14px',
        background: '#fff1f2',
        color: '#dc3545',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    bottom: {
        display: 'grid',
        gridTemplateColumns: '1fr 170px 1fr',
        gap: '16px',
        alignItems: 'end',
        marginTop: '18px',
        paddingTop: '16px',
        borderTop: '1px solid #edf1f5'
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        color: '#6b7280',
        fontSize: '0.78rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
    },
    oldPrice: {
        color: '#9ca3af',
        fontSize: '0.88rem',
        fontWeight: 700,
        textDecoration: 'line-through'
    },
    currentPrice: {
        color: '#198754',
        fontSize: '1.15rem',
        fontWeight: 900
    },
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        height: '44px',
        border: '1px solid #dfe7ef',
        borderRadius: '999px',
        overflow: 'hidden',
        background: '#fff'
    },
    qtyBtn: {
        width: '42px',
        height: '44px',
        border: 0,
        background: '#f8fafc',
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    qtyBtnDisabled: {
        opacity: 0.45,
        cursor: 'not-allowed'
    },
    qtyInput: {
        width: '58px',
        height: '44px',
        border: 0,
        borderLeft: '1px solid #dfe7ef',
        borderRight: '1px solid #dfe7ef',
        textAlign: 'center',
        fontWeight: 800,
        color: '#111827',
        outline: 'none'
    },
    subtotalBox: {
        textAlign: 'right'
    },
    subtotal: {
        color: '#111827',
        fontSize: '1.2rem',
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

const Stars = ({ value = 0 }) => {
    const rating = Number(value || 0);

    return (
        <div style={styles.ratingRow}>
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <i
                        key={star}
                        className="bi bi-star-fill"
                        style={{
                            ...styles.star,
                            color: rating >= star ? '#ffc107' : '#d1d5db',
                            opacity: rating >= star ? 1 : 0.45
                        }}
                    />
                ))}
            </div>

            <span style={styles.ratingText}>
                {rating.toFixed(1)}
            </span>
        </div>
    );
};

export const CardCarrito = ({
    id,
    img,
    empresa,
    descripcion,
    estrellas,
    monto,
    DeletItem,
    variable,
    Totales,
    Stock,
    montoOferta,
    Oferta
}) => {
    const stockDisponible = Number(Stock || 0);
    const precioNormal = Number(monto || 0);
    const precioOferta = Number(montoOferta || 0);
    const tieneOferta = Number(Oferta) === 1 && precioOferta > 0;
    const precioFinal = tieneOferta ? precioOferta : precioNormal;

    const [cantidad, setCantidad] = useState(1);
    const [isHover, setIsHover] = useState(false);
    const [deleteHover, setDeleteHover] = useState(false);

    const imagen = useMemo(() => getFirstImage(img), [img]);

    const subtotal = useMemo(() => {
        return cantidad * precioFinal;
    }, [cantidad, precioFinal]);

    const sinStock = stockDisponible <= 0;

    useEffect(() => {
        if (stockDisponible > 0 && cantidad > stockDisponible) {
            setCantidad(stockDisponible);
        }
    }, [stockDisponible, cantidad]);

    const notifyTotalChange = (nextCantidad) => {
        if (typeof Totales === 'function') {
            Totales({
                target: {
                    id: variable,
                    name: 'v',
                    value: nextCantidad
                }
            });
        }
    };

    const updateCantidad = (value) => {
        let nextCantidad = Number(value);

        if (!nextCantidad || nextCantidad < 1) {
            nextCantidad = 1;
        }

        if (stockDisponible > 0 && nextCantidad > stockDisponible) {
            nextCantidad = stockDisponible;
        }

        setCantidad(nextCantidad);
        notifyTotalChange(nextCantidad);
    };

    const handleInputChange = (event) => {
        updateCantidad(event.target.value);
    };

    const decrementCantidad = () => {
        updateCantidad(cantidad - 1);
    };

    const incrementCantidad = () => {
        updateCantidad(cantidad + 1);
    };

    const handleDelete = () => {
        if (typeof DeletItem === 'function') {
            DeletItem(id);
        }
    };

    return (
        <div
            style={{
                ...styles.card,
                transform: isHover ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHover
                    ? '0 16px 36px rgba(15, 23, 42, 0.09)'
                    : styles.card.boxShadow,
                borderColor: isHover ? '#dbe5ee' : '#edf1f5'
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div style={styles.imageWrap}>
                <img
                    src={`${IMAGE_BASE_URL}${imagen}`}
                    alt={descripcion || 'Producto'}
                    style={styles.image}
                    onError={(event) => {
                        event.currentTarget.src = `${IMAGE_BASE_URL}${DEFAULT_IMAGE}`;
                    }}
                />

                {tieneOferta && (
                    <span style={styles.offerBadge}>
                        Oferta
                    </span>
                )}
            </div>

            <div style={styles.content}>
                <div style={styles.mainRow}>
                    <div style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <span style={styles.companyBadge}>
                                {empresa || 'BA-MRO'}
                            </span>

                            <span
                                style={{
                                    ...styles.stockBadge,
                                    ...(sinStock ? styles.stockDanger : styles.stockSuccess)
                                }}
                            >
                                {sinStock ? 'Sin stock' : `Stock: ${stockDisponible}`}
                            </span>
                        </div>

                        <h5 style={styles.title}>
                            {descripcion || 'Producto sin descripción'}
                        </h5>

                        <Stars value={estrellas} />
                    </div>

                    <button
                        type="button"
                        style={{
                            ...styles.deleteBtn,
                            background: deleteHover ? '#dc3545' : '#fff1f2',
                            color: deleteHover ? '#fff' : '#dc3545'
                        }}
                        onMouseEnter={() => setDeleteHover(true)}
                        onMouseLeave={() => setDeleteHover(false)}
                        onClick={handleDelete}
                        title="Eliminar del carrito"
                    >
                        <i className="bi bi-trash3" />
                    </button>
                </div>

                <div style={styles.bottom}>
                    <div>
                        <span style={styles.label}>Precio C/U</span>

                        {tieneOferta ? (
                            <>
                                <div style={styles.oldPrice}>
                                    {formatMoney(precioNormal)}
                                </div>

                                <div style={styles.currentPrice}>
                                    {formatMoney(precioOferta)}
                                </div>
                            </>
                        ) : (
                            <div style={styles.currentPrice}>
                                {formatMoney(precioNormal)}
                            </div>
                        )}
                    </div>

                    <div>
                        <span style={styles.label}>Cantidad</span>

                        <div style={styles.quantityControl}>
                            <button
                                type="button"
                                style={{
                                    ...styles.qtyBtn,
                                    ...((cantidad <= 1 || sinStock) ? styles.qtyBtnDisabled : {})
                                }}
                                onClick={decrementCantidad}
                                disabled={cantidad <= 1 || sinStock}
                            >
                                <i className="bi bi-dash" />
                            </button>

                            <input
                                name="v"
                                id={variable}
                                value={cantidad}
                                onChange={handleInputChange}
                                type="number"
                                min={1}
                                max={stockDisponible || 1}
                                disabled={sinStock}
                                style={styles.qtyInput}
                            />

                            <button
                                type="button"
                                style={{
                                    ...styles.qtyBtn,
                                    ...((sinStock || cantidad >= stockDisponible) ? styles.qtyBtnDisabled : {})
                                }}
                                onClick={incrementCantidad}
                                disabled={sinStock || cantidad >= stockDisponible}
                            >
                                <i className="bi bi-plus" />
                            </button>
                        </div>
                    </div>

                    <div style={styles.subtotalBox}>
                        <span style={styles.label}>Subtotal</span>

                        <div style={styles.subtotal}>
                            {formatMoney(subtotal)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};