import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, ListGroup } from 'react-bootstrap';
import CartItem from './CartItem';

const CartOffcanvas = ({ show, handleClose, elemntsCarrito, idU, NumElementsCarrito,ElementsCarrito }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Inicializa las cantidades de los productos en el carrito
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
    

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" className="d-flex flex-column">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className="mb-0 fs-4">Carrito de compras</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="flex-grow-1 d-flex flex-column">
                <div className="flex-grow-1 overflow-auto">
                    <ListGroup variant="flush">
                        {cartItems.map(item => (
                            <CartItem NumElementsCarrito={NumElementsCarrito} ElementsCarrito={ElementsCarrito}key={item.id} item={item} onQuantityChange={handleQuantityChange} />
                        ))}
                    </ListGroup>
                </div>
                <div className="bg-white p-3 border-top" style={{ position: 'sticky', bottom: 0 }}>
                    <div className="d-flex justify-content-between mb-3">
                        <span>Total de productos: {totalProductos}</span>
                        <span>Total: ${totalGlobal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <Button variant="primary" onClick={Cotizar}>Cotizar</Button>
                        <Button variant="dark">Comprar</Button>
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CartOffcanvas;
