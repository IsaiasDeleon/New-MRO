import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Trash } from 'react-feather';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Noti } from "../components/Notificaciones";

const HTTP = axios.create({
  baseURL: "http://localhost/Server/Data.php"
});

const schema = yup.object().shape({
  nombreIN: yup.string().required('Nombre es obligatorio'),
  categoriaIN: yup.string().required('Categoría es obligatoria'),
  PesoIN: yup.string().required('Peso es obligatorio'),
  marcaIN: yup.string().required('Marca/Fabricante es obligatorio'),
  TempodeEntregaIN: yup.string().required('Tiempo de entrega es obligatorio'),
  TempoDdeEntregaAgotadoIN: yup.string().required('Tiempo de entrega en caso de agotarse es obligatorio'),
  descripcionIN: yup.string().required('Descripción es obligatoria'),
  CodigoProveedorIN: yup.string().required('Código del Producto (SKU/ID) es obligatorio'),
  numParteIN: yup.string().required('Número de parte es obligatorio'),
  precioIN: yup.string().required('Precio es obligatorio'),
  identificadorAIN: yup.string().required('Identificador Almacen es obligatorio'),
  AlmacenIN: yup.string().required('Almacen es obligatorio'),
  AlmaUbiIN: yup.string().required('Ubicación Almacen es obligatorio'),
  stokIN: yup.number().min(1, 'Debe ser al menos 1').required('El stock es obligatorio'),
});

const EditProductModal = ({ show, handleClose, product,head2misproductos }) => {
  const [notiCarrito, setNotiCarrito] = useState();
  const [activeNoti, setActiveNoti] = useState();
  const [check, setCheck] = useState(product.Oferta === '1');
  const [estatusCheck, setEstatusCheck] = useState(product.Estatus === '1');
  const [files, setFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showPdfAlert, setShowPdfAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombreIN: product.nombre,
      categoriaIN: product.Categoria,
      PesoIN: product.Peso,
      marcaIN: product.Marca,
      TempodeEntregaIN: product.TempodeEntrega,
      TempoDdeEntregaAgotadoIN: product.TempoDdeEntregaAgotado,
      descripcionIN: product.descripcion,
      CodigoProveedorIN: product.CodigoProveedor,
      numParteIN: product.numParte,
      precioIN: product.monto,
      precioOfertaIN: product.montoOferta,
      identificadorAIN: product.identificadorA,
      AlmacenIN: product.almacen,
      AlmaUbiIN: product.ubiAlma,
      estadoIN: product.Estado,
      stokIN: product.Stock || 1,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true);
      let formData;
      if (pdfFile) {
        formData = new FormData();
        formData.set('file', pdfFile);
      } else {
        formData = 0;
      }

      const datos = {
        Categoria: values.categoriaIN,
        Estado: values.estadoIN,
        Estatus: estatusCheck ? "1" : "0",
        Fecha: product.Fecha,
        Oferta: check ? "1" : "0",
        Stock: values.stokIN,
        empresa: product.empresa,
        estrellas: product.estrellas,
        id: product.id,
        descripcion: values.descripcionIN,
        monto: values.precioIN,
        montoOferta: values.precioOfertaIN,
        nombre: values.nombreIN,
        marca: values.marcaIN,
        codigo: values.CodigoProveedorIN,
        peso: values.PesoIN,
        TiempoEn: values.TempodeEntregaIN,
        TiempoEnAg: values.TempoDdeEntregaAgotadoIN,
        identificadorA: values.identificadorAIN,
        numParte: values.numParteIN,
        almacen: values.AlmacenIN,
        almacenUbi: values.AlmaUbiIN,
        PDF: product.PDF,
      };

      await saveOne(formData, datos);
      setLoading(false);
    },
  });

  const saveOne = async (data, datos) => {
    if (data !== 0) {
      try {
        const response = await HTTP.post("/updatePro", data);
        let AllData = { ...datos, PDF: response.data };

        const updateResponse = await HTTP.post("/updateProducto", AllData);
        console.log(updateResponse)
        if (updateResponse.data === "Actualizado") {
          setNotiCarrito("ArticuloUpdate");
          setActiveNoti(true);
          setTimeout(() => {
            setActiveNoti(false);
            handleClose();
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const updateResponse = await HTTP.post("/updateProducto", datos);
      console.log(updateResponse)
      if (updateResponse.data === "Actualizado") {
        setNotiCarrito("ArticuloUpdate");
        setActiveNoti(true);
        setTimeout(() => {
          setActiveNoti(false);
          handleClose();
        }, 2000);
      }
    }
    head2misproductos("");
  };

  useEffect(() => {
    if (product.img) {
      const imageFiles = product.img.split(',').map((img, index) => ({
        id: index,
        preview: `https://ba-mro.mx/Server/Images/${img}`
      }));
      setFiles(imageFiles);
    }
    if (product.PDF && product.PDF !== 'N/A') {
      setPdfFile({ name: product.PDF, preview: `https://ba-mro.mx/Server/PDFs/${product.PDF}` });
    }
  }, [product]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > 4) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
        setFiles(prevFiles => [
          ...prevFiles,
          ...acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
          }))
        ]);
      }
    }
  });

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: '.pdf',
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        setShowPdfAlert(true);
      } else {
        setShowPdfAlert(false);
        setPdfFile(acceptedFiles[0]);
      }
    }
  });

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
  };

  const thumbs = files.map((file, index) => (
    <div key={file.preview} style={{ display: 'inline-flex', borderRadius: 2, border: '1px solid #eaeaea', marginBottom: 8, marginRight: 8, width: 100, height: 100, padding: 4, boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ display: 'flex', minWidth: 0, overflow: 'hidden' }}>
        <img src={file.preview} style={{ display: 'block', width: 'auto', height: '100%' }} alt="" />
      </div>
      <Button
        variant="danger"
        size="sm"
        style={{ position: 'absolute', top: 0, right: 0, padding: '0.2rem' }}
        onClick={() => handleRemoveFile(index)}
      >
        <Trash size={14} />
      </Button>
    </div>
  ));

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={8} xs={12}>
              <Card className="mb-6 card-lg">
                <Card.Body className="p-6">
                  <h4 className="mb-4 h5">Información del Producto</h4>
                  <Row>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nombre del Producto"
                          {...formik.getFieldProps('nombreIN')}
                          isInvalid={!!formik.errors.nombreIN}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.nombreIN}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Categoría del Producto</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Categoría del Producto"
                          {...formik.getFieldProps('categoriaIN')}
                          isInvalid={!!formik.errors.categoriaIN}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.categoriaIN}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Peso</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Peso"
                          {...formik.getFieldProps('PesoIN')}
                          isInvalid={!!formik.errors.PesoIN}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.PesoIN}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Marca/Fabricante</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Marca/Fabricante"
                          {...formik.getFieldProps('marcaIN')}
                          isInvalid={!!formik.errors.marcaIN}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.marcaIN}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Tiempo de entrega (en días)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Tiempo de entrega"
                          {...formik.getFieldProps('TempodeEntregaIN')}
                          isInvalid={!!formik.errors.TempodeEntregaIN}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.TempodeEntregaIN}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Tiempo de entrega en caso de agotarse (en días)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Tiempo de entrega en caso de agotarse"
                          {...formik.getFieldProps('TempoDdeEntregaAgotadoIN')}
                          isInvalid={!!formik.errors.TempoDdeEntregaAgotadoIN}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.TempoDdeEntregaAgotadoIN}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col lg={12} className="mt-5">
                      <h4 className="mb-3 h5">Imágenes del Producto</h4>
                      {showAlert && <Alert variant="danger">No puedes subir más de 4 imágenes.</Alert>}
                      <div {...getRootProps({ className: 'dropzone mt-4 border-dashed rounded-2 min-h-0 p-3' })}>
                        <input {...getInputProps()} />
                        <p>Arrastra y suelta algunos archivos aquí, o haz clic para seleccionar archivos (hasta 4 imágenes)</p>
                      </div>
                      <aside style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}>
                        {thumbs}
                      </aside>
                    </Col>
                    <Col lg={12} className="mt-5">
                      <h4 className="mb-3 h5">Descripción del Producto</h4>
                      <Form.Group>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          placeholder="Descripción del Producto"
                          {...formik.getFieldProps('descripcionIN')}
                          isInvalid={!!formik.errors.descripcionIN}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.descripcionIN}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col lg={12} className="mt-5">
                      <h4 className="mb-3 h5">PDF del Producto (opcional)</h4>
                      {showPdfAlert && <Alert variant="danger">Solo puedes subir un archivo PDF.</Alert>}
                      <div {...getPdfRootProps({ className: 'dropzone mt-4 border-dashed rounded-2 min-h-0 p-3' })}>
                        <input {...getPdfInputProps()} />
                        <p>Arrastra y suelta un archivo aquí, o haz clic para seleccionar un archivo (solo PDF)</p>
                      </div>
                      {pdfFile && (
                        <div style={{ marginTop: 16, position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p>{pdfFile.name}</p>
                            <Button
                              variant="danger"
                              size="sm"
                              style={{ marginLeft: 16 }}
                              onClick={handleRemovePdf}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} xs={12}>
              <Card className="mb-6 card-lg">
                <Card.Body className="p-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Código del Producto (SKU/ID)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el Código del Producto"
                      {...formik.getFieldProps('CodigoProveedorIN')}
                      isInvalid={!!formik.errors.CodigoProveedorIN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.CodigoProveedorIN}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de parte</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el número de parte del Producto"
                      {...formik.getFieldProps('numParteIN')}
                      isInvalid={!!formik.errors.numParteIN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.numParteIN}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <br />
                    <Form.Check
                      inline
                      label="Nuevo"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio1"
                      checked={formik.values.estadoIN === '1'}
                      onChange={() => formik.setFieldValue('estadoIN', '1')}
                      required
                    />
                    <Form.Check
                      inline
                      label="Usado"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio2"
                      checked={formik.values.estadoIN === '2'}
                      onChange={() => formik.setFieldValue('estadoIN', '2')}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="1"
                      {...formik.getFieldProps('stokIN')}
                      isInvalid={!!formik.errors.stokIN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.stokIN}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-check form-switch mb-4">
                    <Form.Check.Input
                      type="checkbox"
                      role="switch"
                      id="flexSwitchEstatus"
                      checked={estatusCheck}
                      onChange={() => setEstatusCheck(!estatusCheck)}
                    />
                    <Form.Check.Label htmlFor="flexSwitchEstatus">Estatus</Form.Check.Label>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card className="mb-6 card-lg">
                <Card.Body className="p-6">
                  <h4 className="mb-4 h5">Precio del Producto</h4>
                  <Form.Group className="form-check form-switch mb-4">
                    <Form.Check.Input type="checkbox" role="switch" id="flexSwitchOferta" checked={check} onChange={() => setCheck(!check)} />
                    <Form.Check.Label htmlFor="flexSwitchOferta">Oferta</Form.Check.Label>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio Regular</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="$0.00"
                      {...formik.getFieldProps('precioIN')}
                      isInvalid={!!formik.errors.precioIN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.precioIN}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {check && (
                    <Form.Group className="mb-3">
                      <Form.Label>Precio en oferta (si es que aplica)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="$0.00"
                        {...formik.getFieldProps('precioOfertaIN')}
                        isInvalid={!!formik.errors.precioOfertaIN}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.precioOfertaIN}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}
                </Card.Body>
              </Card>
              <Card className="mb-6 card-lg">
                <Card.Body className="p-6">
                  <h4 className="mb-4 h5">Almacen</h4>
                  <Form.Group className="mb-3">
                    <Form.Label>Identificador Almacen</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="idAlmacen"
                      {...formik.getFieldProps('identificadorAIN')}
                      isInvalid={!!formik.errors.identificadorAIN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.identificadorAIN}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Almacen</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Almacen"
                      {...formik.getFieldProps('AlmacenIN')}
                      isInvalid={!!formik.errors.AlmacenIN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.AlmacenIN}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ubicación Almacen</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ubicación Almacen"
                      {...formik.getFieldProps('AlmaUbiIN')}
                      isInvalid={!!formik.errors.AlmaUbiIN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.AlmaUbiIN}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Card.Body>
              </Card>
              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Guardar Cambios'}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
      </Modal.Footer>
      <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
    </Modal>
  );
};

export default EditProductModal;
