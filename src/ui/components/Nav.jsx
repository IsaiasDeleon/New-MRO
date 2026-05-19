import React, { useContext, useMemo, useState } from 'react';
import {
    Container,
    Offcanvas,
    Form,
    InputGroup,
    Button,
    Nav,
    NavDropdown,
    Badge
} from 'react-bootstrap';
import {
    Search,
    ChevronDown,
    Grid,
    Package,
    PlusCircle,
    UserPlus,
    Home,
    Sliders,
    Menu
} from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

const styles = {
    navShell: {
        position: 'fixed',
        top: '72px',
        left: 0,
        width: '100%',
      
        background: 'linear-gradient(90deg, #001f34 0%, #17345f 45%, #205c98 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)'
    },
    navInner: {
        padding: '10px 18px'
    },
    container: {
        padding: 0
    },
    navWrap: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
    },
    leftNav: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap'
    },
    rightNav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '10px',
        flexWrap: 'wrap'
    },
    categoryButton: {
        borderRadius: '999px',
        background: '#ffffff',
        color: '#001f34',
        padding: '8px 14px',
        fontSize: '0.84rem',
        fontWeight: 900,
        border: '1px solid rgba(255,255,255,0.18)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 8px 18px rgba(0, 0, 0, 0.12)'
    },
    navLink: {
        borderRadius: '999px',
        padding: '8px 13px',
        color: '#ffffff',
        fontSize: '0.84rem',
        fontWeight: 800,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.18)',
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
    },
    navLinkPrimary: {
        borderRadius: '999px',
        padding: '8px 13px',
        color: '#205c98',
        fontSize: '0.84rem',
        fontWeight: 900,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        background: '#ffffff',
        border: '1px solid #ffffff',
        boxShadow: '0 8px 18px rgba(0, 0, 0, 0.12)',
        whiteSpace: 'nowrap'
    },
    adminLink: {
        borderRadius: '999px',
        padding: '8px 13px',
        color: '#111827',
        fontSize: '0.84rem',
        fontWeight: 900,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        background: '#fff7d6',
        border: '1px solid #fde68a',
        whiteSpace: 'nowrap'
    },
    mobileButton: {
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'rgba(255,255,255,0.12)',
        color: '#ffffff',
        borderRadius: '14px',
        padding: '8px 10px',
        boxShadow: '0 8px 18px rgba(15, 23, 42, 0.10)'
    },
    categoryItem: {
        fontSize: '0.84rem',
        fontWeight: 700,
        padding: '9px 14px'
    },
    offcanvas: {
        background: '#f5f7fb',
        width: '340px'
    },
    offcanvasHeader: {
        background: '#ffffff',
        borderBottom: '1px solid #e8eef5',
        padding: 0
    },
    offcanvasHeaderBlue: {
        width: '100%',
        height: '8px',
        background: 'linear-gradient(90deg, #001f34 0%, #17345f 45%, #205c98 100%)'
    },
    offcanvasHeaderContent: {
        padding: '18px 20px',
        width: '100%'
    },
    offcanvasTitleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    offcanvasIcon: {
        width: '44px',
        height: '44px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #17345f 0%, #244f8f 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    offcanvasTitle: {
        margin: 0,
        color: '#111827',
        fontSize: '1.15rem',
        fontWeight: 900
    },
    offcanvasSubtitle: {
        margin: 0,
        color: '#6b7280',
        fontSize: '0.8rem',
        fontWeight: 600
    },
    offcanvasBody: {
        padding: '16px'
    },
    mobileSearchBox: {
        background: '#ffffff',
        border: '1px solid #e5eaf0',
        borderRadius: '18px',
        padding: '12px',
        marginBottom: '14px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
    },
    searchGroup: {
        borderRadius: '999px',
        overflow: 'hidden',
        border: '1px solid #dfe7ef',
        background: '#f8fafc'
    },
    searchInput: {
        border: 0,
        background: 'transparent',
        padding: '10px 14px',
        color: '#111827',
        fontSize: '0.88rem',
        fontWeight: 600,
        boxShadow: 'none'
    },
    searchButton: {
        border: 0,
        width: '46px',
        background: '#001f34',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mobilePanel: {
        background: '#ffffff',
        border: '1px solid #e5eaf0',
        borderRadius: '20px',
        padding: '12px',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
    },
    mobileSectionTitle: {
        color: '#6b7280',
        fontSize: '0.74rem',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        margin: '6px 4px 10px'
    },
    mobileLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '11px 12px',
        borderRadius: '15px',
        color: '#111827',
        fontSize: '0.9rem',
        fontWeight: 800,
        textDecoration: 'none'
    },
    mobileLinkIcon: {
        width: '34px',
        height: '34px',
        borderRadius: '12px',
        background: '#eef6ff',
        color: '#205c98',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export const Navigation = ({ dataCategrorias = [], setFiltros, filtros = {} }) => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const tipoUser = user?.tipoUser;
    const idEmpresa = user?.Empresa;

    const categories = useMemo(() => {
        const cleanCategories = Array.isArray(dataCategrorias)
            ? dataCategrorias.filter(Boolean)
            : [];

        return ['Todos', ...cleanCategories];
    }, [dataCategrorias]);

    const selectedCategory = filtros?.Catego || '';

    const handleShowOffcanvas = () => setShowOffcanvas(true);
    const handleCloseOffcanvas = () => setShowOffcanvas(false);

    const handleCategoryChange = (cat) => {
        const newCategory = cat === 'Todos' ? '' : cat;

        if (typeof setFiltros === 'function') {
            setFiltros({
                ...filtros,
                Catego: newCategory,
                Nombre: ''
            });
        }

        navigate('/Productos', { replace: true });
        handleCloseOffcanvas();
    };

    const handleMobileSearch = (event) => {
        const value = event.target.value;

        if (typeof setFiltros === 'function') {
            setFiltros({
                ...filtros,
                text: value
            });
        }

        navigate('/Productos', { replace: true });
    };

    const handleSubmitSearch = (event) => {
        event.preventDefault();
        navigate('/Productos', { replace: true });
        handleCloseOffcanvas();
    };

    const renderSellerLinks = (isMobile = false) => {
        if (!idEmpresa) return null;

        if (isMobile) {
            return (
                <>
                    <div style={styles.mobileSectionTitle}>
                        Panel de vendedor
                    </div>

                    <Link to="/Dashboard" onClick={handleCloseOffcanvas} style={styles.mobileLink}>
                        <span style={styles.mobileLinkIcon}>
                            <Package size={16} />
                        </span>
                        Mis Productos
                    </Link>

                    {tipoUser !== '2' && (
                        <Link to="/NewProducts" onClick={handleCloseOffcanvas} style={styles.mobileLink}>
                            <span style={styles.mobileLinkIcon}>
                                <PlusCircle size={16} />
                            </span>
                            Agregar producto
                        </Link>
                    )}

                    {tipoUser === '4' && (
                        <Link to="/NewUser" onClick={handleCloseOffcanvas} style={styles.mobileLink}>
                            <span style={styles.mobileLinkIcon}>
                                <UserPlus size={16} />
                            </span>
                            Agregar usuario
                        </Link>
                    )}
                </>
            );
        }

        return (
            <div style={styles.rightNav}>
                <Nav.Link as={Link} to="/Dashboard" style={styles.navLink}>
                    <Package size={15} />
                    Mis Productos
                </Nav.Link>

                {tipoUser !== '2' && (
                    <Nav.Link as={Link} to="/NewProducts" style={styles.navLinkPrimary}>
                        <PlusCircle size={15} />
                        Agregar producto
                    </Nav.Link>
                )}

                {tipoUser === '4' && (
                    <Nav.Link as={Link} to="/NewUser" style={styles.adminLink}>
                        <UserPlus size={15} />
                        Agregar usuario
                    </Nav.Link>
                )}
            </div>
        );
    };

    return (
        <>
            <header style={styles.navShell}>
                <div style={styles.navInner}>
                    <Container fluid style={styles.container}>
                        <div style={styles.navWrap}>
                            <div className="d-none d-lg-flex" style={styles.leftNav}>
                                <NavDropdown
                                    id="categories-dropdown"
                                    align="start"
                                    title={
                                        <span style={styles.categoryButton}>
                                            <Grid size={16} />
                                            Categorías
                                            {selectedCategory && (
                                                <Badge bg="warning" text="dark" pill>
                                                    {selectedCategory}
                                                </Badge>
                                            )}
                                            <ChevronDown size={15} />
                                        </span>
                                    }
                                >
                                    {categories.map((cat) => {
                                        const isActive =
                                            (cat === 'Todos' && !selectedCategory) ||
                                            selectedCategory === cat;

                                        return (
                                            <NavDropdown.Item
                                                key={cat}
                                                as={Link}
                                                to="/Productos"
                                                onClick={() => handleCategoryChange(cat)}
                                                active={isActive}
                                                style={styles.categoryItem}
                                            >
                                                {cat === 'Todos' ? 'Todas las categorías' : cat}
                                            </NavDropdown.Item>
                                        );
                                    })}
                                </NavDropdown>

                                <Nav.Link as={Link} to="/Inicio" style={styles.navLink}>
                                    <Home size={15} />
                                    Inicio
                                </Nav.Link>

                                <Nav.Link as={Link} to="/Productos" style={styles.navLink}>
                                    <Sliders size={15} />
                                    Productos
                                </Nav.Link>
                            </div>

                            <div className="d-none d-lg-flex">
                                {renderSellerLinks(false)}
                            </div>

                            <Button
                                onClick={handleShowOffcanvas}
                                className="d-lg-none"
                                style={styles.mobileButton}
                            >
                                <Menu size={18} />
                            </Button>
                        </div>
                    </Container>
                </div>
            </header>

            <Offcanvas
                show={showOffcanvas}
                onHide={handleCloseOffcanvas}
                placement="start"
                style={styles.offcanvas}
            >
                <Offcanvas.Header closeButton style={styles.offcanvasHeader}>
                    <div style={{ width: '100%' }}>
                        <div style={styles.offcanvasHeaderBlue} />

                        <div style={styles.offcanvasHeaderContent}>
                            <div style={styles.offcanvasTitleRow}>
                                <div style={styles.offcanvasIcon}>
                                    <Grid size={20} />
                                </div>

                                <div>
                                    <Offcanvas.Title style={styles.offcanvasTitle}>
                                        Navegación
                                    </Offcanvas.Title>

                                    <p style={styles.offcanvasSubtitle}>
                                        Explora productos y categorías.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Offcanvas.Header>

                <Offcanvas.Body style={styles.offcanvasBody}>
                    <div style={styles.mobileSearchBox}>
                        <Form onSubmit={handleSubmitSearch}>
                            <InputGroup style={styles.searchGroup}>
                                <Form.Control
                                    type="search"
                                    value={filtros?.text || ''}
                                    onChange={handleMobileSearch}
                                    placeholder="Buscar productos..."
                                    style={styles.searchInput}
                                />

                                <Button type="submit" style={styles.searchButton}>
                                    <Search size={17} />
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>

                    <div style={styles.mobilePanel}>
                        <div style={styles.mobileSectionTitle}>
                            Categorías
                        </div>

                        {categories.map((cat) => {
                            const isActive =
                                (cat === 'Todos' && !selectedCategory) ||
                                selectedCategory === cat;

                            return (
                                <Link
                                    key={cat}
                                    to="/Productos"
                                    onClick={() => handleCategoryChange(cat)}
                                    style={{
                                        ...styles.mobileLink,
                                        background: isActive ? '#eef6ff' : 'transparent',
                                        color: isActive ? '#205c98' : '#111827'
                                    }}
                                >
                                    <span
                                        style={{
                                            ...styles.mobileLinkIcon,
                                            background: isActive ? '#205c98' : '#eef6ff',
                                            color: isActive ? '#ffffff' : '#205c98'
                                        }}
                                    >
                                        <Grid size={16} />
                                    </span>

                                    {cat === 'Todos' ? 'Todas las categorías' : cat}
                                </Link>
                            );
                        })}

                        <div style={styles.mobileSectionTitle}>
                            Accesos rápidos
                        </div>

                        <Link to="/Inicio" onClick={handleCloseOffcanvas} style={styles.mobileLink}>
                            <span style={styles.mobileLinkIcon}>
                                <Home size={16} />
                            </span>
                            Inicio
                        </Link>

                        <Link to="/Productos" onClick={handleCloseOffcanvas} style={styles.mobileLink}>
                            <span style={styles.mobileLinkIcon}>
                                <Sliders size={16} />
                            </span>
                            Productos
                        </Link>

                        {renderSellerLinks(true)}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};