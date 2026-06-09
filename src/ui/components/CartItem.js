import React, { useMemo, useState } from 'react';

const IMAGE_BASE_URL = 'https://badgercore.cloud/MRO/Server/Images/';
const DEFAULT_IMAGE = 'Box.jpg';

const styles = {
    item: {
        display: 'grid',
        gridTemplateColumns: '70px 1fr',
        gap: '12px',
        padding: '12px 8px',
        borderBottom: '1px solid #eef3f8',
        background: '#fff'
    },
    imageBox: {
        width: '70px',
        height: '70px',
        borderRadius: '14px',
        background: '#f8fafc',
        border: '1px solid #edf2f7',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        padding: '7px'
    },
    content: {
        minWidth: 0
    },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        alignItems: 'flex-start'
    },
    title: {
        margin: 0,
        color: '#111827',
        fontSize: '0.88rem',
        fontWeight: 900,
        lineHeight: 1.25
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
    priceBox: {
        textAlign: 'right',
        minWidth: '74px'
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
    bottomRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        marginTop: '10px'
    },
    qtyWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    qtyLabelBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1px'
    },
    qtyLabel: {
        color: '#6b7280',
        fontSize: '0.68rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.03em'
    },
    stockText: {
        color: '#198754',
        fontSize: '0.7rem',
        fontWeight: 800
    },
    stockDanger: {
        color: '#dc3545'
    },
    qtyControl: {
        display: 'grid',
        gridTemplateColumns: '34px 44px 34px',
        height: '34px',
        border: '1px solid #cfd8e3',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#fff'
    },
    qtyBtn: {
        border: 0,
        background: '#f8fafc',
        color: '#64748b',
        fontWeight: 900,
        fontSize: '0.88rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    qtyBtnActive: {
        cursor: 'pointer'
    },
    qtyBtnDisabled: {
        opacity: 0.4,
        cursor: 'not-allowed'
    },
    qtyInput: {
        width: '44px',
        height: '34px',
        border: 0,
        borderLeft: '1px solid #cfd8e3',
        borderRight: '1px solid #cfd8e3',
        textAlign: 'center',
        color: '#111827',
        fontSize: '0.88rem',
        fontWeight: 900,
        outline: 'none',
        background: '#fff'
    },
    deleteBtn: {
        border: 0,
        background: 'transparent',
        color: '#198754',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '0.78rem',
        fontWeight: 800,
        padding: 0,
        cursor: 'pointer'
    },
    deleteIcon: {
        fontSize: '1.05rem'
    },
    subtotalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px dashed #e5eaf0'
    },
    subtotalLabel: {
        color: '#6b7280',
        fontSize: '0.72rem',
        fontWeight: 800
    },
    subtotalValue: {
        color: '#198754',
        fontSize: '0.9rem',
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

const CartItem = ({
    item,
    onQuantityChange,
    handleShowQuickViewModal
}) => {
    const [deleteHover, setDeleteHover] = useState(false);

    const {
        precioNormal,
        precioOferta,
        tieneOferta,
        precioFinal
    } = getPrecioFinal(item);

    const stock = Number(item?.Stock || item?.stock || 0);
    const quantity = Number(item?.quantity || 1);
    const sinStock = stock <= 0;

    const image = useMemo(() => getFirstImage(item?.img), [item?.img]);
    const subtotal = precioFinal * quantity;

    const updateQuantity = (nextValue) => {
        let nextQuantity = Number(nextValue);

        if (!nextQuantity || nextQuantity < 1) {
            nextQuantity = 1;
        }

        if (stock > 0 && nextQuantity > stock) {
            nextQuantity = stock;
        }

        if (typeof onQuantityChange === 'function') {
            onQuantityChange(item.id, nextQuantity);
        }
    };

    const decrement = () => {
        updateQuantity(quantity - 1);
    };

    const increment = () => {
        updateQuantity(quantity + 1);
    };

    const handleInputChange = (event) => {
        updateQuantity(event.target.value);
    };

    const handleDelete = () => {
        if (typeof item?.DeletItem === 'function') {
            item.DeletItem(item.id);
            return;
        }

        if (typeof item?.deleteItem === 'function') {
            item.deleteItem(item.id);
            return;
        }

        if (typeof item?.onDelete === 'function') {
            item.onDelete(item.id);
            return;
        }

        const oldDeleteButton = document.getElementById(`DeleteItem${item.id}`);
        if (oldDeleteButton) {
            oldDeleteButton.click();
        }
    };

    const handleQuickView = () => {
        if (typeof handleShowQuickViewModal === 'function') {
            handleShowQuickViewModal(item);
        }
    };

    return (
        <div style={styles.item}>
            <div
                style={styles.imageBox}
                onClick={handleQuickView}
                role="button"
                title="Ver producto"
            >
                <img
                    src={`${IMAGE_BASE_URL}${image}`}
                    alt={item?.descripcion || item?.nombre || 'Producto'}
                    style={styles.image}
                    onError={(event) => {
                        event.currentTarget.src = `${IMAGE_BASE_URL}${DEFAULT_IMAGE}`;
                    }}
                />
            </div>

            <div style={styles.content}>
                <div style={styles.topRow}>
                    <div style={{ minWidth: 0 }}>
                        <span style={styles.company}>
                            {item?.empresa || 'BA-MRO'}
                        </span>

                        <h6
                            style={styles.title}
                            onClick={handleQuickView}
                            role="button"
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
                            {formatMoney(tieneOferta ? precioOferta : precioNormal)}
                        </div>

                        {tieneOferta && (
                            <span style={styles.offerBadge}>
                                Oferta
                            </span>
                        )}
                    </div>
                </div>

                <div style={styles.bottomRow}>
                    <div style={styles.qtyWrap}>
                        <div style={styles.qtyLabelBox}>
                            <span style={styles.qtyLabel}>
                                Cantidad
                            </span>

                            <span
                                style={{
                                    ...styles.stockText,
                                    ...(sinStock ? styles.stockDanger : {})
                                }}
                            >
                                {sinStock ? 'Sin stock' : `Stock: ${stock}`}
                            </span>
                        </div>

                        <div style={styles.qtyControl}>
                            <button
                                type="button"
                                style={{
                                    ...styles.qtyBtn,
                                    ...((quantity <= 1 || sinStock)
                                        ? styles.qtyBtnDisabled
                                        : styles.qtyBtnActive)
                                }}
                                disabled={quantity <= 1 || sinStock}
                                onClick={decrement}
                            >
                                −
                            </button>

                            <input
                                id={`VItem${item.id}`}
                                name={`VItem${item.id}`}
                                type="number"
                                min={1}
                                max={stock || 1}
                                value={quantity}
                                disabled={sinStock}
                                onChange={handleInputChange}
                                style={styles.qtyInput}
                            />

                            <button
                                type="button"
                                style={{
                                    ...styles.qtyBtn,
                                    ...((sinStock || quantity >= stock)
                                        ? styles.qtyBtnDisabled
                                        : styles.qtyBtnActive)
                                }}
                                disabled={sinStock || quantity >= stock}
                                onClick={increment}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        style={{
                            ...styles.deleteBtn,
                            color: deleteHover ? '#dc3545' : '#198754'
                        }}
                        onMouseEnter={() => setDeleteHover(true)}
                        onMouseLeave={() => setDeleteHover(false)}
                        onClick={handleDelete}
                    >
                        <i className="bi bi-trash3" style={styles.deleteIcon} />
                        Eliminar
                    </button>
                </div>

                <div style={styles.subtotalRow}>
                    <span style={styles.subtotalLabel}>
                        Subtotal del artículo
                    </span>

                    <span style={styles.subtotalValue}>
                        {formatMoney(subtotal)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartItem;