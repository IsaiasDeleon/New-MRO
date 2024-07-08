import React from 'react';
import { Offcanvas, Button, ListGroup, Alert } from 'react-bootstrap';
import { Trash2, ShoppingCart, Eye } from 'react-feather';

const WishlistOffcanvas = ({ show, handleClose, elemntsGustos, handleAddToCart, handleRemove,handleShowQuickViewModal,showAlert,DeleteItemGustos }) => (
    <Offcanvas show={show} onHide={handleClose} placement="end" className="d-flex flex-column">
        <Offcanvas.Header closeButton>
            <Offcanvas.Title className="mb-0 fs-4">Lista de deseos</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="flex-grow-1 d-flex flex-column">
            {showAlert && (
              <Alert variant="success" className="mb-4">
                Producto agregado al carrito
              </Alert>
            )}
            <div className="flex-grow-1 overflow-auto">
                <ListGroup variant="flush">
                    {elemntsGustos.map(item => (
                        <ListGroup.Item key={item.id} className="py-3 ps-0 border-top">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={`https://ba-mro.mx/Server/Images/${item.img ? item.img.split(',')[0] : 'Box.jpg'}`} alt={item.nombre} className="icon-shape icon-xxl me-3" />
                                    <div>
                                        <a href="#" onClick={() => handleShowQuickViewModal(item)} className="text-inherit">
                                            <h6 className="mb-0">{item.descripcion}</h6>
                                        </a>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    
                                   
                                    <Button variant="link" className="text-decoration-none text-inherit" onClick={() => handleShowQuickViewModal(item)}>
                                        <Eye className="text-secondary" />
                                    </Button>
                                    <Button variant="link" className="text-decoration-none text-inherit me-2" onClick={() => handleAddToCart(item.id)}>
                                        <ShoppingCart className="text-success" />
                                    </Button>
                                    <Button variant="link" className="text-decoration-none text-inherit me-2" onClick={() => DeleteItemGustos(item.id)}>
                                        <Trash2 className="text-danger" />
                                    </Button>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </Offcanvas.Body>
    </Offcanvas>
);

export default WishlistOffcanvas;
