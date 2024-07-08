import React from 'react';
import { Offcanvas, Button, ListGroup } from 'react-bootstrap';
import { Trash2, ShoppingCart, Eye } from 'react-feather';

const NotiOofcanvas = ({ show, handleClose, elemntsNoti,ComprarProductoNoti,EliminarNotiFicacion }) => (
    
    <Offcanvas show={show} onHide={handleClose} placement="end" className="d-flex flex-column">
        <Offcanvas.Header closeButton>
            <Offcanvas.Title className="mb-0 fs-4">Notificaciónes</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="flex-grow-1 d-flex flex-column">
            <div className="flex-grow-1 overflow-auto">
                <ListGroup variant="flush">
                    {elemntsNoti.map(item => (
                    
                        <ListGroup.Item key={item.id} className="py-3 ps-0 border-top">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={`https://ba-mro.mx/Server/Images/${item.img ? item.img.split(',')[0] : 'Box.jpg'}`} alt={item.nombre} className="icon-shape icon-xxl me-3" />
                                    <div>
                                        
                                    </div>
                                </div>
                                <div className="d-flex">
                                    
                                <div className=" ms-3" style={{ "width": "100%" }}>
                    <p className="text-secondary OpcionesFont"  style={{ "whiteSpace": "normal","margin":"0px" }} >El proveedor: <b className="text-dark OpcionesFont">BA-MRO</b>, realizo una contra oferta del producto: <b className="text-dark OpcionesFont">{item.descripcion}</b> </p>
                   
                       
                        <h6> Contra oferta: <b className="text-success">${item.ContraOferta}</b></h6>
                            {/* {
                                Oferta == 1 ? <h5> OFERTA: <b className="text-success">${montoOferta} </b></h5> : <></>
                            } */}
                      
                        <button className="btn btn-success ms-4" onClick={() => ComprarProductoNoti(item.id)}>Aceptar</button>  
                        <button className="btn btn-danger ms-4" onClick={() => EliminarNotiFicacion(item.id)}>Rechazar</button>    
                        {/* <i onClick={() => EliminarGusto(id)} className="bi bi-trash IconoBasura"></i> */}
                    
                </div>
                                 
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </Offcanvas.Body>
    </Offcanvas>
);

export default NotiOofcanvas;
