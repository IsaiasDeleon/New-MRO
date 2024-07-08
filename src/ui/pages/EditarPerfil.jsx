import { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext';
import { useFetchData } from '../../hooks/useFetchData';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Noti } from '../components/Notificaciones';
import Footer from '../components/footer';

const HTTP = axios.create({
    baseURL: "http://localhost/Server/Data.php"
});

export const EditarPerfil = ({ numArticulos, setMenu }) => {
    const { user } = useContext(AuthContext);
    const idU = user?.id;
    let img = user?.google === 1 ? user?.img : (user?.img ? `https://ba-mro.mx/Server/ImagesUser/${user.img}` : `https://ba-mro.mx/Server/Images/Ge.jpg`);
    const fileInputRef = useRef();
    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();
    const [otraUbiCheck, setOtraUbiCheck] = useState(true);
    const {
        nombre, setNombre, telefono, setTelefono, pass, setPass, direccion, setDireccion,
        cp, setCP, correo, google, pais, estado, setEstado, municipio, setMunicipio,
        latitude, longitude, direccion2, setDireccion2, cp2, setCP2, estado2, setEstado2,
        municipio2, setMunicipio2, compras, elementsCarrito
    } = useFetchData(idU);

    const [valuesEstado, setValueEstado] = useState([]);
    const [valueMunicipio, setValueMunicipio] = useState([]);
    const [nameEstado, setNameEstado] = useState("");
    const [nameMunicipio, setNameMunicipio] = useState([]);
    const [valuesEstado2, setValueEstado2] = useState([]);
    const [valueMunicipio2, setValueMunicipio2] = useState([]);
    const [nameEstado2, setNameEstado2] = useState("");
    const [nameMunicipio2, setNameMunicipio2] = useState("");

    useEffect(() => {
       
        getEstados();
        getMunicipios(estado, setValueMunicipio, setNameEstado);
        getMunicipios(estado2, setValueMunicipio2, setNameEstado2);
    }, [idU, estado, estado2]);

    const getEstados = () => {
        HTTP.post("/getEstado", { "N": "2" }).then((response) => {
            setValueEstado(response.data);
            setValueEstado2(response.data);
        });
    };

    const getMunicipios = (estado, setMunicipios, setNameEstado) => {
        HTTP.post("/getMunicipio", { "Estado": estado }).then((response) => {
            setMunicipios(response.data);
            HTTP.post("/getNameEstado", { "idEstado": estado }).then((response) => {
                setNameEstado(response.data[0].estado);
            });
        });
    };

    const handleInputChange = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'Nombre':
                setNombre(value);
                break;
            case 'Telefono':
                setTelefono(value);
                break;
            case 'Password':
                setPass(value);
                break;
            case 'Direccion':
                setDireccion(value);
                break;
            case 'CP':
                setCP(value);
                break;
            case 'Direccion2':
                setDireccion2(value);
                break;
            case 'CP2':
                setCP2(value);
                break;
            case 'Estado':
                setEstado(value);
                break;
            case 'Estado2':
                setEstado2(value);
                break;
            case 'Municipio':
                setMunicipio(value);
                break;
            case 'Municipio2':
                setMunicipio2(value);
                break;
            default:
                break;
        }
    };

    const handleCheckboxChange = () => {
        setOtraUbiCheck(!otraUbiCheck);
    };

    const SaveDetailsUser = () => {
        if (nombre === "" || telefono === "" || pass === "" || direccion === "" || cp === "") {
            message("Complete todos los campos requeridos");
            return;
        }
        const datos = {
            idU, Nombre: nombre, Telefono: telefono, Password: pass, Direccion: direccion, CP: cp, Estado: estado, Municipio: municipio,
            OtraUbiCheck: otraUbiCheck ? 1 : 0, Direccion2: otraUbiCheck ? "" : direccion2, CP2: otraUbiCheck ? "" : cp2, Estado2: otraUbiCheck ? 1 : estado2, Municipio2: otraUbiCheck ? 1 : municipio2
        };
        HTTP.post("/SaveDetailsUser", datos).then((response) => {
            if (response.data === "Actualizado") {
                setNotiCarrito(response.data);
                setActiveNoti(true);
                setTimeout(() => {
                    setActiveNoti(false);
                }, 4000);
            }
        });
    };

    const togglePasswordVisibility = () => {
        const passwordField = document.getElementById("passwordField");
        const toggleButton = document.getElementById("toggleButton");

        if (passwordField.type === "password") {
            passwordField.type = "text";
            toggleButton.innerText = "Ocultar contraseña";
        } else {
            passwordField.type = "password";
            toggleButton.innerText = "Mostrar contraseña";
        }
    };

    const inputChange = () => {
        const files = fileInputRef.current.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.set('file', file);
            HTTP.post("/ImagesUser", formData).then((response) => {
                HTTP.post("/UpdateImagesUser", { "NameImg": response.data, "idU": idU }).then((response) => {
                    setNotiCarrito(response.data);
                    setActiveNoti(true);
                    setTimeout(() => {
                        setActiveNoti(false);
                    }, 5000);
                });
            });
        }
    };

    const openFileInput = () => {
        fileInputRef.current.click();
    };

    const inputDivChange = (e) => {
        const files = e.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.set('file', file);
            HTTP.post("/ImagesUser", formData).then((response) => {
                HTTP.post("/UpdateImagesUser", { "NameImg": response.data, "idU": idU }).then((response) => {
                    setNotiCarrito(response.data);
                    setActiveNoti(true);
                    setTimeout(() => {
                        setActiveNoti(false);
                    }, 5000);
                });
            });
        }
    };

    const UbicaionMessage = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                if (latitude && longitude) {
                    HTTP.post("/saveUbicacion", { "idU": idU, "latitude": latitude, "longitude": longitude }).then((response) => {
                        if (response.data === "Guardada") {
                            setNotiCarrito(response.data);
                            setActiveNoti(true);
                            setTimeout(() => {
                                setActiveNoti(false);
                            }, 4000);
                        }
                    });
                }
            },
            (error) => {
                setNotiCarrito("UbicacionError");
                setActiveNoti(true);
                setTimeout(() => {
                    setActiveNoti(false);
                }, 7000);
            }, {
                maximumAge: 0,
                timeout: 5000,
                enableHighAccuracy: true
            }
        );
    };

    const Mapa = () => {
        window.open(`https://maps.google.com/maps?q=${latitude},${longitude}`, '_blank');
    };

    const message = (mess) => {
        setNotiCarrito(`${mess}`);
        setActiveNoti(true);
        setTimeout(() => {
            setActiveNoti(false);
        }, 5000);
    };

    return (
        <main className="contenedorIndex">
        <Container className="mb-8 mt-4">
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body className="text-center">
                            <img src={img} className="rounded-circle mb-3" alt="User" style={{ width: '150px' }} />
                            <h4 className="mb-0">{nombre}</h4>
                            <p className="text-muted">{correo}</p>
                            <div className="d-flex justify-content-center mb-2">
                                <Button variant="dark" onClick={openFileInput}>Actualizar Foto</Button>
                                <input ref={fileInputRef} onChange={inputChange} id="Images" name="Images" type="file" className="file" accept="image/jpeg, image/png, image/jpg" style={{ display: 'none' }} />
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="mb-4">
                        <Card.Body>
                            <h5>Información General</h5>
                            <ul className="list-unstyled">
                                <li className="mb-3">
                                    <strong>Teléfono:</strong> {telefono}
                                </li>
                                <li className="mb-3">
                                    <strong>País:</strong> {pais}
                                </li>
                                <li className="mb-3">
                                    <strong>Estado:</strong> {nameEstado}
                                </li>
                                <li className="mb-3">
                                    <strong>Municipio:</strong> {nameMunicipio}
                                </li>
                                <li className="mb-3">
                                    <strong>Dirección:</strong> {direccion}
                                </li>
                                <li className="mb-3">
                                    <strong>CP:</strong> {cp}
                                </li>
                                {latitude && (
                                    <li className="mb-3 text-end">
                                        <Button variant="dark" onClick={Mapa}>Ver Mapa</Button>
                                    </li>
                                )}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <h5>Editar Perfil</h5>
                            <Form>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nombre"
                                                name="Nombre"
                                                value={nombre}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Teléfono</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Teléfono"
                                                name="Telefono"
                                                value={telefono}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {google === 0 && (
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Contraseña</Form.Label>
                                                <div className="input-group">
                                                    <Form.Control
                                                        type="password"
                                                        id="passwordField"
                                                        placeholder="Contraseña"
                                                        name="Password"
                                                        value={pass}
                                                        onChange={handleInputChange}
                                                    />
                                                    <Button variant="outline-secondary" id="toggleButton" onClick={togglePasswordVisibility}>Mostrar</Button>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>País</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="Pais"
                                                value={pais}
                                                disabled
                                            >
                                                <option value="México">México</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Estado</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="Estado"
                                                value={estado}
                                                onChange={handleInputChange}
                                            >
                                                {valuesEstado.map((val) => (
                                                    <option key={val.id} value={val.id}>{val.estado}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Municipio</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name='Municipio'
                                                value={municipio}
                                                onChange={handleInputChange}
                                            >
                                                {valueMunicipio.map((val) => (
                                                    <option key={val.id} value={val.id}>{val.municipio}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Dirección</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Dirección"
                                                name='Direccion'
                                                value={direccion}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Código Postal</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="CP"
                                                name='CP'
                                                value={cp}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3 form-check">
                                    <Form.Check.Input
                                        type="checkbox"
                                        id="defaultCheck1"
                                        checked={otraUbiCheck}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check.Label htmlFor="defaultCheck1">
                                        La dirección de envío es igual a la de facturación
                                    </Form.Check.Label>
                                </Form.Group>
                                {!otraUbiCheck && (
                                    <>
                                        <Alert variant="primary" className="text-center">
                                            Ubicación de Facturación
                                        </Alert>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Estado</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name="Estado2"
                                                        value={estado2}
                                                        onChange={handleInputChange}
                                                    >
                                                        {valuesEstado2.map((val) => (
                                                            <option key={val.id} value={val.id}>{val.estado}</option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Municipio</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        name='Municipio2'
                                                        value={municipio2}
                                                        onChange={handleInputChange}
                                                    >
                                                        {valueMunicipio2.map((val) => (
                                                            <option key={val.id} value={val.id}>{val.municipio}</option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Dirección</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Dirección"
                                                        name='Direccion2'
                                                        value={direccion2}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Código Postal</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="CP"
                                                        name='CP2'
                                                        value={cp2}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                                <div className="d-flex justify-content-between">
                                    <Button variant="secondary" onClick={UbicaionMessage}>Guardar ubicación por GPS</Button>
                                    <Button variant="success" onClick={SaveDetailsUser}>Guardar datos</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="mb-4">
                        <Card.Body>
                            <h5>Historial de Compras</h5>
                            <ul className="list-unstyled">
                                {compras.map((elementsCompras) => (
                                    <li key={elementsCompras.idArticulo} className="mb-3">
                                        <p className="fw-bold mb-0">{elementsCompras.nombreArticulo}</p>
                                        <p className="text-muted">{elementsCompras.fechaCompra}</p>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                    <div className="text-end">
                        <Button variant="danger">Convertirse en vendedor</Button>
                    </div>
                </Col>
            </Row>
            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
            
        </Container>
        <Footer/>
        </main>
    );
};
