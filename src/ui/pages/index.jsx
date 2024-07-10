import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Table, Alert, Form } from 'react-bootstrap';
import { Search, ShoppingCart, Heart, CreditCard, File, Bell } from 'react-feather';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router';
import { Noti } from '../components/Notificaciones';
import Footer from '../components/footer';

const HTTP = axios.create({
  baseURL: "https://ba-mro.mx/Server/Data.php"
});

export const Inicio = ({ data = [], setData,dataMasVendidos,dataNuevos, NumElementsCarrito = [], dataFiltrado = [], setMenu, ElementsGustos, NumElementsGustos, setClickProducto, acomodoCars, setAcomodoCards, setFiltros, filtros, setIdCard2,handleCloseQuickViewModal,handleShowQuickViewModal,showQuickViewModal,selectedProduct,selectedImage,setSelectedImage }) => {
  const [idCard, setIdCard] = useState();
  const [notiCarrito, setNotiCarrito] = useState();
  const [activeNoti, setActiveNoti] = useState();
  const { user } = useContext(AuthContext);
  let idU = user?.id;
  let tipoUser = user?.tipoUser;
  const navigate = useNavigate();
  
  const [showAlert, setShowAlert] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerValue, setOfferValue] = useState(0);
  const [textAlert, setTextAlert] = useState(0);
  const handleAddToCart = (idProduct) => {
    setIdCard2(idProduct);
    setShowAlert(true);
    setTextAlert("Producto agregado al carrito")
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleAddToGustos = (idProduct) => {
    setIdCard(idProduct);
    setShowAlert(true);
    setTextAlert("Producto agregado a tu lista de deseo")
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };



  const handleShowOfferModal = () => setShowOfferModal(true);
  const handleCloseOfferModal = () => setShowOfferModal(false);

  const handleOfferChange = (e) => {
    setOfferValue(e.target.value);
  };

  const handleCreateOffer = () => {
    fetch(`https://ba-mro.mx/Server/Correo.php?IP=${selectedProduct.id}&IU=${idU}&Oferta=${offerValue}`)
      .then(response => {
        setNotiCarrito("CorreoEnviado");
        setActiveNoti(true);
        setTimeout(() => {
          setActiveNoti(false);
        }, 4000);
      })
      .catch(error => {
        // Manejo de errores
      });
    handleCloseOfferModal();
  };

  const handleCreatePDF = () => {
    window.open(`https://ba-mro.mx/Server/PDF.php?IP=${selectedProduct.id}&IU=${idU}`, '_blank');
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    if (idCard !== undefined) {
      if (idU === undefined) {
        navigate("/Login", {
          replace: true
        });
        return;
      }
      HTTP.post("/gustos", { "idU": idU, "Num": idCard }).then((response) => {
        setNotiCarrito(response.data);
        setActiveNoti(true);
        setTimeout(() => {
          setActiveNoti(false);
        }, 4000);
        NumElementsGustos();
        ElementsGustos();
      });
    }
  }, [idCard]);

  useEffect(() => {
    HTTP.get("/read").then(respuesta => {
      const newStr = respuesta.data.slice(4);
      const obj = JSON.parse(newStr);
      setData(obj);
    });
    setMenu(1);
  }, []);

  useEffect(() => {
    localStorage.setItem('AcomodoCards', JSON.stringify(acomodoCars));
  }, [acomodoCars]);
  const handleDownload = (PDF) => {
     window.open(`https://ba-mro.mx/Server/PDF/${PDF}`, '_blank');
  }
  return (
    <div className="contenedorIndex" >
      <section className="mt-8">
        <Container>
          <Row>
            <Col>
              <div className="bg-light d-lg-flex justify-content-between align-items-center py-6 py-lg-3 px-8 text-center text-lg-start rounded">
                <div className="d-lg-flex align-items-center">
                  <img src="../assets/images/about/about-icons-1.svg" alt="" className="img-fluid" />
                  <div className="ms-lg-4">
                    <h1 className="fs-2 mb-1">Bienvenido a BA-MRO</h1>
                    <span>Descarga nuestra aplicación</span>
                  </div>
                </div>
                <div className="mt-3 mt-lg-0">
                  <Button variant="dark">Descargar MRO App</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col className="mt-6">
              <h3 className="mb-1">Productos más vendidos</h3>
            </Col>
          </Row>
          <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={3000} keyBoardControl={true} customTransition="all .5" transitionDuration={500}>
            {dataMasVendidos.slice(0, 10).map(product => {
                    const imgSrc = product.img ? `https://ba-mro.mx/Server/Images/${product.img.split(',')[0]}` : 'https://ba-mro.mx/Server/Images/Box.jpg';
                    return(
              <div key={product.id} className="item">
                <Card className="card-product m-2">
                  <Card.Body>
                    <a onClick={() => handleShowQuickViewModal(product)}>
                      <div className="text-center position-relative">
                        {product.montoOferta > 0 && <Badge bg="danger" className="position-absolute top-0 start-0">Sale</Badge>}
                        <Card.Img src={imgSrc} style={{ "width": "100%", "height": "200px", "objectFit": "cover" }} alt={product.nombre} className="mb-3 img-fluid" />
                      </div>
                      <div className="text-small mb-1">
                        <small>{product.Categoria}</small>
                      </div>
                      <h2 className="fs-6 description">
                        {product.descripcion}
                      </h2>
                      <div>
                        <small className="text-warning">
                          {Array.from({ length: 5 }, (_, index) => (
                            <i key={index} className={`bi bi-star${index < Math.floor(product.estrellas) ? '-fill' : index < product.estrellas ? '-half' : ''}`}></i>
                          ))}
                        </small>
                        <span className="text-muted small">{product.estrellas} ({product.Stock})</span>
                      </div>
                    </a>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className="text-dark">${product.monto}</span>
                        {product.montoOferta > 0 && <span className="text-decoration-line-through text-muted">${product.montoOferta}</span>}
                      </div>
                      <Button variant="primary" size="sm" onClick={() => handleAddToCart(product.id)}>
                        <ShoppingCart size={15}/> Carrito
                      </Button>
                      <Button variant="success" size="sm" onClick={() => handleAddToGustos(product.id)}>
                      <Heart size={15}/> Favoritos
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )})}
          </Carousel>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col className="mt-6">
              <h3 className="mb-1">Productos nuevos</h3>
            </Col>
          </Row>
          <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={3000} keyBoardControl={true} customTransition="all .5" transitionDuration={500}>
            {dataNuevos.slice(-10).map(product => {
                    const imgSrc = product.img ? `https://ba-mro.mx/Server/Images/${product.img.split(',')[0]}` : 'https://ba-mro.mx/Server/Images/Box.jpg';
                    return(
              <div key={product.id} className="item">
                <Card className="card-product m-2">
                  <Card.Body>
                    <a onClick={() => handleShowQuickViewModal(product)}>
                      <div className="text-center position-relative">
                        {product.montoOferta > 0 && <Badge bg="danger" className="position-absolute top-0 start-0">Sale</Badge>}
                        <Card.Img src={imgSrc} style={{ "width": "100%", "height": "200px", "objectFit": "cover" }} alt={product.nombre} className="mb-3 img-fluid" />
                      </div>
                      <div className="text-small mb-1">
                        <small>{product.Categoria}</small>
                      </div>
                      <h2 className="fs-6 description">
                        {product.descripcion}
                      </h2>
                      <div>
                        <small className="text-warning">
                          {Array.from({ length: 5 }, (_, index) => (
                            <i key={index} className={`bi bi-star${index < Math.floor(product.estrellas) ? '-fill' : index < product.estrellas ? '-half' : ''}`}></i>
                          ))}
                        </small>
                        <span className="text-muted small">{product.estrellas} ({product.Stock})</span>
                      </div>
                    </a>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className="text-dark">${product.monto}</span>
                        {product.montoOferta > 0 && <span className="text-decoration-line-through text-muted">${product.montoOferta}</span>}
                      </div>
                      <Button variant="primary" size="sm" onClick={() => handleAddToCart(product.id)}>
                        <ShoppingCart size={15}/> Carrito
                      </Button>
                      <Button variant="success" size="sm" onClick={() => handleAddToGustos(product.id)}>
                      <Heart size={15}/> Favoritos
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )})}
          </Carousel>
        </Container>
      </section>
      
      <Modal show={showQuickViewModal} onHide={handleCloseQuickViewModal} size="xl" centered>
        {selectedProduct && (
          <Modal.Body className="p-8">
            <Button variant="close" onClick={handleCloseQuickViewModal} aria-label="Close"></Button>
            
            <Row>
              <Col lg={6} className="d-flex flex-column align-items-center">
                <div className="product productModal">
                  <div className="zoom" style={{ backgroundImage: `url(https://ba-mro.mx/Server/Images/${selectedImage})` }}>
                    <img src={`https://ba-mro.mx/Server/Images/${selectedImage}`} alt="" style={{ width: '100%' }} />
                  </div>
                </div>
                {selectedProduct.img && (
                  <div style={{ display: "flex", flexDirection: "column", position: "absolute", zIndex: "1", left: "60px" }}>
                    {selectedProduct.img.split(',').map((imgSrc, index) => (
                      <img key={index} src={`https://ba-mro.mx/Server/Images/${imgSrc}`} onClick={() => setSelectedImage(imgSrc)} alt="IMGCompra" className={`m-1 imagenesProductos ${selectedImage === imgSrc ? "BorderImagenSelect" : ""}`} />
                    ))}
                  </div>
                )}
              </Col>
              <Col lg={6}>
                
                <div className="ps-lg-8 mt-6 mt-lg-0">
                  <h4 className="mb-1 h3">{selectedProduct.descripcion}</h4>
                  <div className="mb-4">
                    <small className="text-warning">
                      {Array.from({ length: 5 }, (_, index) => (
                        <i key={index} className={`bi bi-star${index < Math.floor(selectedProduct.estrellas) ? '-fill' : index < selectedProduct.estrellas ? '-half' : ''}`}></i>
                      ))}
                    </small>
                    <span className="ms-2">({selectedProduct.Stock} en stock)</span>
                  </div>
                  <div className="fs-4">
                    <span className="fw-bold text-dark">${selectedProduct.monto}</span>
                    {selectedProduct.montoOferta > 0 && <span className="text-decoration-line-through text-muted">${selectedProduct.montoOferta}</span>}
                  </div>
                  <hr className="my-6" />
                  <div>
                  {showAlert && (
              <Alert variant="success" className="mb-4">
                {textAlert}
              </Alert>
            )}
                    <Table borderless className="table-compact">
                      <tbody>
                        <tr>
                          <td>Marca/Fabricante:</td>
                          <td>{selectedProduct.Marca}</td>
                        </tr>
                        <tr>
                          <td>Código del proveedor (SKU/ID):</td>
                          <td>{selectedProduct.CodigoProveedor}</td>
                        </tr>
                        <tr>
                          <td>Peso aproximado:</td>
                          <td>{selectedProduct.Peso}</td>
                        </tr>
                        <tr>
                          <td>Estado:</td>
                          <td>{selectedProduct.Estado === "1" ? "Nuevo" : "Semi-nuevo"}</td>
                        </tr>
                        <tr>
                          <td>Estatus:</td>
                          <td>{selectedProduct.Estatus === "1" ? "Disponible" : "No disponible"}</td>
                        </tr>
                        <tr>
                          <td>Tiempo de entrega:</td>
                          <td>{selectedProduct.TempodeEntrega}</td>
                        </tr>
                        <tr>
                          <td>Tiempo de entrega en caso de agotarse:</td>
                          <td>{selectedProduct.TempoDdeEntregaAgotado}</td>
                        </tr>
                        <tr>
                          <td>Ficha técnica:</td>
                          <td><b onClick={handleDownload} className="text-danger" style={{ textDecoration: "underline" }}>{selectedProduct.PDF}</b></td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <div className="mt-3">
                    <Row className="g-2">
                      <Col xs={6}>
                        <Button variant="primary" className="w-100" onClick={() => handleAddToCart(selectedProduct.id)}> <ShoppingCart size={20}/> Carrito</Button>
                      </Col>
                      <Col xs={6}>
                        <Button variant="success" className="w-100" onClick={() => handleAddToGustos(selectedProduct.id)}> <Heart size={20}/> Favorito</Button>
                      </Col>
                    </Row>
                    <Row className="g-2 mt-2">
                      <Col xs={6}>
                        <Button variant="dark" className="w-100" onClick={handleShowOfferModal}><CreditCard size={20}/> Hacer oferta</Button>
                      </Col>
                      <Col xs={6}>
                        <Button variant="secondary" className="w-100" onClick={handleCreatePDF}><File size={20}/> Cotizar</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        )}
      </Modal>
      <Modal show={showOfferModal} onHide={handleCloseOfferModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ofertar por el producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="offerValue">
              <Form.Label>Oferta:</Form.Label>
              <Form.Control
                type="number"
                name="Oferta"
                value={offerValue}
                onChange={handleOfferChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOfferModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateOffer}>
            Ofertar
          </Button>
        </Modal.Footer>
      </Modal>
      <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
      <Footer/>
    </div>
    
  );
};
