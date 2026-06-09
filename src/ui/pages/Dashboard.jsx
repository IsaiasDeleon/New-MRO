import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Pagination,
  Table,
  Badge,
  Modal,
  Spinner
} from 'react-bootstrap';
import {
  MoreVertical,
  Edit,
  Eye,
  EyeOff,
  Package,
  Search,
  Plus,
  Image as ImageIcon,
  AlertTriangle
} from 'react-feather';
import EditProductModal from './EditProductModal';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

const HTTP = axios.create({
  baseURL: "https://badgercore.cloud/MRO/Server/Data.php",
  timeout: 90000
});

const safeText = (value) => String(value ?? '').toLowerCase();

const normalizeProducts = (data) => {
  if (Array.isArray(data)) return data;

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('misProductos no es un JSON válido:', data);
      return [];
    }
  }

  return [];
};

const getFirstImage = (product) => {
  const firstImage = String(product?.img ?? '').split(',')[0].trim();

  return firstImage
    ? `https://badgercore.cloud/MRO/Server/Images/${firstImage}`
    : 'https://badgercore.cloud/MRO/Server/Images/Box.jpg';
};

const getProductStatus = (product) => {
  const estatus = String(product?.Estatus ?? '');

  if (estatus === '1') {
    return {
      label: 'Activo',
      bg: 'success',
      className: 'bg-success-subtle text-success border border-success-subtle'
    };
  }

  if (estatus === '3') {
    return {
      label: 'Borrador',
      bg: 'secondary',
      className: 'bg-secondary-subtle text-secondary border border-secondary-subtle'
    };
  }

  return {
    label: 'Inactivo',
    bg: 'danger',
    className: 'bg-danger-subtle text-danger border border-danger-subtle'
  };
};

const getMeliStatus = (product) => {
  const status = String(product?.meli_status || '').toLowerCase();
  const itemId = product?.meli_item_id;

  if (!itemId) {
    return {
      label: 'No publicado',
      className: 'bg-light text-muted border'
    };
  }

  if (status === 'active' || status === 'publicado') {
    return {
      label: 'Publicado',
      className: 'bg-success-subtle text-success border border-success-subtle'
    };
  }

  if (status === 'paused' || status === 'pausado') {
    return {
      label: 'Pausado',
      className: 'bg-warning-subtle text-warning border border-warning-subtle'
    };
  }

  if (status === 'error') {
    return {
      label: 'Revisar',
      className: 'bg-danger-subtle text-danger border border-danger-subtle'
    };
  }

  return {
    label: status || 'Sin estado',
    className: 'bg-light text-muted border'
  };
};

const buildUpdatePayload = (product, newEstatus) => ({
  Categoria: product?.Categoria ?? '',
  Estado: product?.Estado ?? '1',
  Estatus: String(newEstatus),
  Oferta: product?.Oferta ?? '0',
  Stock: product?.Stock ?? 0,
  descripcion: product?.descripcion ?? '',
  id: product?.id,
  monto: product?.monto ?? 0,
  montoOferta: product?.montoOferta ?? 0,
  nombre: product?.nombre ?? '',
  marca: product?.Marca ?? product?.marca ?? '',
  codigo: product?.CodigoProveedor ?? product?.codigo ?? '',
  peso: product?.Peso ?? product?.peso ?? '',
  TiempoEn: product?.TempodeEntrega ?? '',
  TiempoEnAg: product?.TempoDdeEntregaAgotado ?? '',
  PDF: product?.PDF ?? 'N/A',
  almacen: product?.almacen ?? '',
  almacenUbi: product?.ubiAlma ?? product?.almacenUbi ?? '',
  numParte: product?.numParte ?? ''
});

const ConfirmStatusModal = ({
  show,
  product,
  nextStatus,
  loading,
  onCancel,
  onConfirm
}) => {
  const willDeactivate = String(nextStatus) !== '1';

  return (
    <Modal show={show} onHide={loading ? undefined : onCancel} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title className="fw-bold">
          {willDeactivate ? 'Inactivar producto' : 'Activar producto'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex gap-3">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center ${
              willDeactivate ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'
            }`}
            style={{ width: 46, height: 46, flex: '0 0 46px' }}
          >
            {willDeactivate ? <EyeOff size={22} /> : <Eye size={22} />}
          </div>

          <div>
            <h6 className="fw-bold mb-1">
              {product?.nombre || 'Producto seleccionado'}
            </h6>

            <p className="text-muted mb-0" style={{ lineHeight: 1.5 }}>
              {willDeactivate
                ? 'El producto dejará de mostrarse en la tienda, pero seguirá guardado en el sistema para poder reactivarlo después.'
                : 'El producto volverá a estar visible en la tienda.'}
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant={willDeactivate ? 'warning' : 'success'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Procesando...
            </>
          ) : willDeactivate ? (
            'Sí, inactivar'
          ) : (
            'Sí, activar'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NoticeBar = ({ notice, onClose }) => {
  if (!notice) return null;

  const className = {
    success: 'bg-success-subtle text-success border-success-subtle',
    warning: 'bg-warning-subtle text-warning border-warning-subtle',
    danger: 'bg-danger-subtle text-danger border-danger-subtle',
    info: 'bg-info-subtle text-info border-info-subtle'
  }[notice.type || 'info'];

  return (
    <div className={`border rounded-4 px-3 py-3 mb-3 d-flex align-items-start gap-3 ${className}`}>
      <AlertTriangle size={20} className="mt-1" />

      <div className="flex-grow-1">
        <div className="fw-bold">{notice.title}</div>
        <div style={{ fontSize: 14 }}>{notice.message}</div>
      </div>

      <button
        type="button"
        className="btn-close"
        onClick={onClose}
        aria-label="Cerrar"
      />
    </div>
  );
};

const MainContent = ({
  misProductos = [],
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  handleEdit,
  handleRequestStatusChange,
  notice,
  setNotice
}) => {
  const productos = useMemo(() => normalizeProducts(misProductos), [misProductos]);
  const [estatusFiltro, setEstatusFiltro] = useState('');

  const filteredProducts = useMemo(() => {
    const term = safeText(searchTerm);

    return productos.filter((product) => {
      const coincideBusqueda =
        safeText(product.nombre).includes(term) ||
        safeText(product.identificadorA).includes(term) ||
        safeText(product.Categoria).includes(term) ||
        safeText(product.numParte).includes(term) ||
        safeText(product.Marca).includes(term) ||
        safeText(product.CodigoProveedor).includes(term);

      const coincideEstatus =
        estatusFiltro === '' || String(product.Estatus ?? '') === estatusFiltro;

      return coincideBusqueda && coincideEstatus;
    });
  }, [productos, searchTerm, estatusFiltro]);

  const activeCount = productos.filter(p => String(p.Estatus ?? '') === '1').length;
  const inactiveCount = productos.filter(p => String(p.Estatus ?? '') !== '1').length;
  const publishedCount = productos.filter(p => p.meli_item_id).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, estatusFiltro, productos.length, setCurrentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const indexOfLastItem = safeCurrentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageItems = [];
    const siblings = 1;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(
          <Pagination.Item
            key={i}
            active={i === safeCurrentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }

      return pageItems;
    }

    pageItems.push(
      <Pagination.Item
        key={1}
        active={1 === safeCurrentPage}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    if (safeCurrentPage > 3) {
      pageItems.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    for (
      let i = Math.max(2, safeCurrentPage - siblings);
      i <= Math.min(totalPages - 1, safeCurrentPage + siblings);
      i++
    ) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === safeCurrentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (safeCurrentPage < totalPages - 2) {
      pageItems.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }

    pageItems.push(
      <Pagination.Item
        key={totalPages}
        active={totalPages === safeCurrentPage}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </Pagination.Item>
    );

    return pageItems;
  };

  return (
    <main className="contenedorIndex" style={{ background: '#f6f8fb', minHeight: '100vh' }}>
      <Container fluid className="py-4 px-4">
        <Row className="mb-3">
          <Col md={12}>
            <div
              className="rounded-4 p-4 border"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)'
              }}
            >
              <div className="d-lg-flex justify-content-between align-items-center gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div
                      className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                      style={{ width: 42, height: 42 }}
                    >
                      <Package size={21} />
                    </div>

                    <div>
                      <h3 className="mb-0 fw-bold">Mis productos</h3>
                      <small className="text-muted">
                        Administra inventario, imágenes, estatus y publicaciones.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-3 mt-lg-0">
                  <div className="px-3 py-2 rounded-3 bg-light border">
                    <small className="text-muted d-block">Total</small>
                    <strong>{productos.length}</strong>
                  </div>

                  <div className="px-3 py-2 rounded-3 bg-success-subtle border border-success-subtle">
                    <small className="text-success d-block">Activos</small>
                    <strong className="text-success">{activeCount}</strong>
                  </div>

                  <div className="px-3 py-2 rounded-3 bg-danger-subtle border border-danger-subtle">
                    <small className="text-danger d-block">Inactivos</small>
                    <strong className="text-danger">{inactiveCount}</strong>
                  </div>

                  <div className="px-3 py-2 rounded-3 bg-info-subtle border border-info-subtle">
                    <small className="text-info d-block">M. Libre</small>
                    <strong className="text-info">{publishedCount}</strong>
                  </div>

                  <Button
                    as={Link}
                    to="/NewProducts"
                    variant="primary"
                    className="rounded-3 fw-bold d-flex align-items-center gap-2"
                  >
                    <Plus size={17} />
                    Agregar producto
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <NoticeBar notice={notice} onClose={() => setNotice(null)} />

        <Row>
          <Col xl={12} xs={12}>
            <Card
              className="border-0 rounded-4 overflow-hidden"
              style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}
            >
              <div className="px-4 py-4 bg-white border-bottom">
                <Row className="justify-content-between align-items-center g-3">
                  <Col lg={5} md={7} xs={12}>
                    <div className="position-relative">
                      <Search
                        size={18}
                        className="position-absolute text-muted"
                        style={{ left: 14, top: 13 }}
                      />

                      <Form.Control
                        type="search"
                        placeholder="Buscar por nombre, ID almacén, categoría, número de parte, marca o SKU..."
                        aria-label="Buscar producto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-3"
                        style={{
                          minHeight: 44,
                          paddingLeft: 42,
                          borderColor: '#dbe3ef'
                        }}
                      />
                    </div>
                  </Col>

                  <Col lg={3} md={5} xs={12}>
                    <Form.Select
                      value={estatusFiltro}
                      onChange={(e) => setEstatusFiltro(e.target.value)}
                      className="rounded-3"
                      style={{ minHeight: 44, borderColor: '#dbe3ef' }}
                    >
                      <option value="">Todos los estatus</option>
                      <option value="1">Activos</option>
                      <option value="0">Inactivos</option>
                      <option value="2">Inactivos</option>
                      <option value="3">Borrador</option>
                    </Form.Select>
                  </Col>
                </Row>
              </div>

              <Card.Body className="p-0 bg-white">
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className="ps-4 py-3" style={{ width: 72 }}>Imagen</th>
                        <th className="py-3">ID almacén</th>
                        <th className="py-3">Núm. parte</th>
                        <th className="py-3">Producto</th>
                        <th className="py-3">Categoría</th>
                        <th className="py-3">Precio</th>
                        <th className="py-3">Tienda</th>
                        <th className="py-3">M. Libre</th>
                        <th className="text-end pe-4 py-3">Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentProducts.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-5">
                            <div
                              className="mx-auto rounded-circle bg-light d-flex align-items-center justify-content-center mb-3"
                              style={{ width: 62, height: 62 }}
                            >
                              <Package className="text-muted" size={28} />
                            </div>

                            <h6 className="fw-bold mb-1">No hay productos para mostrar</h6>
                            <p className="text-muted mb-0">
                              Intenta cambiar los filtros o agregar un nuevo producto.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        currentProducts.map((product) => {
                          const imgSrc = getFirstImage(product);
                          const status = getProductStatus(product);
                          const meliStatus = getMeliStatus(product);
                          const isActive = String(product.Estatus ?? '') === '1';

                          return (
                            <tr key={product.id}>
                              <td className="ps-4">
                                <button
                                  type="button"
                                  className="border-0 bg-transparent p-0"
                                  title="Editar producto"
                                  onClick={() => handleEdit(product)}
                                >
                                  <div
                                    className="rounded-3 border bg-light d-flex align-items-center justify-content-center overflow-hidden"
                                    style={{
                                      width: 54,
                                      height: 54,
                                      boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)'
                                    }}
                                  >
                                    <img
                                      src={imgSrc}
                                      alt={product.nombre ?? 'Producto'}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                      }}
                                      onError={(e) => {
                                        e.currentTarget.src = 'https://badgercore.cloud/MRO/Server/Images/Box.jpg';
                                      }}
                                    />
                                  </div>
                                </button>
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-link p-0 text-decoration-none fw-bold"
                                  onClick={() => handleEdit(product)}
                                  title="Editar producto"
                                >
                                  {product.identificadorA || '-'}
                                </button>
                              </td>

                              <td>
                                <span className="text-muted">
                                  {product.numParte || '-'}
                                </span>
                              </td>

                              <td style={{ minWidth: 240 }}>
                                <button
                                  type="button"
                                  className="btn btn-link p-0 text-start text-decoration-none"
                                  onClick={() => handleEdit(product)}
                                  title="Editar producto"
                                >
                                  <div className="fw-bold text-dark">
                                    {product.nombre || '-'}
                                  </div>

                                  <small className="text-muted">
                                    SKU: {product.CodigoProveedor || '-'}
                                  </small>
                                </button>
                              </td>

                              <td>
                                <span className="text-muted">
                                  {product.Categoria || '-'}
                                </span>
                              </td>

                              <td>
                                <div className="fw-bold">
                                  ${Number(product.monto || 0).toFixed(2)}
                                </div>

                                {String(product.Oferta ?? '') === '1' && (
                                  <small className="text-success fw-bold">
                                    Oferta: ${Number(product.montoOferta || 0).toFixed(2)}
                                  </small>
                                )}
                              </td>

                              <td>
                                <Badge className={`rounded-pill px-3 py-2 ${status.className}`}>
                                  {status.label}
                                </Badge>
                              </td>

                              <td>
                                <Badge className={`rounded-pill px-3 py-2 ${meliStatus.className}`}>
                                  {meliStatus.label}
                                </Badge>
                              </td>

                              <td className="text-end pe-4">
                                <div className="dropdown">
                                  <button
                                    type="button"
                                    className="btn btn-light rounded-circle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ width: 38, height: 38, padding: 0 }}
                                  >
                                    <MoreVertical size={18} />
                                  </button>

                                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                                    <li>
                                      <button
                                        className="dropdown-item d-flex align-items-center py-2"
                                        type="button"
                                        onClick={() => handleEdit(product)}
                                      >
                                        <Edit size={16} className="me-2" />
                                        Editar producto
                                      </button>
                                    </li>

                                    <li>
                                      <button
                                        className={`dropdown-item d-flex align-items-center py-2 ${
                                          isActive ? 'text-warning' : 'text-success'
                                        }`}
                                        type="button"
                                        onClick={() =>
                                          handleRequestStatusChange(product, isActive ? '0' : '1')
                                        }
                                      >
                                        {isActive ? (
                                          <>
                                            <EyeOff size={16} className="me-2" />
                                            Inactivar producto
                                          </>
                                        ) : (
                                          <>
                                            <Eye size={16} className="me-2" />
                                            Activar producto
                                          </>
                                        )}
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>

              <div className="border-top bg-white d-md-flex justify-content-between align-items-center px-4 py-4">
                <span className="text-muted">
                  Mostrando{' '}
                  <strong className="text-dark">
                    {filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1}
                  </strong>
                  {' '}a{' '}
                  <strong className="text-dark">
                    {Math.min(indexOfLastItem, filteredProducts.length)}
                  </strong>
                  {' '}de{' '}
                  <strong className="text-dark">{filteredProducts.length}</strong>
                  {' '}productos
                </span>

                <nav className="mt-3 mt-md-0">
                  <Pagination className="mb-0">
                    <Pagination.Prev
                      disabled={safeCurrentPage === 1}
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                    >
                      Anterior
                    </Pagination.Prev>

                    {renderPageNumbers()}

                    <Pagination.Next
                      disabled={safeCurrentPage === totalPages}
                      onClick={() => handlePageChange(safeCurrentPage + 1)}
                    >
                      Siguiente
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

const Dashboard = ({ misProductos = [], head2misproductos }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [notice, setNotice] = useState(null);
  const [statusModal, setStatusModal] = useState({
    show: false,
    product: null,
    nextStatus: null
  });
  const [statusLoading, setStatusLoading] = useState(false);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleRequestStatusChange = (product, nextStatus) => {
    setStatusModal({
      show: true,
      product,
      nextStatus
    });
  };

  const handleCancelStatusChange = () => {
    if (statusLoading) return;

    setStatusModal({
      show: false,
      product: null,
      nextStatus: null
    });
  };

  const handleConfirmStatusChange = async () => {
    const product = statusModal.product;
    const nextStatus = statusModal.nextStatus;

    if (!product || !product.id) return;

    setStatusLoading(true);
    setNotice(null);

    try {
      const payload = buildUpdatePayload(product, nextStatus);

      const res = await HTTP.post('/updateProducto', payload);

      const actualizado =
        res.data === 'Actualizado' ||
        res.data?.status === 'Actualizado' ||
        res.data?.ok === true;

      if (!actualizado) {
        setNotice({
          type: 'warning',
          title: 'No se pudo cambiar el estatus',
          message: res.data?.message || 'El servidor no confirmó el cambio. Intenta nuevamente.'
        });
        return;
      }

      setNotice({
        type: 'success',
        title: String(nextStatus) === '1' ? 'Producto activado' : 'Producto inactivado',
        message:
          String(nextStatus) === '1'
            ? 'El producto volvió a estar visible en la tienda.'
            : 'El producto se ocultó de la tienda, pero sigue guardado en el sistema.'
      });

      setStatusModal({
        show: false,
        product: null,
        nextStatus: null
      });

      if (head2misproductos) {
        head2misproductos('');
      }

    } catch (error) {
      console.error('Error cambiando estatus:', error);

      setNotice({
        type: 'danger',
        title: 'No se pudo cambiar el estatus',
        message: 'Ocurrió un problema al actualizar el producto. Revisa tu conexión e intenta nuevamente.'
      });
    } finally {
      setStatusLoading(false);
    }
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
        handleRequestStatusChange={handleRequestStatusChange}
        notice={notice}
        setNotice={setNotice}
      />

      {selectedProduct && (
        <EditProductModal
          show={showModal}
          handleClose={handleCloseModal}
          product={selectedProduct}
          head2misproductos={head2misproductos}
        />
      )}

      <ConfirmStatusModal
        show={statusModal.show}
        product={statusModal.product}
        nextStatus={statusModal.nextStatus}
        loading={statusLoading}
        onCancel={handleCancelStatusChange}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};

export default Dashboard;