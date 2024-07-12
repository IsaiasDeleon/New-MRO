import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Breadcrumb, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Trash } from 'react-feather';
import axios from 'axios';
import { AuthContext } from "../../auth/AuthContext";
import { Noti } from "../components/Notificaciones";
import * as yup from 'yup';
import { useFormik } from 'formik';


const URLServer = "http://192.168.100.18:3020/";
const HTTP = axios.create({
  baseURL: "https://ba-mro.mx/Server/Data.php"
});

const validationSchema = yup.object().shape({
  nombreIN: yup.string().required('El nombre es obligatorio'),
  descripcionIN: yup.string().required('La descripción es obligatoria'),
  precioIN: yup.number().positive('Debe ser un número positivo').required('El precio es obligatorio'),
  stokIN: yup.number().min(1, 'Debe ser al menos 1').required('El stock es obligatorio'),
  categoriaIN: yup.string().required('La categoría es obligatoria'),
  marcaIN: yup.string().required('La marca es obligatoria'),
  CodigoProveedorIN: yup.string().required('El código del proveedor es obligatorio'),
  PesoIN: yup.string().required('El peso es obligatorio'),
  TempodeEntregaIN: yup.string().required('El tiempo de entrega es obligatorio'),
  TempoDdeEntregaAgotadoIN: yup.string().required('El tiempo de entrega en caso de agotarse es obligatorio'),
  identificadorAIN: yup.string().required('El identificador del almacén es obligatorio'),
  numParteIN: yup.string().required('El número de parte es obligatorio'),
  AlmacenIN: yup.string().required('El almacén es obligatorio'),
  AlmaUbiIN: yup.string().required('La ubicación del almacén es obligatoria')
});

const AddNewProduct = ({ setMenu, setImagenesArray, imagesArray, busquedas }) => {
  const { user } = useContext(AuthContext);
  let idU = user?.id;
  let idEmpresa = user?.Empresa;
  const [check, setCheck] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [notiCarrito, setNotiCarrito] = useState();
  const [activeNoti, setActiveNoti] = useState();
  const [files, setFiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showPdfAlert, setShowPdfAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
      backdrop.style.display = 'none';
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },  // Asegúrate de usar los MIME types correctos
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > 4) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
        setFiles(prevFiles => [
          ...prevFiles,
          ...acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file),
          }))
        ]);
      }
    }
  });

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: { 'application/pdf': [] },  // Asegúrate de usar los MIME types correctos
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

  const handleRemoveFile = (file) => {
    setFiles(files.filter(f => f !== file));
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
  };

  const formik = useFormik({
    initialValues: {
      nombreIN: "",
      descripcionIN: "",
      precioIN: 0,
      precioOfertaIN: 0,
      stokIN: 1,
      estadoIN: 1,
      categoriaIN: "",
      marcaIN: "",
      CodigoProveedorIN: "",
      PesoIN: "0 KG",
      TempodeEntregaIN: "1",
      TempoDdeEntregaAgotadoIN: "1",
      identificadorAIN: "",
      numParteIN: "",
      AlmacenIN: "",
      AlmaUbiIN: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      if (files.length === 0) {
        message("IncluirFoto");
        setLoading(false);
        return;
      }

      let nombre = [];
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let formData = new FormData();
        formData.set('file', file);

        try {
          const response = await HTTP.post("/Images", formData);
          nombre.push(response.data);
        } catch (error) {
          console.error(error);
          setLoading(false);
          return;
        }
      }

      let formData2 = new FormData();
      if (pdfFile !== null) {
        formData2.set('file', pdfFile);
      }

      let pdfResponse = { data: "N/A" };
      if (pdfFile !== null) {
        try {
          pdfResponse = await HTTP.post("/updatePro", formData2);
        } catch (error) {
          console.error(error);
          setLoading(false);
          return;
        }
      }

      let AllData = {
        Categoria: values.categoriaIN,
        Estado: values.estadoIN,
        Estatus: "1",
        Oferta: check ? 1 : 0,
        Stock: values.stokIN,
        descripcion: values.descripcionIN,
        empresa: idEmpresa,
        estrellas: 5,
        img: nombre,
        monto: values.precioIN,
        montoOferta: values.precioOfertaIN,
        nombre: values.nombreIN,
        marca: values.marcaIN,
        codigo: values.CodigoProveedorIN,
        peso: values.PesoIN,
        TiempoEn: values.TempodeEntregaIN,
        TiempoEnAg: values.TempoDdeEntregaAgotadoIN,
        PDF: pdfResponse.data,
        identificadorA: values.identificadorAIN,
        numParte: values.numParteIN,
        almacen: values.AlmacenIN,
        almacenUbi: values.AlmaUbiIN
      };
      
      try {
        const response3 = await HTTP.post("/InsertarProducto", AllData);
       
        if (response3.data === "Insertado") {
          setNotiCarrito("ArticuloInsertado");
          busquedas();
          setActiveNoti(true);
          setTimeout(() => {
            setActiveNoti(false);
          }, 5000);
          resetForm();
          setFiles([]);
          setPdfFile(null);
          setCheck(false);
        } else if (response3.data === "Existe") {
          alert("El producto ya existe")
        } else {
          alert("Algo salio mal")
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  });

  const message = (mess) => {
    setNotiCarrito(`${mess}`);
    setActiveNoti(true);
    setTimeout(() => {
      setActiveNoti(false);
    }, 5000);
  };

  const thumbs = files.map(file => (
    <div key={file.name} style={{ display: 'inline-flex', borderRadius: 2, border: '1px solid #eaeaea', marginBottom: 8, marginRight: 8, width: 100, height: 100, padding: 4, boxSizing: 'border-box', position: 'relative' }}>
      <div style={{ display: 'flex', minWidth: 0, overflow: 'hidden' }}>
        <img src={file.preview} style={{ display: 'block', width: 'auto', height: '100%' }} alt={file.name} />
      </div>
      <Button
        variant="danger"
        size="sm"
        style={{ position: 'absolute', top: 0, right: 0, padding: '0.2rem' }}
        onClick={() => handleRemoveFile(file)}
      >
        <Trash size={14} />
      </Button>
    </div>
  ));

  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <main className="contenedorIndex">
      <Container className='mb-8'>
        <Row className="mb-8 mt-4">
          <Col md={12}>
            <div className="d-md-flex justify-content-between align-items-center">
              <div>
                <h2>Agregar Producto</h2>
              </div>
              <div>
                <Button as={Link} to="/Dashboard" variant="light">MisProductos</Button>
              </div>
            </div>
          </Col>
        </Row>

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
                      name="estadoIN"
                      id="estadoIN1"
                      value="1"
                      checked={formik.values.estadoIN === 1}
                      onChange={() => formik.setFieldValue('estadoIN', 1)}
                    />
                    <Form.Check
                      inline
                      label="Usado"
                      type="radio"
                      name="estadoIN"
                      id="estadoIN2"
                      value="2"
                      checked={formik.values.estadoIN === 2}
                      onChange={() => formik.setFieldValue('estadoIN', 2)}
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
                </Card.Body>
              </Card>
              <Card className="mb-6 card-lg">
                <Card.Body className="p-6">
                  <h4 className="mb-4 h5">Precio del Producto</h4>
                  <Form.Group className="form-check form-switch mb-4">
                    <Form.Check.Input type="checkbox" role="switch" id="flexSwitchStock" checked={check} onChange={() => setCheck(!check)} />
                    <Form.Check.Label htmlFor="flexSwitchStock">Oferta</Form.Check.Label>
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
                  {loading ? <Spinner animation="border" size="sm" /> : 'Crear Producto'}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
      <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
    </main>
  );
};

export default AddNewProduct;
