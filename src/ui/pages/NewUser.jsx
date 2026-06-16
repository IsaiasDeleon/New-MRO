import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import { Eye, EyeOff, Edit } from 'react-feather';
import { AuthContext } from '../../auth/AuthContext';
import axios from "axios";

const HTTP = axios.create({
  baseURL: "https://badgercore.cloud/MRO/Server/Data.php"
});

const NewUser = () => {
  const { user } = useContext(AuthContext);
  const idEmpresa = user?.Empresa;

  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const getData = () => {
    if (!idEmpresa) return;

    HTTP.post("/GetUserByProveedor", { Empresa: idEmpresa })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setUsers([]);
      });
  };

  useEffect(() => {
    getData();
  }, [idEmpresa]);

  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
    setSelectedUser(null);
    setAlerta(null);
    setGuardando(false);
  };

  const handleShow = (usuario = {}) => {
    setSelectedUser({
      Nombre: usuario.Nombre || '',
      Correo: usuario.Correo || '',
      Password: usuario.Password || '',
      tipoUser: usuario.tipoUser || '2',
      Estatus: usuario.Estatus || '1',
      id: usuario.id || null,
    });

    setIsEditing(!!usuario.id);
    setAlerta(null);
    setShow(true);
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
    setAlerta(null);
  };

  const validarFormulario = () => {
    if (!selectedUser?.Nombre?.trim()) {
      setAlerta({
        tipo: 'danger',
        mensaje: 'Ingresa el nombre del usuario.'
      });
      return false;
    }

    if (!selectedUser?.Correo?.trim()) {
      setAlerta({
        tipo: 'danger',
        mensaje: 'Ingresa el correo del usuario.'
      });
      return false;
    }

    if (!selectedUser?.Password?.trim()) {
      setAlerta({
        tipo: 'danger',
        mensaje: 'Ingresa la contraseña del usuario.'
      });
      return false;
    }

    if (!selectedUser?.tipoUser) {
      setAlerta({
        tipo: 'danger',
        mensaje: 'Selecciona el tipo de usuario.'
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validarFormulario()) return;

    setGuardando(true);
    setAlerta(null);

    if (isEditing) {
      HTTP.post("/EditUserByProveedor", {
        ...selectedUser,
        TipoUser: selectedUser.tipoUser
      })
        .then((response) => {
          setUsers((prev) =>
            prev.map((usuario) =>
              usuario.id === selectedUser.id
                ? { ...usuario, ...selectedUser }
                : usuario
            )
          );

          handleClose();
        })
        .catch((error) => {
          console.error(error);
          setAlerta({
            tipo: 'danger',
            mensaje: 'No se pudo actualizar el usuario. Intenta nuevamente.'
          });
        })
        .finally(() => {
          setGuardando(false);
        });

      return;
    }

    HTTP.post("/NewUserByProveedor", {
      ...selectedUser,
      idEmpresa: idEmpresa,
      TipoUser: selectedUser.tipoUser
    })
      .then((response) => {
        const respuesta = String(response.data || '').trim();

        console.log('Respuesta NewUserByProveedor:', respuesta);

        if (respuesta === 'YaExiste') {
          setAlerta({
            tipo: 'warning',
            mensaje: 'Ya existe un usuario registrado con ese correo.'
          });
          return;
        }

        if (respuesta === 'RegistroUsuario') {
          setAlerta({
            tipo: 'success',
            mensaje: 'Usuario creado correctamente.'
          });

          getData();

          setTimeout(() => {
            handleClose();
          }, 700);

          return;
        }

        setAlerta({
          tipo: 'danger',
          mensaje: 'Respuesta inesperada del servidor: ' + respuesta
        });
      })
      .catch((error) => {
        console.error(error);
        setAlerta({
          tipo: 'danger',
          mensaje: 'No se pudo crear el usuario. Intenta nuevamente.'
        });
      })
      .finally(() => {
        setGuardando(false);
      });
  };

  return (
    <div className="contenedorIndex">
      <Container className="mt-5">
        <Row className="mb-3">
          <Col>
            <h2>Usuarios</h2>
          </Col>

          <Col className="text-end">
            <Button variant="primary" onClick={() => handleShow({})}>
              Crear Nuevo Usuario
            </Button>
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.Nombre}</td>
                    <td>{usuario.Correo}</td>
                    <td>
                      <span>
                        {showPassword[usuario.id] ? usuario.Password : "********"}
                      </span>

                      <Button
                        variant="link"
                        onClick={() => togglePasswordVisibility(usuario.id)}
                      >
                        {showPassword[usuario.id] ? <EyeOff /> : <Eye />}
                      </Button>
                    </td>

                    <td>
                      {usuario.tipoUser === "4"
                        ? 'Master'
                        : `Tipo ${usuario.tipoUser}`}
                    </td>

                    <td>
                      <span
                        className={`badge bg-${
                          usuario.Estatus === '1' ? 'primary' : 'danger'
                        } text-white`}
                      >
                        {usuario.Estatus === '1' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleShow(usuario)}
                      >
                        <Edit size={17} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {alerta && (
              <Alert variant={alerta.tipo} className="mb-3">
                {alerta.mensaje}
              </Alert>
            )}

            <Form>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre:</Form.Label>
                <Form.Control
                  type="text"
                  name="Nombre"
                  value={selectedUser?.Nombre || ''}
                  onChange={handleChange}
                  placeholder="Nombre del usuario"
                />
              </Form.Group>

              <Form.Group controlId="formCorreo" className="mt-3">
                <Form.Label>Correo:</Form.Label>
                <Form.Control
                  type="email"
                  name="Correo"
                  value={selectedUser?.Correo || ''}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  disabled={isEditing}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="Password"
                  value={selectedUser?.Password || ''}
                  onChange={handleChange}
                  placeholder="Contraseña"
                />
              </Form.Group>

              <Form.Group controlId="formTipo" className="mt-3">
                <Form.Label>Tipo de Usuario:</Form.Label>
                <Form.Select
                  name="tipoUser"
                  value={selectedUser?.tipoUser || '2'}
                  onChange={handleChange}
                >
                  <option value="2">Tipo 2</option>
                  <option value="3">Tipo 3</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={guardando}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Guardando...
                </>
              ) : (
                isEditing ? 'Guardar' : 'Crear'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default NewUser;