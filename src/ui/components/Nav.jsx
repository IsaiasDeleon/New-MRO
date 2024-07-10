import React, { useContext, useState } from 'react';
import { Navbar, Container, Offcanvas, Form, InputGroup, Button, Nav, NavDropdown } from 'react-bootstrap';
import { Search, ArrowDown } from 'react-feather';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

export const Navigation = ({ dataCategrorias, setFiltros, filtros }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const handleCategoryChange = (cat) => {
    setFiltros({ ...filtros, Catego: cat, Nombre: '' });
  };
  const { user } = useContext(AuthContext);
  let idU = user?.id;
  const tipoUser = user?.tipoUser;
  let idEmpresa= user?.Empresa;
  return (
    <Navbar bg="primary" expand="lg" variant="dark" style={{ position: "fixed", top: "65px", width: "100%", background: "#fff", padding: "5px 15px" }}>
      <Container fluid style={{ padding: "0" }}>
        <Navbar.Toggle aria-controls="navbar-default" onClick={handleShowOffcanvas} />
        <Navbar.Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} id="navbar-default" aria-labelledby="navbar-defaultLabel">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="navbar-defaultLabel">
              Navegación
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-block d-lg-none mb-4">
              <Form action="#">
                <InputGroup>
                  <Form.Control className="rounded" type="search" placeholder="Buscar productos" />
                  <Button className="btn bg-white border border-start-0 ms-n10 rounded-0 rounded-end" type="button">
                    <Search />
                  </Button>
                </InputGroup>
              </Form>
            </div>

            <Nav className="navbar-nav align-items-center navbar-offcanvas-color" style={{ marginLeft: 10 }}>
              <NavDropdown
                title={
                  <>
                    Categorías
                    <ArrowDown size={18} className="me-2" />
                  </>
                }
                id="categories-dropdown"
              >
                {dataCategrorias?.map((cat) => (
                  <NavDropdown.Item
                    key={cat}
                    as={Link}
                    to="/Productos"
                    onClick={() => handleCategoryChange(cat)}
                  >
                    <div className="text-center">
                      <p style={{ margin: "0" }}>{cat}</p>
                    </div>
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              {idEmpresa && (
        <>
          <Nav.Link as={Link} to="/Dashboard" className="ms-3">
            Mis Productos
          </Nav.Link>
          {tipoUser !== "2" && (
            <Nav.Link as={Link} to="/NewProducts" className="ms-3">
              Agregar producto
            </Nav.Link>
          )}
          {tipoUser === "4" && (
            <Nav.Link as={Link} to="/NewUser" className="ms-3">
              Agregar un usuario
            </Nav.Link>
          )}
        </>
      )}
              
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
