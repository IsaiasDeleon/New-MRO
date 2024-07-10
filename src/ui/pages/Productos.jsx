import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Pagination, Offcanvas, Badge, Modal, Table, Alert } from 'react-bootstrap';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { Feather, Heart, ShoppingCart, ArrowLeft, ArrowRight, CreditCard, File } from 'react-feather';
import { AuthContext } from '../../auth/AuthContext';
import { Noti } from '../components/Notificaciones';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';

const HTTP = axios.create({
  baseURL: "https://ba-mro.mx/Server/Data.php"
});

function valuetext(value) {
  return `${value}`;
}

// Función para capitalizar la primera letra
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Función para normalizar nombres eliminando acentos y obtener la primera palabra
const normalizeString = (string) => {
  const firstWord = string.split(' ')[0];
  return firstWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const Productos = ({ data = [], setData, NumElementsCarrito = [], dataFiltrado = [], setMenu, ElementsGustos, NumElementsGustos, setClickProducto, acomodoCars, setAcomodoCards, setFiltros, filtros, setIdCard2, handleCloseQuickViewModal, handleShowQuickViewModal, showQuickViewModal, selectedProduct, selectedImage, setSelectedImage, estado, setEstadoMenu, setValue, value, dataFiltradoSinCat,ElementsCarrito }) => {
  
  const [filtroCat, setFiltroCat] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [itemsOrder, setItemsOrder] = useState(9);
  
  const [estadoProducto, setEstadoProducto] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [idCard, setIdCard] = useState();
  const [notiCarrito, setNotiCarrito] = useState();
  const [activeNoti, setActiveNoti] = useState();
  const { user } = useContext(AuthContext);
  let idU = user?.id;
  const navigate = useNavigate();
  
  useEffect(()=> {
    setFiltros({ ...filtros, Order: itemsOrder});
  },[itemsOrder])
  const [showAlert, setShowAlert] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerValue, setOfferValue] = useState(0);
  const [textAlert, setTextAlert] = useState("");

  const handleAddToCart = (idProduct) => {
    setIdCard2(idProduct);
    setShowAlert(true);
    setTextAlert("Producto agregado al carrito");
    
    setTimeout(() => {
      setShowAlert(false);
      ElementsCarrito();
    }, 3000);
  };

  const handleAddToGustos = (idProduct) => {
    setIdCard(idProduct);
    setShowAlert(true);
    setTextAlert("Producto agregado a tu lista de deseo");
    setTimeout(() => {
      setShowAlert(false);
      ElementsGustos();
    }, 3000);
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

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, [setValue]);

  const handlePriceChangeCommitted = useCallback(() => {
    setFiltros({ ...filtros, value });
  }, [filtros, setFiltros, value]);

  const handleNameChange = useCallback((name) => {
    setSelectedName((prevName) => {
      const newName = prevName === name ? "" : name;
      setFiltros((prevFiltros) => ({ ...prevFiltros, Nombre: newName }));
      return newName;
    });
    setCurrentPage(1); // Reset page number when name changes
  }, [setFiltros]);

  const handleEstadoChange = (estado) => {
    if (estadoProducto === estado) {
      setEstadoProducto("");
      setFiltros({ ...filtros, Estado: 3});
    } else {
      setEstadoProducto(estado);
      setFiltros({ ...filtros, Estado: estado});
    }
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataFiltrado.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(dataFiltrado.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const pageItems = [];
    const totalPages = pageNumbers.length;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }
    } else {
      const siblings = 1;
      pageItems.push(
        <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      for (let i = Math.max(2, currentPage - siblings); i <= Math.min(totalPages - 1, currentPage + siblings); i++) {
        pageItems.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }
      pageItems.push(
        <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return pageItems;
  };

  const uniqueNames = Array.from(new Set(dataFiltradoSinCat.map(product => capitalizeFirstLetter(normalizeString(product.nombre))))).sort();

  useEffect(() => {
    setSelectedName("");
    setCurrentPage(1); // Reset page number when category changes
  }, [filtros.Catego]);

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
  const handleCategoriasClick = () => {
    setFiltros({
      Catego: "",
            text: "",
            value: [0, 20000],
            Oferta: 0,
            Estado: 3,
            Nombre: ""
    })
    setCurrentPage(1); // Reset page number when category is reset
  };

  return (
    <div className="contenedorIndex">
      <main>
      <div className="mt-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/Inicio">Inicio</Link>
                </li>
                <li className="breadcrumb-item">
                <span onClick={handleCategoriasClick} style={{ cursor: 'pointer', color: '#164A80'}}>
                    Categoria
                  </span>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {filtros.Catego !== ""? filtros.Catego: ""}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
        <Container className="mt-8 mb-lg-14 mb-8">
          <Row className="gx-10">
            <Col lg={3} md={4} className="mb-6 mb-md-0">
              <div className="offcanvas offcanvas-start offcanvas-collapse w-md-50" id="offcanvasCategory">
                <div className="offcanvas-header d-lg-none">
                  <h5 className="offcanvas-title">Filter</h5>
                  <Button variant="close" aria-label="Close" data-bs-dismiss="offcanvas"></Button>
                </div>
                <div className="offcanvas-body ps-lg-2 pt-lg-0">
                  <div className="mb-8">
                    <h5 className="mb-3">Nombre</h5>
                    <Form.Control type="search" placeholder="Buscar por nombre" className="mb-3" />
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {uniqueNames.map((name, index) => (
                        <Form.Check 
                          key={index} 
                          label={name} 
                          checked={selectedName === name} 
                          onChange={() => handleNameChange(name)} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h5 className="mb-3">Precio</h5>
                    <Stack spacing={2} direction="row" sx={{ mb: 1, mt: 4 }} alignItems="center">
                      <h6 className='text-primary text-slider'>$0</h6>
                      <Slider
                        value={value}
                        onChange={handleChange}
                        min={1}
                        max={17000}
                        valueLabelDisplay="on"
                        step={100}
                        getAriaValueText={valuetext}
                        color="primary"
                        onChangeCommitted={handlePriceChangeCommitted}
                      />
                      <h6 className='text-primary text-slider'>$20,000</h6>
                    </Stack>
                  </div>

                  <div className="mb-8">
                    <h5 className="mb-3">Estado del producto</h5>
                    <Form.Check 
                      label={<span>Nuevo</span>} 
                      checked={estadoProducto === 1} 
                      onChange={() => handleEstadoChange(1)}
                    />
                    <Form.Check 
                      label={<span>Usado</span>} 
                      checked={estadoProducto === 2} 
                      onChange={() => handleEstadoChange(2)}
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="start">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Filter</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <div className="mb-8">
                  <h5 className="mb-3">Nombre</h5>
                  <Form.Control type="search" placeholder="Buscar por nombre" className="mb-3" />
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {uniqueNames.map((name, index) => (
                      <Form.Check 
                        key={index} 
                        label={name} 
                        checked={selectedName === name} 
                        onChange={() => handleNameChange(name)} 
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h5 className="mb-3">Precio</h5>
                  <Stack spacing={2} direction="row" sx={{ mb: 1, mt: 4 }} alignItems="center">
                    <h6 className='text-primary text-slider'>$0</h6>
                    <Slider
                      value={value}
                      onChange={handleChange}
                      min={1}
                      max={17000}
                      valueLabelDisplay="on"
                      step={100}
                      getAriaValueText={valuetext}
                      color="primary"
                      onChangeCommitted={handlePriceChangeCommitted}
                    />
                    <h6 className='text-primary text-slider'>$20,000</h6>
                  </Stack>
                </div>

                <div className="mb-8">
                  <h5 className="mb-3">Estado del producto</h5>
                  <Form.Check 
                    label={<span>Nuevo</span>} 
                    checked={estadoProducto === "1"} 
                    onChange={() => handleEstadoChange("1")}
                  />
                  <Form.Check 
                    label={<span>Usado</span>} 
                    checked={estadoProducto === "2"} 
                    onChange={() => handleEstadoChange("2")}
                  />
                </div>
              </Offcanvas.Body>
            </Offcanvas>

            <Col lg={9} md={12}>
              <div className="d-lg-flex justify-content-between align-items-center">
                <p className="mb-0"><span className="text-dark">{dataFiltrado.length}</span> Productos encontrados</p>
                <div className="d-md-flex justify-content-between align-items-center">
                  <div className="ms-2 d-lg-none">
                    <Button variant="outline-secondary" onClick={handleShowOffcanvas}>
                      <Feather icon="filter" className="me-2" />
                      Filters
                    </Button>
                  </div>
                  <div className="d-flex mt-2 mt-lg-0">
                    <Form.Select className="me-2" onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                      <option value={9}>Mostrar: 9</option>
                      <option value={18}>Mostrar: 18</option>
                      <option value={27}>Mostrar: 27</option>
                    </Form.Select>
                    <Form.Select onChange={(e) => setItemsOrder(Number(e.target.value))}>
                      <option value={1}>Precio: menor a mayor</option>
                      <option value={2}>Precio: mayor a menor</option>
                      <option value={3}>Mas recientes</option>
                    </Form.Select>
                  </div>
                </div>
              </div>

              <Row className="g-3 row-cols-xl-3 row-cols-lg-2 row-cols-2 row-cols-md-2 mt-2">
                {currentItems.map(product => {
                  const imgSrc = product.img ? `https://ba-mro.mx/Server/Images/${product.img.split(',')[0]}` : 'https://ba-mro.mx/Server/Images/Box.jpg';
                  return (
                    <Col key={product.id}>
                      <div className="item">
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
                    </Col>
                  )
                })}
              </Row>

              <Row className="mt-8 justify-content-end">
                <Col xs="auto">
                  <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><ArrowLeft /></Pagination.Prev>
                    {renderPageNumbers()}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageNumbers.length}><ArrowRight /></Pagination.Next>
                  </Pagination>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </main>
      
      <Modal show={showQuickViewModal} onHide={handleCloseQuickViewModal} size="xl" centered>
        {selectedProduct  && (
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
                          <td><b onClick={handleCreatePDF} className="text-danger" style={{ textDecoration: "underline" }}>{selectedProduct.PDF}</b></td>
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
