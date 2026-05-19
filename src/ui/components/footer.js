import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const styles = {
    footer: {
        background: 'linear-gradient(135deg, #0f172a 0%, #17345f 55%, #205c98 100%)',
        color: '#ffffff',
        padding: '34px 0 22px',
        marginTop: '40px',
        borderTop: '1px solid rgba(255,255,255,0.08)'
    },
    brandBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '14px'
    },
    logoMark: {
        width: '44px',
        height: '44px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        color: '#ffffff'
    },
    brandText: {
        textAlign: 'left'
    },
    brandTitle: {
        margin: 0,
        fontSize: '1.05rem',
        fontWeight: 900,
        letterSpacing: '0.02em',
        color:"#fff"
    },
    brandSubtitle: {
        margin: 0,
        fontSize: '0.78rem',
        color: 'rgba(255,255,255,0.68)',
        fontWeight: 600
    },
    address: {
        margin: '0 auto',
        maxWidth: '760px',
        color: 'rgba(255,255,255,0.76)',
        fontSize: '0.86rem',
        lineHeight: 1.55
    },
    divider: {
        width: '100%',
        height: '1px',
        background: 'rgba(255,255,255,0.12)',
        margin: '22px 0 16px'
    },
    bottomRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap'
    },
    copy: {
        margin: 0,
        color: 'rgba(255,255,255,0.66)',
        fontSize: '0.78rem'
    },
    pillGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
    },
    pill: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderRadius: '999px',
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.78)',
        fontSize: '0.74rem',
        fontWeight: 700
    }
};

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={styles.footer}>
            <Container>
                <Row>
                    <Col xs={12} className="text-center">
                        <div style={styles.brandBox}>
                            <div style={styles.logoMark}>
                                <i className="bi bi-box-seam" />
                            </div>

                            <div style={styles.brandText}>
                                <h5 style={styles.brandTitle}>
                                    BA-MRO
                                </h5>
                                <p style={styles.brandSubtitle}>
                                    Marketplace industrial
                                </p>
                            </div>
                        </div>

                        <p style={styles.address}>
                            <i className="bi bi-geo-alt-fill me-2" />
                            Calzada Robledo Industrial 460, Col. Huertas del Colorado,
                            Mexicali, BC 21384, México
                        </p>

                        <div style={styles.divider} />

                        <div style={styles.bottomRow}>
                            <p style={styles.copy}>
                                © {currentYear} BA-MRO. Todos los derechos reservados.
                            </p>

                            <div style={styles.pillGroup}>
                                <span style={styles.pill}>
                                    <i className="bi bi-shield-check" />
                                    Compra segura
                                </span>

                                <span style={styles.pill}>
                                    <i className="bi bi-truck" />
                                    Proveedores industriales
                                </span>

                                <span style={styles.pill}>
                                    <i className="bi bi-headset" />
                                    Soporte
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;