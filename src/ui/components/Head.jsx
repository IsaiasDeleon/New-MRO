import React, { useContext, useState } from 'react';
import { Container, Row, Col, Navbar, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { Search, ShoppingBag, Heart, AlignLeft, User, Bell } from 'react-feather';
import { AuthContext } from '../../auth/AuthContext';
import UserModal from './UserModal';
import CartOffcanvas from './CartOffcanvas';
import WishlistOffcanvas from './WishlistOffcanvas';
import ProfileMenu from './ProfileMenu';
import NotiOofcanvas from './Notioffcanvas';
import { Link, useNavigate } from 'react-router-dom';

export const Head = ({ numArticulos, numGustos, elemntsGustos, elemntsCarrito,NumElementsCarrito,numNoti,ElementsCarrito,elemntsNoti,EliminarNotiFicacion,ComprarProductoNoti,reloadAll,handleShowQuickViewModal,setIdCard2,DeleteItemGustos, filtros,setFiltros }) => {
    const { user } = useContext(AuthContext);
    let idU = user?.id;
    const navigate = useNavigate();
    const [showUserModal, setShowUserModal] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showWishlist, setShowWishlist] = useState(false);
    const [showNoti, setShowNoti] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const handleShowUserModal = () => setShowUserModal(true);
    const handleCloseUserModal = () => setShowUserModal(false);
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);
    const handleShowWishlist = () => setShowWishlist(true);
    const handleCloseWishlist = () => setShowWishlist(false);
    const handleShowNoti = () => setShowNoti(true);
    const handleCloseNoti = () => setShowNoti(false);
    const handleAddToCart = (idProduct) => {
        setIdCard2(idProduct);
        setShowAlert(true);
       
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      };
      const handleChange = (event) => {
        setFiltros({ ...filtros, text: event.target.value })
        navigate("/Productos", {
            replace: true
          });
    };
    return (
        <>
            <header style={{ position: "fixed", top: 0, width: "100%", background: "#fff" }}>
                <Container fluid style={{ padding: "16px 10px 5px" }}>
                    <Row className="w-100 align-items-center g-0 gx-lg-3">
                        <Col xxl={9} lg={8}>
                            <div className="d-flex align-items-center justify-content-around">
                                <Navbar.Brand  as={Link}
                    to="/Inicio"  className="d-none d-lg-block">
                                    <h3>
                                        Market place <b style={{ color: '#F1C40F' }}>B</b><b style={{ color: 'rgb(32 92 152)' }}>A</b>
                                    </h3>
                                </Navbar.Brand>
                                <div style={{ maxWidth: '560px' }} className="w-100 ms-4 d-none d-lg-block">
                                    <Form action="#">
                                        <InputGroup>
                                            <Form.Control type="text" value={filtros.text} onChange={handleChange} placeholder="Buscador.." />
                                            <Button variant="outline-secondary" type="submit">
                                                <Search />
                                            </Button>
                                        </InputGroup>
                                    </Form>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between w-100 d-lg-none">
                                <Navbar.Brand as={Link}
                    to="/Inicio" >
                                    <h3 style={{ margin: 0 }}>Market place <b style={{ color: '#F1C40F' }}>B</b><b style={{ color: 'rgb(32 92 152)' }}>A</b></h3>
                                </Navbar.Brand>
                                <div className="d-flex align-items-center lh-1">
                                   
                                <div className="list-inline-item ">
                                    <Button variant="link" onClick={handleShowNoti} className="text-reset position-relative">
                                        <Bell />
                                        <Badge pill bg="success" className="position-absolute top-0 start-100 translate-middle">{numNoti}</Badge>
                                    </Button>
                                </div>
                                <div className="list-inline-item ">
                                    <Button variant="link" onClick={handleShowWishlist} className="text-reset position-relative">
                                        <Heart />
                                        <Badge pill bg="success" className="position-absolute top-0 start-100 translate-middle">{numGustos}</Badge>
                                    </Button>
                                </div>
                                <div className="list-inline-item ">
                                    <Button variant="link" className="text-reset position-relative" onClick={handleShowCart}>
                                        <ShoppingBag />
                                        <Badge pill bg="success" className="position-absolute top-0 start-100 translate-middle">{numArticulos}</Badge>
                                    </Button>
                                </div>
                                <div className="list-inline-item">
                                    {idU ? (
                                        <ProfileMenu reloadAll={reloadAll} />
                                    ) : (
                                        <Button variant="link" className="text-reset" onClick={handleShowUserModal}>
                                            <User />
                                        </Button>
                                    )}
                                </div>
                            </div>
                                </div>
                            
                        </Col>
                        <Col xxl={3} lg={4} className="d-flex align-items-center">
                            <div className="list-inline ms-auto d-lg-block d-none">
                                <div className="list-inline-item me-5">
                                    <Button variant="link" onClick={handleShowNoti} className="text-reset position-relative">
                                        <Bell />
                                        <Badge pill bg="success" className="position-absolute top-0 start-100 translate-middle">{numNoti}</Badge>
                                    </Button>
                                </div>
                                <div className="list-inline-item me-5">
                                    <Button variant="link" onClick={handleShowWishlist} className="text-reset position-relative">
                                        <Heart />
                                        <Badge pill bg="success" className="position-absolute top-0 start-100 translate-middle">{numGustos}</Badge>
                                    </Button>
                                </div>
                                <div className="list-inline-item me-5">
                                    <Button variant="link" className="text-reset position-relative" onClick={handleShowCart}>
                                        <ShoppingBag />
                                        <Badge pill bg="success" className="position-absolute top-0 start-100 translate-middle">{numArticulos}</Badge>
                                    </Button>
                                </div>
                                <div className="list-inline-item">
                                    {idU ? (
                                        <ProfileMenu reloadAll={reloadAll} />
                                    ) : (
                                        <Button variant="link" className="text-reset" onClick={handleShowUserModal}>
                                            <User />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </header>
            <UserModal show={showUserModal} handleClose={handleCloseUserModal} />
            <CartOffcanvas show={showCart} handleClose={handleCloseCart} elemntsCarrito={elemntsCarrito} idU={idU} ElementsCarrito={ElementsCarrito} NumElementsCarrito={NumElementsCarrito} />
            <WishlistOffcanvas show={showWishlist} handleClose={handleCloseWishlist} elemntsGustos={elemntsGustos} handleShowQuickViewModal={handleShowQuickViewModal} handleAddToCart={handleAddToCart}showAlert={showAlert} DeleteItemGustos={DeleteItemGustos} />
            <NotiOofcanvas show={showNoti} handleClose={handleCloseNoti} elemntsNoti={elemntsNoti} EliminarNotiFicacion={EliminarNotiFicacion} ComprarProductoNoti={ComprarProductoNoti} />
            
        </>
    );
};
