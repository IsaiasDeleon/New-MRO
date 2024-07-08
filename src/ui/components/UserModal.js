import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Noti } from '../components/Notificaciones';
import { gapi } from 'gapi-script';
import LoginB from './LoginB';

const CryptoJS = require("crypto-js");

const HTTP = axios.create({
    //baseURL: "https://ba-mro.mx/Server/Data.php"
    baseURL: "http://localhost/Server/Data.php"
});

const clientId = "834174042599-ok7fjvug6opngk4devckt6kgcrc3iclf.apps.googleusercontent.com";

const UserModal = ({ show, handleClose }) => {
    const { Log } = useContext(AuthContext);
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [pass, setPass] = useState("");
    const [regist, setRegist] = useState(false);
    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();
    const [isSignUp, setIsSignUp] = useState(false);

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'Correo':
                setCorreo(value);
                break;
            case 'Contrasena':
                setPass(value);
                break;
            case 'Nombre':
                setNombre(value);
                break;
        }
    }

    const onLogin = (e) => {
        e.preventDefault();
        if (correo === "") {
            setNotiCarrito("CorreoVacio");
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 5000);
            return;
        }
        if (pass === "") {
            setNotiCarrito("PassVacio");
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 5000);
            return;
        }
        const password = pass;
        HTTP.post("/Login", { "user": correo, "pass": password }).then((response) => {
            if (response.data) {
                const lastPath = localStorage.getItem('lastPath') || '/';
                let data = response.data;
                Log(data.Nombre, data.id, data.img, data.tipoUser, 0,true,data.Empresa);
                navigate(lastPath, {
                    replace: true
                });
                handleClose();
            } else {
                setNotiCarrito("UsuarioIncorrecto");
                setActiveNoti(true);
                setTimeout(() => {
                    setActiveNoti(false);
                }, 5000);
            }
        });
    }

    const onRegister = (e) => {
        e.preventDefault();
        if (nombre === "") {
            setNotiCarrito("NombreVacio");
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 5000);
            return;
        }
        if (correo === "") {
            setNotiCarrito("CorreoVacio");
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 5000);
            return;
        }
        if (pass === "") {
            setNotiCarrito("PassVacio");
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 5000);
            return;
        }
        HTTP.post("/Registrar", { "nombre": nombre, "correo": correo, "pass": pass }).then((response) => {
            setNotiCarrito(response.data);
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 5000);
        });
    }

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            });
        }
        gapi.load('client:auth2', start);
    }, []);

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fs-3 fw-bold">
                    ¡Bienvenido!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {isSignUp ? (
                        <>
                            <Form.Group className="mb-3" controlId="Nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" name="Nombre" value={nombre} placeholder="Introduce tu nombre" onChange={onInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="Correo">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control type="email" name="Correo" value={correo} placeholder="Introduce tu correo electrónico" onChange={onInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-5" controlId="Contrasena">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" name="Contrasena" value={pass} placeholder="Introduce tu contraseña" onChange={onInputChange} required />
                            </Form.Group>
                            <Button onClick={(e) => onRegister(e)} className="btn btn-primary">Registrarse</Button>
                        </>
                    ) : (
                        <>
                            <Form.Group className="mb-3" controlId="Correo">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control type="email" name="Correo" value={correo} placeholder="Introduce tu correo electrónico" onChange={onInputChange} required />
                            </Form.Group>
                            <Form.Group className="mb-5" controlId="Contrasena">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" name="Contrasena" value={pass} placeholder="Introduce tu contraseña" onChange={onInputChange} required />
                            </Form.Group>
                            <div className="d-flex justify-content-between">
                                <LoginB />
                                <Button onClick={(e) => onLogin(e)} className="btn btn-primary">Iniciar sesión</Button>
                            </div>
                        </>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-center">
                {isSignUp ? (
                    <>
                        ¿Ya tienes una cuenta? <Button variant="link" onClick={toggleForm}>Iniciar sesión</Button>
                    </>
                ) : (
                    <>
                        ¿No tienes cuenta aún? <Button variant="link" onClick={toggleForm}>Registrarse</Button>
                    </>
                )}
            </Modal.Footer>
           
            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
        </Modal>
    );
};

export default UserModal;
