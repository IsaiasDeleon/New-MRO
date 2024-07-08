import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Pagination, Table, Modal } from 'react-bootstrap';
import { MoreVertical, Trash2, Edit } from 'react-feather';
import EditProductModal from './EditProductModal';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const MainContent = ({ misProductos, currentPage, setCurrentPage, searchTerm, setSearchTerm, handleEdit }) => {
  const [filteredProducts, setFilteredProducts] = useState(misProductos);

  useEffect(() => {
    const filtered = misProductos.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.identificadorA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.numParte.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, misProductos, setCurrentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageItems = [];
    const siblings = 1; // Number of sibling pages to show around the current page

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }
    } else {
      pageItems.push(
        <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      for (let i = Math.max(2, currentPage - siblings); i <= Math.min(totalPages - 1, currentPage + siblings); i++) {
        pageItems.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }
      pageItems.push(
        <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return pageItems;
  };

  return (
    <main className="contenedorIndex">
      <Container className='mt-4'>
        <Row className="mb-3">
          <Col md={12}>
            <div className="d-md-flex justify-content-between align-items-center">
              <div>
                <h3>Mis productos</h3>
              </div>
              <div>
                <Button as={Link} to="/NewProducts" variant="light">Agregar producto</Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xl={12} col={12} mb={5}>
            <Card className="h-100 card-lg">
              <div className="px-6 py-6">
                <Row className="justify-content-between">
                  <Col lg={4} md={6} col={12} mb={2} mb-lg={0}>
                    <Form className="d-flex" role="search">
                      <Form.Control
                        type="search"
                        placeholder="Buscar producto"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Form>
                  </Col>
                  <Col lg={2} md={4} col={12}>
                    <Form.Select>
                      <option selected>Estatus</option>
                      <option value="1">Activo</option>
                      <option value="2">Inactivo</option>
                      <option value="3">Borrador</option>
                    </Form.Select>
                  </Col>
                </Row>
              </div>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="table table-centered table-hover text-nowrap table-borderless mb-0 table-with-checkbox">
                    <thead className="bg-light">
                      <tr>
                        <th>
                          <Form.Check type="checkbox" id="checkAll" />
                        </th>
                        <th>Imagen</th>
                        <th>Id almacén</th>
                        <th>Num. parte</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Estatus</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map(product => {
                        const imgSrc = product.img ? `https://ba-mro.mx/Server/Images/${product.img.split(',')[0]}` : 'https://ba-mro.mx/Server/Images/Box.jpg';
                        return (
                          <tr key={product.id}>
                            <td>
                              <Form.Check type="checkbox" id={product.id} />
                            </td>
                            <td>
                              <img src={imgSrc} alt="" className="icon-shape icon-md" />
                            </td>
                            <td><a href="#" className="text-reset">{product.identificadorA}</a></td>
                            <td>{product.numParte}</td>
                            <td>{product.nombre}</td>
                            <td>{product.Categoria}</td>
                            <td>{product.monto}</td>
                            <td>
                              <span className={`badge bg-${product.Estatus === '1' ? 'primary' : 'danger'} `}>{product.Estatus === '1' ? 'Activo' : 'Inactivo'}</span>
                            </td>
                            <td>
                              <div className="dropdown">
                                <a href="#" className="text-reset" data-bs-toggle="dropdown" aria-expanded="false">
                                  <MoreVertical className="fs-5" />
                                </a>
                                <ul className="dropdown-menu">
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      <Trash2 className="me-3" />
                                      Eliminar
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item"  onClick={() => handleEdit(product)}>
                                      <Edit className="me-3" />
                                      Editar
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <div className="border-top d-md-flex justify-content-between align-items-center px-6 py-6">
                <span>Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredProducts.length)} de {filteredProducts.length} entradas</span>
                <nav className="mt-2 mt-md-0">
                  <Pagination className="mb-0">
                    <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                      <span>Anterior</span>
                    </Pagination.Prev>
                    {renderPageNumbers()}
                    <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                      <span>Siguiente</span>
                    </Pagination.Next>
                  </Pagination>
                </nav>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

const Dashboard = ({ misProductos,head2misproductos }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="main-wrapper">
      <MainContent
        misProductos={misProductos}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleEdit={handleEdit}
      />
      {selectedProduct && (
        <EditProductModal
          show={showModal}
          handleClose={handleCloseModal}
          product={selectedProduct}
          head2misproductos={head2misproductos}
        />
      )}
    </div>
  );
};

export default Dashboard;
