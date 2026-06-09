import axios from 'axios';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Pagination,
    Offcanvas,
    Badge,
    Modal,
    Table,
    Alert
} from 'react-bootstrap';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import {
    Heart,
    ShoppingCart,
    ArrowLeft,
    ArrowRight,
    CreditCard,
    File,
    Sliders,
    Package,
    X,
    Tag,
    RefreshCcw,
    Eye,
    Zap,
    CheckCircle,
    Box,
    Search
} from 'react-feather';
import { AuthContext } from '../../auth/AuthContext';
import { Noti } from '../components/Notificaciones';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';

const HTTP = axios.create({
    baseURL: 'https://badgercore.cloud/MRO/Server/Data.php'
});

const IMAGE_BASE_URL = 'https://badgercore.cloud/MRO/Server/Images/';
const DEFAULT_IMAGE = 'Box.jpg';

const styles = {
    page: {
        background: '#f5f7fb',
        minHeight: '100vh'
    },

    hero: {
        borderRadius: '26px',
        background: 'linear-gradient(135deg, #001f34 0%, #17345f 50%, #205c98 100%)',
        color: '#fff',
        padding: '22px',
        marginBottom: '20px',
        boxShadow: '0 18px 36px rgba(15, 23, 42, 0.16)'
    },
    heroTitle: {
        margin: 0,
        fontSize: '1.45rem',
        fontWeight: 900
    },
    heroText: {
        margin: '5px 0 0',
        color: 'rgba(255,255,255,0.76)',
        fontSize: '0.9rem'
    },

    breadcrumbCard: {
        background: '#fff',
        border: '1px solid #e6edf5',
        borderRadius: '18px',
        padding: '11px 14px',
        marginBottom: '14px',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
        marginTop:"10px"
    },

    filterCard: {
        background: '#fff',
        border: '1px solid #e6edf5',
        borderRadius: '24px',
        padding: '16px',
        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)',
        position: 'sticky',
        top: '145px'
    },
    filterHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        marginBottom: '14px'
    },
    filterTitle: {
        margin: 0,
        color: '#111827',
        fontSize: '1rem',
        fontWeight: 900
    },
    filterSubtitle: {
        margin: 0,
        color: '#6b7280',
        fontSize: '0.76rem',
        fontWeight: 600
    },
    filterIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '15px',
        background: '#eef6ff',
        color: '#205c98',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionTitle: {
        color: '#111827',
        fontSize: '0.82rem',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '10px'
    },
    searchInput: {
        borderRadius: '14px',
        border: '1px solid #dfe7ef',
        padding: '10px 12px',
        fontSize: '0.86rem',
        fontWeight: 600
    },
    checkWrap: {
        maxHeight: '220px',
        overflowY: 'auto',
        paddingRight: '4px'
    },
    checkItem: {
        padding: '8px 10px',
        borderRadius: '13px',
        marginBottom: '4px',
        fontSize: '0.86rem',
        fontWeight: 700
    },

    toolbar: {
        background: '#fff',
        border: '1px solid #e6edf5',
        borderRadius: '22px',
        padding: '14px',
        marginBottom: '14px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
    },
    toolbarTitle: {
        margin: 0,
        color: '#111827',
        fontSize: '1rem',
        fontWeight: 900
    },
    toolbarText: {
        margin: 0,
        color: '#6b7280',
        fontSize: '0.82rem'
    },
    select: {
        borderRadius: '14px',
        border: '1px solid #dfe7ef',
        fontSize: '0.84rem',
        fontWeight: 700,
        padding: '9px 12px'
    },
    filterButtonMobile: {
        borderRadius: '999px',
        fontSize: '0.84rem',
        fontWeight: 900,
        padding: '9px 14px'
    },

    productCard: {
        border: '1px solid #e1eaf4',
        borderRadius: '28px',
        overflow: 'hidden',
        height: '100%',
        background: '#ffffff',
        boxShadow: '0 14px 30px rgba(15, 23, 42, 0.07)',
        transition: 'all 0.2s ease',
        position: 'relative'
    },
    productTopLine: {
        height: '5px',
        background: 'linear-gradient(90deg, #001f34 0%, #205c98 60%, #4ade80 100%)'
    },
    imageBox: {
        position: 'relative',
        height: '170px',
        background: 'radial-gradient(circle at top, #ffffff 0%, #f5f8fc 55%, #eef4fa 100%)',
        borderBottom: '1px solid #edf2f7',
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
    },
    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        transition: 'transform 0.22s ease'
    },
    quickViewButton: {
        position: 'absolute',
        right: '12px',
        bottom: '12px',
        width: '38px',
        height: '38px',
        borderRadius: '14px',
        border: '1px solid #dce7f2',
        background: '#ffffff',
        color: '#205c98',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 20px rgba(15, 23, 42, 0.12)',
        opacity: 0,
        transform: 'translateY(8px)',
        transition: 'all 0.2s ease'
    },
    quickViewButtonVisible: {
        opacity: 1,
        transform: 'translateY(0)'
    },
    offerBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        borderRadius: '999px',
        fontWeight: 900,
        fontSize: '0.68rem',
        padding: '6px 10px',
        background: '#fff1f2',
        color: '#dc3545',
        border: '1px solid #fecdd3',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px'
    },
    stockBadge: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        borderRadius: '999px',
        fontWeight: 900,
        fontSize: '0.68rem',
        padding: '6px 10px',
        background: '#f0fdf4',
        color: '#198754',
        border: '1px solid #bbf7d0',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px'
    },
    stockBadgeDanger: {
        background: '#fff1f2',
        color: '#dc3545',
        border: '1px solid #fecdd3'
    },
    cardBody: {
        padding: '16px'
    },
    topMetaRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        marginBottom: '10px'
    },
    categoryPill: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderRadius: '999px',
        background: '#eef6ff',
        color: '#205c98',
        fontSize: '0.72rem',
        fontWeight: 900,
        maxWidth: '75%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    conditionPill: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 9px',
        borderRadius: '999px',
        background: '#f8fafc',
        color: '#64748b',
        fontSize: '0.68rem',
        fontWeight: 900,
        border: '1px solid #e5eaf0',
        whiteSpace: 'nowrap'
    },
    productTitle: {
        color: '#111827',
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.25,
        cursor: 'pointer',
        marginBottom: '11px',
        minHeight: '50px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        marginBottom: '12px',
        flexWrap: 'wrap'
    },
    ratingValue: {
        color: '#64748b',
        fontSize: '0.78rem',
        fontWeight: 800
    },
    pricePanel: {
        borderRadius: '20px',
        background: 'linear-gradient(180deg, #f9fbfd 0%, #f2f6fb 100%)',
        border: '1px solid #e6edf5',
        padding: '13px',
        marginBottom: '12px'
    },
    priceLabel: {
        color: '#64748b',
        fontSize: '0.68rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '5px'
    },
    priceRow: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '8px',
        flexWrap: 'wrap'
    },
    price: {
        color: '#001f34',
        fontSize: '1.38rem',
        fontWeight: 650,
        lineHeight: 1
    },
    oldPrice: {
        color: '#9ca3af',
        fontSize: '0.82rem',
        fontWeight: 600,
        textDecoration: 'line-through'
    },
    actionRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 44px',
        gap: '9px'
    },
    btnCart: {
        borderRadius: '16px',
        fontSize: '0.84rem',
        fontWeight: 900,
        padding: '11px 12px',
        background: '#001f34',
        border: '0',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px'
    },
    btnFav: {
        width: '44px',
        height: '44px',
        borderRadius: '16px',
        background: '#f7fffa',
        border: '1px solid #b7ebc6',
        color: '#198754',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
    },

    emptyCard: {
        background: '#fff',
        border: '1px solid #e6edf5',
        borderRadius: '24px',
        padding: '36px',
        textAlign: 'center',
        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)'
    },
    emptyIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '22px',
        background: '#eef6ff',
        color: '#205c98',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
    },
    paginationWrap: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '26px'
    },

    quickModalBody: {
        padding: 0,
        borderRadius: '26px',
        overflow: 'hidden'
    },
    quickHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 20px',
        borderBottom: '1px solid #edf2f7'
    },
    closeBtn: {
        width: '38px',
        height: '38px',
        borderRadius: '14px',
        border: '1px solid #e5eaf0',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalImageArea: {
        background: '#f8fafc',
        minHeight: '520px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '22px'
    },
    modalMainImage: {
        maxWidth: '100%',
        maxHeight: '460px',
        objectFit: 'contain'
    },
    thumbRail: {
        position: 'absolute',
        left: '18px',
        top: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 2
    },
    thumb: {
        width: '58px',
        height: '58px',
        borderRadius: '14px',
        objectFit: 'contain',
        background: '#fff',
        padding: '5px',
        border: '1px solid #e5eaf0',
        cursor: 'pointer'
    },
    thumbActive: {
        border: '2px solid #205c98',
        boxShadow: '0 8px 18px rgba(32, 92, 152, 0.18)'
    },
    detailPanel: {
        padding: '24px'
    },
    detailTitle: {
        color: '#111827',
        fontSize: '1.35rem',
        fontWeight: 900,
        lineHeight: 1.25,
        marginBottom: '10px'
    },
    detailPrice: {
        color: '#001f34',
        fontSize: '1.7rem',
        fontWeight: 900
    },
    detailOldPrice: {
        color: '#9ca3af',
        fontSize: '1rem',
        fontWeight: 700,
        textDecoration: 'line-through',
        marginLeft: '10px'
    },
    infoTable: {
        fontSize: '0.86rem'
    },
    modalActionGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginTop: '16px'
    },
    modalBtn: {
        borderRadius: '999px',
        fontWeight: 900,
        padding: '11px 14px',
        fontSize: '0.86rem'
    },
    offerInput: {
        borderRadius: '14px',
        padding: '11px 14px',
        fontWeight: 700
    }
};

function valuetext(value) {
    return `${value}`;
}

const capitalizeFirstLetter = (string = '') => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const normalizeString = (string = '') => {
    const firstWord = String(string || '').split(' ')[0] || '';
    return firstWord.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const formatNumber = (num) => {
    const number = Number(num || 0);

    return number.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    });
};

const getImageUrl = (img) => {
    if (!img) return `${IMAGE_BASE_URL}${DEFAULT_IMAGE}`;

    const firstImage = String(img)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)[0];

    return `${IMAGE_BASE_URL}${firstImage || DEFAULT_IMAGE}`;
};

const getImages = (img) => {
    if (!img) return [DEFAULT_IMAGE];

    const imgs = String(img)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    return imgs.length ? imgs : [DEFAULT_IMAGE];
};

const getEstadoText = (estado) => {
    return String(estado) === '1' ? 'Nuevo' : 'Semi-nuevo';
};

const getEstatusText = (estatus) => {
    return String(estatus) === '1' ? 'Disponible' : 'No disponible';
};

const getPriceData = (product) => {
    const normal = Number(product?.monto || 0);
    const offer = Number(product?.montoOferta || 0);
    const hasOffer = offer > 0 && offer < normal;

    return {
        normal,
        offer,
        hasOffer,
        finalPrice: hasOffer ? offer : normal
    };
};

const Stars = ({ value = 0 }) => {
    const rating = Number(value || 0);

    return (
        <span className="d-inline-flex align-items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => {
                const filled = index < Math.floor(rating);
                const half = index < rating && !filled;

                return (
                    <i
                        key={index}
                        className={`bi bi-star${filled ? '-fill' : half ? '-half' : ''}`}
                        style={{
                            fontSize: '0.82rem',
                            color: filled || half ? '#f5b301' : '#d1d5db'
                        }}
                    />
                );
            })}
        </span>
    );
};

const ProductCard = ({
    product,
    onQuickView,
    onAddCart,
    onAddFavorite
}) => {
    const [hover, setHover] = useState(false);

    const imageSrc = getImageUrl(product.img);
    const { normal, finalPrice, hasOffer } = getPriceData(product);
    const stock = Number(product.Stock || 0);
    const sinStock = stock <= 0;
    const estadoText = getEstadoText(product.Estado);

    return (
        <Card
            style={{
                ...styles.productCard,
                transform: hover ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hover
                    ? '0 22px 42px rgba(15, 23, 42, 0.13)'
                    : styles.productCard.boxShadow,
                borderColor: hover ? '#c7d7ea' : styles.productCard.border.split(' ')[2]
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div style={styles.productTopLine} />

            <div style={styles.imageBox} onClick={() => onQuickView(product)}>
                {hasOffer && (
                    <span style={styles.offerBadge}>
                        <Zap size={12} />
                        Oferta
                    </span>
                )}

                <span
                    style={{
                        ...styles.stockBadge,
                        ...(sinStock ? styles.stockBadgeDanger : {})
                    }}
                >
                    <CheckCircle size={12} />
                    {sinStock ? 'Sin stock' : stock}
                </span>

                <button
                    type="button"
                    style={{
                        ...styles.quickViewButton,
                        ...(hover ? styles.quickViewButtonVisible : {})
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        onQuickView(product);
                    }}
                    title="Vista rápida"
                >
                    <Eye size={16} />
                </button>

                <img
                    src={imageSrc}
                    alt={product.nombre || product.descripcion}
                    style={{
                        ...styles.productImage,
                        transform: hover ? 'scale(1.06)' : 'scale(1)'
                    }}
                    onError={(event) => {
                        event.currentTarget.src = `${IMAGE_BASE_URL}${DEFAULT_IMAGE}`;
                    }}
                />
            </div>

            <Card.Body style={styles.cardBody}>
                <div style={styles.topMetaRow}>
                    <span style={styles.categoryPill}>
                        <Box size={12} />
                        {product.Categoria || 'Sin categoría'}
                    </span>

                    <span style={styles.conditionPill}>
                        {estadoText}
                    </span>
                </div>

                <h2
                    style={styles.productTitle}
                    onClick={() => onQuickView(product)}
                    title={product.descripcion || 'Producto'}
                >
                    {product.descripcion || 'Producto sin descripción'}
                </h2>

                <div style={styles.ratingRow}>
                    <Stars value={product.estrellas} />

                    <span style={styles.ratingValue}>
                        {Number(product.estrellas || 0).toFixed(1)}
                    </span>

                    <span style={styles.ratingValue}>
                        • {stock} disp.
                    </span>
                </div>

                <div style={styles.pricePanel}>
                    <div style={styles.priceLabel}>Precio</div>

                    <div style={styles.priceRow}>
                        <span style={styles.price}>
                            {formatNumber(finalPrice)}
                        </span>

                        {hasOffer && (
                            <span style={styles.oldPrice}>
                                {formatNumber(normal)}
                            </span>
                        )}
                    </div>
                </div>

                <div style={styles.actionRow}>
                    <Button
                        style={styles.btnCart}
                        onClick={() => onAddCart(product.id)}
                        disabled={sinStock}
                    >
                        <ShoppingCart size={15} />
                        {sinStock ? 'Agotado' : 'Agregar'}
                    </Button>

                    <Button
                        style={styles.btnFav}
                        onClick={() => onAddFavorite(product.id)}
                        title="Agregar a favoritos"
                    >
                        <Heart size={18} />
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export const Productos = ({
    data = [],
    setData,
    NumElementsCarrito = [],
    dataFiltrado = [],
    setMenu,
    ElementsGustos,
    NumElementsGustos,
    setClickProducto,
    acomodoCars,
    setAcomodoCards,
    setFiltros,
    filtros,
    setIdCard2,
    handleCloseQuickViewModal,
    handleShowQuickViewModal,
    showQuickViewModal,
    selectedProduct,
    selectedImage,
    setSelectedImage,
    estado,
    setEstadoMenu,
    setValue,
    value,
    dataFiltradoSinCat,
    ElementsCarrito
}) => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [itemsOrder, setItemsOrder] = useState(9);

    const [estadoProducto, setEstadoProducto] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [nameSearch, setNameSearch] = useState('');
    const [idCard, setIdCard] = useState();

    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();

    const [showAlert, setShowAlert] = useState(false);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerValue, setOfferValue] = useState('');
    const [textAlert, setTextAlert] = useState('');

    const { user } = useContext(AuthContext);
    const idU = user?.id;
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof setFiltros === 'function') {
            setFiltros((prev) => ({
                ...prev,
                Order: itemsOrder
            }));
        }
    }, [itemsOrder]);

    const handleAddToCart = (idProduct) => {
        if (!idU) {
            navigate('/Login', { replace: true });
            return;
        }

        setIdCard2(idProduct);
        setShowAlert(true);
        setTextAlert('Producto agregado al carrito');

        setTimeout(() => {
            setShowAlert(false);

            if (typeof ElementsCarrito === 'function') {
                ElementsCarrito();
            }
        }, 2500);
    };

    const handleAddToGustos = (idProduct) => {
        if (!idU) {
            navigate('/Login', { replace: true });
            return;
        }

        setIdCard(idProduct);
        setShowAlert(true);
        setTextAlert('Producto agregado a tu lista de deseos');

        setTimeout(() => {
            setShowAlert(false);

            if (typeof ElementsGustos === 'function') {
                ElementsGustos();
            }
        }, 2500);
    };

    const handleShowOfferModal = () => setShowOfferModal(true);
    const handleCloseOfferModal = () => setShowOfferModal(false);

    const handleOfferChange = (e) => {
        setOfferValue(e.target.value);
    };

    const handleCreateOffer = () => {
        if (!selectedProduct?.id || !idU || !offerValue) return;

        fetch(
            `https://badgercore.cloud/MRO/Server/Correo.php?IP=${selectedProduct.id}&IU=${idU}&Oferta=${offerValue}`
        )
            .then(() => {
                setNotiCarrito('CorreoEnviado');
                setActiveNoti(true);

                setTimeout(() => {
                    setActiveNoti(false);
                }, 4000);
            })
            .catch((error) => {
                console.error('Error al enviar oferta:', error);
                setNotiCarrito('ErrorOferta');
                setActiveNoti(true);

                setTimeout(() => {
                    setActiveNoti(false);
                }, 4000);
            });

        handleCloseOfferModal();
        setOfferValue('');
    };

    const handleCreatePDF = () => {
        if (!selectedProduct?.id || !idU) {
            navigate('/Login', { replace: true });
            return;
        }

        window.open(
            `https://badgercore.cloud/MRO/Server/PDF.php?IP=${selectedProduct.id}&IU=${idU}`,
            '_blank'
        );
    };

    const handleChange = useCallback(
        (event, newValue) => {
            setValue(newValue);
        },
        [setValue]
    );

    const handlePriceChangeCommitted = useCallback(() => {
        setFiltros((prev) => ({
            ...prev,
            value
        }));
        setCurrentPage(1);
    }, [setFiltros, value]);

    const handleNameChange = useCallback(
        (name) => {
            setSelectedName((prevName) => {
                const newName = prevName === name ? '' : name;

                setFiltros((prevFiltros) => ({
                    ...prevFiltros,
                    Nombre: newName
                }));

                return newName;
            });

            setCurrentPage(1);
        },
        [setFiltros]
    );

    const handleEstadoChange = (estadoValue) => {
        if (String(estadoProducto) === String(estadoValue)) {
            setEstadoProducto('');
            setFiltros((prev) => ({
                ...prev,
                Estado: 3
            }));
        } else {
            setEstadoProducto(estadoValue);
            setFiltros((prev) => ({
                ...prev,
                Estado: estadoValue
            }));
        }

        setCurrentPage(1);
    };

    const handleCloseOffcanvas = () => setShowOffcanvas(false);
    const handleShowOffcanvas = () => setShowOffcanvas(true);

    const totalPages = Math.ceil((dataFiltrado?.length || 0) / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;

        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredNames = useMemo(() => {
        const base = Array.isArray(dataFiltradoSinCat) ? dataFiltradoSinCat : [];

        return Array.from(
            new Set(
                base
                    .map((product) =>
                        capitalizeFirstLetter(normalizeString(product.nombre || ''))
                    )
                    .filter(Boolean)
            )
        )
            .filter((name) =>
                name.toLowerCase().includes(nameSearch.toLowerCase())
            )
            .sort();
    }, [dataFiltradoSinCat, nameSearch]);

    useEffect(() => {
        setSelectedName('');
        setCurrentPage(1);
    }, [filtros.Catego]);

    useEffect(() => {
        if (idCard !== undefined) {
            if (idU === undefined) {
                navigate('/Login', {
                    replace: true
                });
                return;
            }

            HTTP.post('/gustos', {
                idU,
                Num: idCard
            }).then((response) => {
                setNotiCarrito(response.data);
                setActiveNoti(true);

                setTimeout(() => {
                    setActiveNoti(false);
                }, 4000);

                if (typeof NumElementsGustos === 'function') {
                    NumElementsGustos();
                }

                if (typeof ElementsGustos === 'function') {
                    ElementsGustos();
                }
            });
        }
    }, [idCard]);

    const handleCategoriasClick = () => {
        setFiltros({
            Catego: '',
            text: '',
            value: [0, 100000],
            Oferta: 0,
            Estado: 3,
            Nombre: ''
        });

        setEstadoProducto('');
        setSelectedName('');
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = useMemo(() => {
        const base = Array.isArray(dataFiltrado) ? dataFiltrado : [];
        return base.slice(indexOfFirstItem, indexOfLastItem);
    }, [dataFiltrado, indexOfFirstItem, indexOfLastItem]);

    const renderPageNumbers = () => {
        const pageItems = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageItems.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }
        } else {
            const siblings = 1;

            pageItems.push(
                <Pagination.Item
                    key={1}
                    active={1 === currentPage}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Pagination.Item>
            );

            if (currentPage > 3) {
                pageItems.push(<Pagination.Ellipsis key="left-ellipsis" disabled />);
            }

            for (
                let i = Math.max(2, currentPage - siblings);
                i <= Math.min(totalPages - 1, currentPage + siblings);
                i++
            ) {
                pageItems.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }

            if (currentPage < totalPages - 2) {
                pageItems.push(<Pagination.Ellipsis key="right-ellipsis" disabled />);
            }

            pageItems.push(
                <Pagination.Item
                    key={totalPages}
                    active={totalPages === currentPage}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        return pageItems;
    };

    const FilterContent = () => (
        <>
            <div style={styles.filterHeader}>
                <div>
                    <h5 style={styles.filterTitle}>Filtros</h5>
                    <p style={styles.filterSubtitle}>Refina los productos visibles.</p>
                </div>

                <div style={styles.filterIcon}>
                    <Sliders size={18} />
                </div>
            </div>

            <div className="mb-4">
                <div style={styles.sectionTitle}>Nombre</div>

                <Form.Control
                    type="search"
                    placeholder="Buscar marca o nombre"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    style={styles.searchInput}
                    className="mb-3"
                />

                <div style={styles.checkWrap}>
                    {filteredNames.length === 0 ? (
                        <div className="text-muted small">
                            Sin coincidencias.
                        </div>
                    ) : (
                        filteredNames.map((name, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.checkItem,
                                    background: selectedName === name ? '#eef6ff' : 'transparent'
                                }}
                            >
                                <Form.Check
                                    label={name}
                                    checked={selectedName === name}
                                    onChange={() => handleNameChange(name)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mb-4">
                <div style={styles.sectionTitle}>Precio</div>

                <Stack
                    spacing={2}
                    direction="row"
                    sx={{ mb: 1, mt: 4 }}
                    alignItems="center"
                >
                    <h6 className="text-primary text-slider mb-0">$0</h6>

                    <Slider
                        value={value}
                        onChange={handleChange}
                        min={0}
                        max={100000}
                        valueLabelDisplay="on"
                        step={100}
                        getAriaValueText={valuetext}
                        color="primary"
                        onChangeCommitted={handlePriceChangeCommitted}
                    />

                    <h6 className="text-primary text-slider mb-0">$100,000</h6>
                </Stack>
            </div>

            <div className="mb-4">
                <div style={styles.sectionTitle}>Estado del producto</div>

                <div
                    style={{
                        ...styles.checkItem,
                        background: String(estadoProducto) === '1' ? '#eef6ff' : 'transparent'
                    }}
                >
                    <Form.Check
                        label="Nuevo"
                        checked={String(estadoProducto) === '1'}
                        onChange={() => handleEstadoChange('1')}
                    />
                </div>

                <div
                    style={{
                        ...styles.checkItem,
                        background: String(estadoProducto) === '2' ? '#eef6ff' : 'transparent'
                    }}
                >
                    <Form.Check
                        label="Usado"
                        checked={String(estadoProducto) === '2'}
                        onChange={() => handleEstadoChange('2')}
                    />
                </div>
            </div>

            <Button
                variant="outline-secondary"
                className="w-100 rounded-pill fw-bold"
                onClick={handleCategoriasClick}
            >
                <RefreshCcw size={15} className="me-2" />
                Limpiar filtros
            </Button>
        </>
    );

    const selectedProductImages = getImages(selectedProduct?.img);
    const selectedProductPrice = getPriceData(selectedProduct || {});
    const mainSelectedImage = selectedImage || selectedProductImages[0];

    return (
        <div className="contenedorIndex" style={styles.page}>
            <main>
                <Container className="pt-4 mb-lg-5 mb-4">
                    
                    <div style={styles.breadcrumbCard}>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link to="/Inicio">Inicio</Link>
                                </li>

                                <li className="breadcrumb-item">
                                    <span
                                        onClick={handleCategoriasClick}
                                        style={{
                                            cursor: 'pointer',
                                            color: '#164A80',
                                            fontWeight: 800
                                        }}
                                    >
                                        Categoría
                                    </span>
                                </li>

                                <li className="breadcrumb-item active" aria-current="page">
                                    {filtros.Catego !== '' ? filtros.Catego : 'Todas'}
                                </li>
                            </ol>
                        </nav>
                    </div>

                    {showAlert && (
                        <Alert variant="success" className="rounded-4 fw-bold">
                            {textAlert}
                        </Alert>
                    )}

                    <Row className="gx-4">
                        <Col lg={3} md={4} className="mb-4 mb-md-0 d-none d-lg-block">
                            <div style={styles.filterCard}>
                                <FilterContent />
                            </div>
                        </Col>

                        <Offcanvas
                            show={showOffcanvas}
                            onHide={handleCloseOffcanvas}
                            placement="start"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title className="fw-bold">
                                    Filtros
                                </Offcanvas.Title>
                            </Offcanvas.Header>

                            <Offcanvas.Body>
                                <FilterContent />
                            </Offcanvas.Body>
                        </Offcanvas>

                        <Col lg={9} md={12}>
                            <div style={styles.toolbar}>
                                <div className="d-lg-flex justify-content-between align-items-center gap-3">
                                    <div>
                                        <h5 style={styles.toolbarTitle}>
                                            Catálogo de productos
                                        </h5>

                                        <p style={styles.toolbarText}>
                                            <b>{dataFiltrado.length}</b> productos encontrados
                                        </p>
                                    </div>

                                    <div className="d-md-flex justify-content-between align-items-center gap-2">
                                        <div className="d-lg-none mb-2 mb-md-0">
                                            <Button
                                                variant="outline-secondary"
                                                onClick={handleShowOffcanvas}
                                                style={styles.filterButtonMobile}
                                            >
                                                <Sliders size={15} className="me-2" />
                                                Filtros
                                            </Button>
                                        </div>

                                        <div className="d-flex mt-2 mt-lg-0 gap-2 flex-wrap">
                                            <Form.Select
                                                style={styles.select}
                                                value={itemsPerPage}
                                                onChange={(e) => {
                                                    setItemsPerPage(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <option value={9}>Mostrar: 9</option>
                                                <option value={18}>Mostrar: 18</option>
                                                <option value={27}>Mostrar: 27</option>
                                            </Form.Select>

                                            <Form.Select
                                                style={styles.select}
                                                value={itemsOrder}
                                                onChange={(e) => setItemsOrder(Number(e.target.value))}
                                            >
                                                <option value={1}>Precio: menor a mayor</option>
                                                <option value={2}>Precio: mayor a menor</option>
                                                <option value={3}>Más recientes</option>
                                            </Form.Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {currentItems.length === 0 ? (
                                <div style={styles.emptyCard}>
                                    <div style={styles.emptyIcon}>
                                        <Package size={28} />
                                    </div>

                                    <h5 className="fw-bold">
                                        No encontramos productos
                                    </h5>

                                    <p className="text-muted mb-3">
                                        Ajusta los filtros o intenta con otra búsqueda.
                                    </p>

                                    <Button
                                        variant="dark"
                                        className="rounded-pill fw-bold px-4"
                                        onClick={handleCategoriasClick}
                                    >
                                        Limpiar filtros
                                    </Button>
                                </div>
                            ) : (
                                <Row className="g-3 row-cols-xl-3 row-cols-lg-2 row-cols-1 row-cols-md-2">
                                    {currentItems.map((product) => (
                                        <Col key={product.id}>
                                            <ProductCard
                                                product={product}
                                                onQuickView={handleShowQuickViewModal}
                                                onAddCart={handleAddToCart}
                                                onAddFavorite={handleAddToGustos}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            )}

                            {totalPages > 1 && (
                                <div style={styles.paginationWrap}>
                                    <Pagination>
                                        <Pagination.Prev
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ArrowLeft size={16} />
                                        </Pagination.Prev>

                                        {renderPageNumbers()}

                                        <Pagination.Next
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ArrowRight size={16} />
                                        </Pagination.Next>
                                    </Pagination>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </main>

            <Modal
                show={showQuickViewModal}
                onHide={handleCloseQuickViewModal}
                size="xl"
                centered
            >
                {selectedProduct && (
                    <Modal.Body style={styles.quickModalBody}>
                        <div style={styles.quickHeader}>
                            <div>
                                <h5 className="fw-bold mb-0">
                                    Vista rápida
                                </h5>

                                <div className="text-muted small">
                                    Detalles del producto seleccionado
                                </div>
                            </div>

                            <button
                                type="button"
                                style={styles.closeBtn}
                                onClick={handleCloseQuickViewModal}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <Row className="g-0">
                            <Col lg={6}>
                                <div style={styles.modalImageArea}>
                                    {selectedProduct.img && (
                                        <div style={styles.thumbRail}>
                                            {selectedProductImages.map((imgSrc, index) => (
                                                <img
                                                    key={index}
                                                    src={`${IMAGE_BASE_URL}${imgSrc}`}
                                                    onClick={() => setSelectedImage(imgSrc)}
                                                    alt="Producto"
                                                    style={{
                                                        ...styles.thumb,
                                                        ...(mainSelectedImage === imgSrc ? styles.thumbActive : {})
                                                    }}
                                                    onError={(event) => {
                                                        event.currentTarget.src = `${IMAGE_BASE_URL}${DEFAULT_IMAGE}`;
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <img
                                        src={`${IMAGE_BASE_URL}${mainSelectedImage}`}
                                        alt={selectedProduct.descripcion || 'Producto'}
                                        style={styles.modalMainImage}
                                        onError={(event) => {
                                            event.currentTarget.src = `${IMAGE_BASE_URL}${DEFAULT_IMAGE}`;
                                        }}
                                    />
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div style={styles.detailPanel}>
                                    <Badge bg="light" text="dark" className="rounded-pill px-3 py-2 mb-3">
                                        {selectedProduct.Categoria || 'Sin categoría'}
                                    </Badge>

                                    <h4 style={styles.detailTitle}>
                                        {selectedProduct.descripcion}
                                    </h4>

                                    <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
                                        <Stars value={selectedProduct.estrellas} />

                                        <span className="text-muted small">
                                            {Number(selectedProduct.estrellas || 0).toFixed(1)}
                                        </span>

                                        <Badge bg="success" className="rounded-pill">
                                            {selectedProduct.Stock} en stock
                                        </Badge>
                                    </div>

                                    <div className="mb-3">
                                        <span style={styles.detailPrice}>
                                            {formatNumber(selectedProductPrice.finalPrice)}
                                        </span>

                                        {selectedProductPrice.hasOffer && (
                                            <span style={styles.detailOldPrice}>
                                                {formatNumber(selectedProductPrice.normal)}
                                            </span>
                                        )}
                                    </div>

                                    {showAlert && (
                                        <Alert variant="success" className="rounded-4 fw-bold">
                                            {textAlert}
                                        </Alert>
                                    )}

                                    <Table borderless responsive style={styles.infoTable}>
                                        <tbody>
                                            <tr>
                                                <td className="text-muted fw-bold">Marca/Fabricante:</td>
                                                <td className="fw-bold">{selectedProduct.Marca || 'No especificado'}</td>
                                            </tr>

                                            <tr>
                                                <td className="text-muted fw-bold">Código proveedor:</td>
                                                <td className="fw-bold">{selectedProduct.CodigoProveedor || 'No especificado'}</td>
                                            </tr>

                                            <tr>
                                                <td className="text-muted fw-bold">Peso aproximado:</td>
                                                <td className="fw-bold">{selectedProduct.Peso || 'No especificado'}</td>
                                            </tr>

                                            <tr>
                                                <td className="text-muted fw-bold">Estado:</td>
                                                <td className="fw-bold">{getEstadoText(selectedProduct.Estado)}</td>
                                            </tr>

                                            <tr>
                                                <td className="text-muted fw-bold">Estatus:</td>
                                                <td className="fw-bold">{getEstatusText(selectedProduct.Estatus)}</td>
                                            </tr>

                                            <tr>
                                                <td className="text-muted fw-bold">Tiempo de entrega:</td>
                                                <td className="fw-bold">{selectedProduct.TempodeEntrega || 'No especificado'}</td>
                                            </tr>

                                            <tr>
                                                <td className="text-muted fw-bold">Entrega si se agota:</td>
                                                <td className="fw-bold">{selectedProduct.TempoDdeEntregaAgotado || 'No especificado'}</td>
                                            </tr>

                                            <tr>
                                                <td className="text-muted fw-bold">Ficha técnica:</td>
                                                <td>
                                                    {selectedProduct.PDF ? (
                                                        <b
                                                            onClick={handleCreatePDF}
                                                            className="text-danger"
                                                            style={{
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {selectedProduct.PDF}
                                                        </b>
                                                    ) : (
                                                        <span className="text-muted">No disponible</span>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>

                                    <div style={styles.modalActionGrid}>
                                        <Button
                                            variant="dark"
                                            style={styles.modalBtn}
                                            onClick={() => handleAddToCart(selectedProduct.id)}
                                        >
                                            <ShoppingCart size={17} className="me-2" />
                                            Carrito
                                        </Button>

                                        <Button
                                            variant="outline-success"
                                            style={styles.modalBtn}
                                            onClick={() => handleAddToGustos(selectedProduct.id)}
                                        >
                                            <Heart size={17} className="me-2" />
                                            Favorito
                                        </Button>

                                        <Button
                                            variant="primary"
                                            style={styles.modalBtn}
                                            onClick={handleShowOfferModal}
                                        >
                                            <CreditCard size={17} className="me-2" />
                                            Hacer oferta
                                        </Button>

                                        <Button
                                            variant="outline-secondary"
                                            style={styles.modalBtn}
                                            onClick={handleCreatePDF}
                                        >
                                            <File size={17} className="me-2" />
                                            Cotizar
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                )}
            </Modal>

            <Modal show={showOfferModal} onHide={handleCloseOfferModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">
                        Ofertar por el producto
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Alert variant="light" className="border rounded-4">
                        <Tag size={17} className="me-2" />
                        Ingresa el monto que deseas ofrecer por este producto.
                    </Alert>

                    <Form>
                        <Form.Group controlId="offerValue">
                            <Form.Label className="fw-bold">Oferta</Form.Label>

                            <Form.Control
                                type="number"
                                name="Oferta"
                                value={offerValue}
                                onChange={handleOfferChange}
                                placeholder="Ejemplo: 1500"
                                style={styles.offerInput}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        className="rounded-pill fw-bold px-4"
                        onClick={handleCloseOfferModal}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        className="rounded-pill fw-bold px-4"
                        onClick={handleCreateOffer}
                        disabled={!offerValue}
                    >
                        Ofertar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />

            <Footer />
        </div>
    );
};