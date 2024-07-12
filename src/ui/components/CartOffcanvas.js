import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, ListGroup } from 'react-bootstrap';
import CartItem from './CartItem';
import { useNavigate } from 'react-router';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

const HTTP = axios.create({
    baseURL: "https://ba-mro.mx/Server/Data.php"
});

const CartOffcanvas = ({ show, handleClose, elemntsCarrito, idU, NumElementsCarrito, ElementsCarrito, handleShowQuickViewModal }) => {
    const [cartItems, setCartItems] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [Telefono, setTelefono] = useState("1");
    const [direccion, setDireccion] = useState("");
    const [CP, setCP] = useState("");
    const [estado, setEstado] = useState(1);
    const [municipio, setMunicipio] = useState(1);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [OtraUbiCheck, setOtraUbiCheck] = useState(true);
    const [direccion2, setDireccion2] = useState("");
    const [CP2, setCP2] = useState("");
    const [estado2, setEstado2] = useState(1);
    const [municipio2, setMunicipio2] = useState(1);

    const getD = async () => {
        let respuesta = await HTTP.post("/getDatosGenerales2", { "IdUsuario": idU }).then((response) => {
            return response?.data[0];
        });
        let respuesta2 = await HTTP.post("/getDatosGenerales2Facturacion", { "IdUsuario": idU }).then((response) => {
            return response?.data[0];
        });
        if (respuesta2 !== undefined) {
            setDireccion2(respuesta2.Direccion2);
            setCP2(respuesta2.CP2);
            setEstado2(respuesta2.estado);
            setMunicipio2(respuesta2.municipio);
        }
        if (respuesta !== undefined) {
            setTelefono(respuesta.telefono);
            setDireccion(respuesta.Direccion);
            setCP(respuesta.CP);
            setEstado(respuesta.estado);
            setMunicipio(respuesta.municipio);
            setLatitude(respuesta.latitude);
            setLongitude(respuesta.longitude);
        }
    };

    useEffect(() => {
        getD();
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        const itemsWithQuantities = elemntsCarrito.map(item => ({
            ...item,
            quantity: 1,
        }));
        setCartItems(itemsWithQuantities);
    }, [elemntsCarrito]);

    const handleQuantityChange = (itemId, quantity) => {
        const updatedItems = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(updatedItems);
    };

    const totalProductos = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalGlobal = cartItems.reduce((total, item) => total + (item.monto * item.quantity), 0);

    const Cotizar = () => {
        let ids = cartItems.map(item => item.id);
        let cantidadByProducto = cartItems.map(item => item.quantity);

        if (idU !== undefined) {
            window.open(`https://ba-mro.mx/Server/Script.php?IP=${ids}&IU=${idU}&cantidades=${cantidadByProducto.toString()}`, '_blank');
        }
    };

    const EditarPerfil = () => {
        closeModal();
        navigate('/Perfil', { replace: true });
    };

    const handleCheckboxChange = () => {
        setOtraUbiCheck(!OtraUbiCheck);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const Comprar = () => {
        closeModal();
        let ids = [];
        let cantidadByProducto = [];
        ElementsCarrito.map((element) => {
            ids.push(element.id);
            let elements = document.getElementById(`VItem${element.id}`).value;
            cantidadByProducto.push(elements);
        });

        if (idU !== undefined) {
            window.open(`https://ba-mro.mx/Server/CorreoComprasCarrito.php?IP=${ids}&IU=${idU}&cantidades=${cantidadByProducto.toString()}&Telefono=${Telefono}&direccion=${direccion}&CP=${CP}&estado=${estado}&municipio=${municipio}&latitude=${latitude}&longitude=${longitude}`, '_blank');
        }
    };

    return (
        <>
            <Offcanvas show={show} onHide={handleClose} placement="end" className="d-flex flex-column">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="mb-0 fs-4">Carrito de compras</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="flex-grow-1 d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto">
                        <ListGroup variant="flush">
                            {cartItems.map(item => (
                                <CartItem
                                    NumElementsCarrito={NumElementsCarrito}
                                    ElementsCarrito={ElementsCarrito}
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={handleQuantityChange}
                                    handleShowQuickViewModal={handleShowQuickViewModal}
                                />
                            ))}
                        </ListGroup>
                    </div>
                    <div className="bg-white p-3 border-top" style={{ position: 'sticky', bottom: 0 }}>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Total de productos: {totalProductos}</span>
                            <span>Total: ${totalGlobal.toFixed(3)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <Button variant="primary" onClick={Cotizar}>Cotizar</Button>
                            <Button variant="dark" onClick={() => setModalOpen(true)}>Comprar</Button>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
            {modalOpen && (
                <div className="modal" style={{ display: "block" }} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Compras</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-info" role="alert">
                                    Realice el pago de <b>${totalGlobal.toFixed(3)}</b> a través de PayPal. Se le enviará un correo con todos los datos de sus productos y proveedores, Gracias por su compra.
                                </div>
                                {direccion ? (
                                    <>
                                        <div className="alert alert-primary" role="alert" onClick={EditarPerfil}>
                                            Si quiere actualizar sus datos antes de comprar presione <b style={{ textDecoration: "underline red", cursor: "pointer" }}>aquí</b>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div style={{ flex: '1', padding: '10px' }}>
                                                <h5 className='TitulosMenu'>País:</h5>
                                                <h6 className="text-secondary OpcionesFont">México</h6>
                                            </div>
                                            <div style={{ flex: '1', padding: '10px' }}>
                                                <h5 className='TitulosMenu'>Estado:</h5>
                                                <h6 className="text-secondary OpcionesFont">{estado}</h6>
                                            </div>
                                            <div style={{ flex: '1', padding: '10px' }}>
                                                <h5 className='TitulosMenu'>Municipio:</h5>
                                                <h6 className="text-secondary OpcionesFont">{municipio}</h6>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div style={{ flex: '2', padding: '10px' }}>
                                                <h5 className='TitulosMenu'>Dirección:</h5>
                                                <h6 className="text-secondary OpcionesFont">{direccion}</h6>
                                            </div>
                                            <div style={{ flex: '1', padding: '10px' }}>
                                                <h5 className='TitulosMenu'>Código postal:</h5>
                                                <h6 className="text-secondary OpcionesFont">{CP}</h6>
                                            </div>
                                            <div style={{ flex: '1', padding: '10px' }}>
                                                <h5 className='TitulosMenu'>Teléfono:</h5>
                                                <h6 className="text-secondary OpcionesFont">{Telefono}</h6>
                                            </div>
                                        </div>
                                        <div className="form-check text-center">
                                            <input style={{ float: "revert" }} onClick={handleCheckboxChange} id="defaultCheck1" className="form-check-input" type="checkbox" checked={OtraUbiCheck} />
                                            <label onClick={handleCheckboxChange} className="form-check-label datosPerfil h6">
                                                La dirección de envío es igual a la de facturación
                                            </label>
                                        </div>
                                        {!OtraUbiCheck && (
                                            direccion2 ? (
                                                <>
                                                    <div className="alert alert-primary text-center" role="alert">
                                                        Ubicación de facturación
                                                    </div>
                                                    <div className="selectoresPerfil">
                                                        <div style={{ flex: '1', padding: '10px' }}>
                                                            <h5 className='TitulosMenu'>País:</h5>
                                                            <h6 className="text-secondary OpcionesFont">México</h6>
                                                        </div>
                                                        <div style={{ flex: '1', padding: '10px' }}>
                                                            <h5 className='TitulosMenu'>Estado:</h5>
                                                            <h6 className="text-secondary OpcionesFont">{estado2}</h6>
                                                        </div>
                                                        <div style={{ flex: '1', padding: '10px' }}>
                                                            <h5 className='TitulosMenu'>Municipio:</h5>
                                                            <h6 className="text-secondary OpcionesFont">{municipio2}</h6>
                                                        </div>
                                                    </div>
                                                    <div className="formularioPerfil">
                                                        <div style={{ flex: '2', padding: '10px' }}>
                                                            <h5 className='TitulosMenu'>Dirección:</h5>
                                                            <h6 className="text-secondary OpcionesFont">{direccion2}</h6>
                                                        </div>
                                                        <div style={{ flex: '1', padding: '10px' }}>
                                                            <h5 className='TitulosMenu'>Código postal:</h5>
                                                            <h6 className="text-secondary OpcionesFont">{CP2}</h6>
                                                        </div>
                                                    </div>
                                                    
                                                </>
                                            ) : (
                                                <div className="alert alert-danger text-center" role="alert" onClick={EditarPerfil}>
                                                    La ubicación de facturación no ha sido ingresada, favor de ir a su <b style={{ textDecoration: "underline red", cursor: "pointer" }}>perfil</b> e ingresarla.
                                                </div>
                                            )
                                            
                                        )}
                                    </>
                                ) : (
                                    <div className="alert alert-danger" role="alert" onClick={EditarPerfil}>
                                        Sus datos no han sido proporcionados, le sugerimos que vaya a su <b style={{ textDecoration: "underline red", cursor: "pointer" }}>perfil</b> y los ingrese.
                                    </div>
                                )}
<PayPalScriptProvider options={{ "client-id": "AUQ-HLaYkpifs1IJdRKZDY5ueRm0aVYUR_BomYGfeGOH2t7GWAUYJcsIAPvwYVth4C8gluhxu3A2ZctG" }}>
                                                        <PayPalButtons
                                                            style={{ layout: 'vertical' }}
                                                            createOrder={(data, actions) => {
                                                                return actions.order.create({
                                                                    purchase_units: [{
                                                                        amount: {
                                                                            // value: totalGlobal.toFixed(2),
                                                                            value: 0.1,
                                                                        },
                                                                    }],
                                                                });
                                                            }}
                                                            onApprove={(data, actions) => {
                                                                return actions.order.capture().then((details) => {
                                                                    alert('Transaction completed by ' + details.payer.name.given_name);
                                                                    Comprar(); // Call your purchase function here
                                                                });
                                                            }}
                                                        />
                                                    </PayPalScriptProvider>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartOffcanvas;
