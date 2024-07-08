import React, { useContext, useState } from 'react';
import { Row, Col, InputGroup, Form, Button, ListGroup } from 'react-bootstrap';
import { Trash2 } from 'react-feather';
import axios from "axios";
import { AuthContext } from '../../auth/AuthContext';

const HTTP = axios.create({
    //baseURL: "https://ba-mro.mx/Server/Data.php"
    baseURL: "http://localhost/Server/Data.php"
})
const CartItem = ({ item, onQuantityChange,NumElementsCarrito,ElementsCarrito }) => {
    const { user } = useContext(AuthContext);
    let idU = user?.id;
    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();
    const handleIncrement = () => {
        onQuantityChange(item.id, item.quantity + 1);
    };

    const handleDecrement = () => {
        onQuantityChange(item.id, Math.max(item.quantity - 1, 1));
    };

    const handleChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        onQuantityChange(item.id, value);
    };
    function DeletItem(id) {
        if (idU !== undefined) {
            HTTP.post("/deleteItem", { "idU": idU, "id": id }).then((response) => {
                //Si la operacion se hizo correctamente nos regresara Eliminado
                if (response.data === "Eliminado") {
                    //Mandamos a llamar a la funcion de getItemCarrito para obtener la actualizacion de los elementos 
                    ElementsCarrito()
                    //Llamamos a la funcion NumELementsCarrito para obtener ka actualizacion de los elementos en el carrito
                    NumElementsCarrito()
                    //Enviamos el mensaje a las notificaciones para mostrar la alerta al usuario
                    setNotiCarrito(response.data)
                    setActiveNoti(true)
                    setTimeout(() => {
                        setActiveNoti(false)
                    }, 4000);
                   
                }
            })

        }
    }

    return (
        <ListGroup.Item className="py-3 ps-0 border-top">
            <Row className="align-items-center">
                <Col xs={6} md={5} lg={6}>
                    <div className="d-flex">
                        <img src={`https://ba-mro.mx/Server/Images/${item.img ? item.img.split(',')[0] : 'Box.jpg'}`} alt={item.nombre} className="icon-shape icon-xxl" />
                        <div className="ms-3">
                            <a href="../pages/shop-single.html" className="text-inherit">
                                <h6 className="mb-0">{item.descripcion}</h6>
                            </a>
                            <div className="mt-2 small lh-1">
                                <Button onClick={()=>{DeletItem(item.id)}} variant="link" className="text-decoration-none text-inherit">
                                    <Trash2 className="text-success" />
                                    <span className="text-muted">Eliminar</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={4} md={4} lg={4}>
                    <InputGroup className="input-spinner">
                        <Button variant="outline-secondary" onClick={handleDecrement}>-</Button>
                        <Form.Control type="number" step="1" max="10" readOnly value={item.quantity} onChange={handleChange} />
                        <Button variant="outline-secondary" onClick={handleIncrement}>+</Button>
                    </InputGroup>
                </Col>
                <Col xs={2} className="text-lg-end text-start text-md-end col-md-2">
                    <span className="fw-bold">${item.monto}</span>
                </Col>
            </Row>
        </ListGroup.Item>
    );
};

export default CartItem;
