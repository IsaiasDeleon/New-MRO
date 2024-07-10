import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { Eye, EyeOff, Edit2, Edit } from 'react-feather';
import { AuthContext } from '../../auth/AuthContext';
import axios from "axios";

const HTTP = axios.create({
  baseURL: "http://localhost/Server/Data.php"
});

const NewUser = () => {
  const { user } = useContext(AuthContext);
  let idEmpresa = user?.Empresa;
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const getData = () => {
    HTTP.post("/GetUserByProveedor", { "Empresa": idEmpresa }).then((response) => {
      if (response.data) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleShow = (user) => {
    setSelectedUser(user);
    setIsEditing(!!user.id);
    setShow(true);
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isEditing) {
      HTTP.post("/EditUserByProveedor", {...selectedUser,TipoUser:selectedUser.tipoUser}).then(() => {
        setUsers((prev) =>
          prev.map((user) => (user.id === selectedUser.id ? selectedUser : user))
        );
        handleClose();
      });
    } else {
      HTTP.post("/NewUserByProveedor", {...selectedUser,idEmpresa:idEmpresa,TipoUser:selectedUser.tipoUser}).then((response) => {
        console.log(response)
        getData();
        handleClose();
      });
    }
  };

  return (
    <div className="contenedorIndex">
      <Container className="mt-5">
        <Row className="mb-3">
          <Col>
            <h2>Usuarios</h2>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => handleShow({})}>Crear Nuevo Usuario</Button>
          </Col>
        </Row>
        <div className="table-responsive">
          <Table className="table table-centered table-hover text-nowrap table-borderless mb-0 table-with-checkbox">
            <thead className="bg-light">
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Password</th>
                <th>Tipo de Usuario</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.Nombre}</td>
                  <td>{user.Correo}</td>
                  <td>
                    <span>{showPassword[user.id] ? user.Password : "********"}</span>
                    <Button variant="link" onClick={() => togglePasswordVisibility(user.id)}>
                      {showPassword[user.id] ? <EyeOff /> : <Eye />}
                    </Button>
                  </td>
                  <td>{user.tipoUser === "4" ? 'Master' : `Tipo ${user.tipoUser}`}</td>
                  <td><span className={`badge bg-${user.Estatus === '1' ? 'primary' : 'danger'} text-white`}>{user.Estatus === '1' ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    <Button variant="primary" onClick={() => handleShow(user)}>
                      <Edit size={17} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre:</Form.Label>
                <Form.Control
                  type="text"
                  name="Nombre"
                  value={selectedUser?.Nombre || ''}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formCorreo" className="mt-3">
                <Form.Label>Correo:</Form.Label>
                <Form.Control
                  type="email"
                  name="Correo"
                  value={selectedUser?.Correo || ''}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="Password"
                  value={selectedUser?.Password || ''}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formTipo" className="mt-3">
                <Form.Label>Tipo de Usuario:</Form.Label>
                <Form.Select
                  name="tipoUser"
                  value={selectedUser?.tipoUser || ''}
                  onChange={handleChange}
                >
                  <option value="2">Tipo 2</option>
                  <option value="3">Tipo 3</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {isEditing ? 'Guardar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default NewUser;
