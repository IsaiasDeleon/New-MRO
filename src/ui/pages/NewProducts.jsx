import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Trash } from 'react-feather';
import axios from 'axios';
import { AuthContext } from "../../auth/AuthContext";
import { Noti } from "../components/Notificaciones";
import * as yup from 'yup';
import { useFormik } from 'formik';

const HTTP = axios.create({
  baseURL: "https://badgercore.cloud/MRO/Server/Data.php",
  timeout: 90000
});

const validationSchema = yup.object().shape({
  nombreIN: yup
    .string()
    .trim()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(120, 'El nombre no debe superar 120 caracteres')
    .required('El nombre es obligatorio'),

  descripcionIN: yup
    .string()
    .trim()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .required('La descripción es obligatoria'),

  precioIN: yup
    .number()
    .typeError('El precio debe ser numérico')
    .positive('Debe ser un número positivo')
    .required('El precio es obligatorio'),

  precioOfertaIN: yup
    .number()
    .typeError('El precio de oferta debe ser numérico')
    .min(0, 'No puede ser negativo')
    .test(
      'oferta-menor-precio',
      'El precio de oferta debe ser menor al precio regular',
      function (value) {
        const { precioIN } = this.parent;

        if (!value || Number(value) <= 0) return true;

        return Number(value) < Number(precioIN);
      }
    ),

  stokIN: yup
    .number()
    .typeError('El stock debe ser numérico')
    .integer('El stock debe ser un número entero')
    .min(1, 'Debe ser al menos 1')
    .required('El stock es obligatorio'),

  categoriaIN: yup.string().trim().required('La categoría es obligatoria'),
  marcaIN: yup.string().trim().required('La marca es obligatoria'),
  CodigoProveedorIN: yup.string().trim().required('El código del proveedor es obligatorio'),
  PesoIN: yup.string().trim().required('El peso es obligatorio'),
  TempodeEntregaIN: yup.string().trim().required('El tiempo de entrega es obligatorio'),
  TempoDdeEntregaAgotadoIN: yup.string().trim().required('El tiempo de entrega en caso de agotarse es obligatorio'),
  identificadorAIN: yup.string().trim().required('El identificador del almacén es obligatorio'),
  numParteIN: yup.string().trim().required('El número de parte es obligatorio'),
  AlmacenIN: yup.string().trim().required('El almacén es obligatorio'),
  AlmaUbiIN: yup.string().trim().required('La ubicación del almacén es obligatoria'),

  publicarMeli: yup.boolean(),

  meliCategoryId: yup.string().when('publicarMeli', {
    is: true,
    then: (schema) => schema.required('La categoría de Mercado Libre es obligatoria'),
    otherwise: (schema) => schema.notRequired()
  }),

  meliListingTypeId: yup.string().when('publicarMeli', {
    is: true,
    then: (schema) => schema.required('El tipo de publicación es obligatorio'),
    otherwise: (schema) => schema.notRequired()
  })
});

const AddNewProduct = ({ setMenu, busquedas }) => {
  const { user } = useContext(AuthContext);

  const idEmpresa = user?.Empresa;

  const MAX_IMAGE_SIZE_MB = 5;
  const MAX_PDF_SIZE_MB = 10;

  const [check, setCheck] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [notiCarrito, setNotiCarrito] = useState();
  const [activeNoti, setActiveNoti] = useState();
  const [files, setFiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showPdfAlert, setShowPdfAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const [submitStatus, setSubmitStatus] = useState(null);

  const [meliCategoryText, setMeliCategoryText] = useState('');
  const [meliCategorySuggestions, setMeliCategorySuggestions] = useState([]);
  const [meliCategoryLoading, setMeliCategoryLoading] = useState(false);
  const [showMeliSuggestions, setShowMeliSuggestions] = useState(false);

  const FIELD_LABELS = {
    nombreIN: 'Nombre',
    descripcionIN: 'Descripción',
    precioIN: 'Precio regular',
    precioOfertaIN: 'Precio en oferta',
    stokIN: 'Stock',
    categoriaIN: 'Categoría',
    marcaIN: 'Marca/Fabricante',
    CodigoProveedorIN: 'Código del producto',
    PesoIN: 'Peso',
    TempodeEntregaIN: 'Tiempo de entrega',
    TempoDdeEntregaAgotadoIN: 'Tiempo en caso de agotarse',
    identificadorAIN: 'Identificador almacén',
    numParteIN: 'Número de parte',
    AlmacenIN: 'Almacén',
    AlmaUbiIN: 'Ubicación almacén',
    meliCategoryId: 'Categoría Mercado Libre',
    meliListingTypeId: 'Tipo de publicación'
  };

  const FIELD_ORDER = [
    'nombreIN',
    'categoriaIN',
    'PesoIN',
    'marcaIN',
    'TempodeEntregaIN',
    'TempoDdeEntregaAgotadoIN',
    'descripcionIN',
    'meliCategoryId',
    'meliListingTypeId',
    'CodigoProveedorIN',
    'numParteIN',
    'stokIN',
    'precioIN',
    'precioOfertaIN',
    'identificadorAIN',
    'AlmacenIN',
    'AlmaUbiIN'
  ];

  useEffect(() => {
    if (setMenu) {
      setMenu(2);
    }

    const backdrops = document.querySelectorAll('.modal-backdrop');

    backdrops.forEach(backdrop => {
      backdrop.style.display = 'none';
    });
  }, [setMenu]);

  const fileSizeMB = (file) => file.size / 1024 / 1024;

  const message = (mess) => {
    setNotiCarrito(`${mess}`);
    setActiveNoti(true);

    setTimeout(() => {
      setActiveNoti(false);
    }, 5000);
  };

  const showUserAlert = ({
    type = 'danger',
    title = 'Aviso',
    message = '',
    details = [],
    focusTop = true
  }) => {
    setSubmitStatus({
      type,
      title,
      message,
      details
    });

    if (focusTop) {
      setTimeout(() => {
        const alertEl = document.querySelector('.mro-submit-alert');

        if (alertEl) {
          alertEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const getSafeErrorMessage = (error) => {
    if (error?.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. El producto pudo no haberse guardado. Revisa tu conexión o intenta nuevamente.';
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (typeof error?.response?.data === 'string') {
      return error.response.data;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Ocurrió un error inesperado.';
  };

  const normalizeInsertResponse = (data) => {
    if (data === 'Insertado') {
      return {
        ok: true,
        status: 'Insertado',
        message: 'Producto creado correctamente.'
      };
    }

    if (data === 'Existe') {
      return {
        ok: false,
        status: 'Existe',
        message: 'El producto ya existe.'
      };
    }

    if (typeof data === 'object' && data !== null) {
      return data;
    }

    return {
      ok: false,
      status: 'error',
      message: 'Respuesta desconocida del servidor.',
      raw: data
    };
  };

  const getMeliResultFromResponse = (data) => {
    if (!data || typeof data !== 'object') {
      return null;
    }
  
    // Caso actual de tu backend:
    // { ok:true, status:'Insertado', meli:'error', meli_error:{...} }
    if (data.meli === 'error' && data.meli_error) {
      return {
        ok: false,
        ...data.meli_error
      };
    }
  
    // Por si el backend regresa meli = 'ok'
    if (data.meli === 'ok') {
      return {
        ok: true,
        meli_item_id: data.meli_item_id || data.item_id || null,
        response: data.meli_response || null
      };
    }
  
    // Caso recomendado:
    // { meli: { ok:false, message:'...' } }
    if (typeof data.meli === 'object' && data.meli !== null) {
      return data.meli;
    }
  
    return (
      data?.mercadoLibre ||
      data?.meli_result ||
      data?.meliResult ||
      data?.publicacion_meli ||
      null
    );
  };

  const getMensajeMeli = (meliResult) => {
    if (!meliResult) {
      return 'Mercado Libre rechazó la publicación. Puedes corregir el producto e intentar publicarlo nuevamente.';
    }
  
    if (meliResult.message) {
      return meliResult.message;
    }
  
    if (meliResult.precio_minimo_meli) {
      return `Mercado Libre requiere un precio mínimo de $${Number(meliResult.precio_minimo_meli).toFixed(2)} MXN para esta categoría. Podrás modificarlo en Mis productos e intentar publicarlo nuevamente en Mercado Libre.`;
    }
  
    if (Array.isArray(meliResult.atributos_faltantes) && meliResult.atributos_faltantes.length > 0) {
      return `Mercado Libre requiere atributos obligatorios para esta categoría: ${meliResult.atributos_faltantes.join(', ')}. Podrás modificarlo en Mis productos e intentar publicarlo nuevamente en Mercado Libre.`;
    }
  
    if (meliResult.raw) {
      return 'Mercado Libre rechazó la publicación. Revisa los detalles e intenta nuevamente desde Mis productos.';
    }
  
    return 'Mercado Libre rechazó la publicación. Puedes corregir el producto e intentar publicarlo nuevamente.';
  };

  const buildDetailsFromMeli = (meliResult) => {
    const details = [];
  
    if (!meliResult) return details;
  
    const messageText = String(meliResult.message || '').toLowerCase();
  
    if (meliResult.httpCode) {
      details.push(`HTTP Mercado Libre: ${meliResult.httpCode}`);
    }
  
    if (
      meliResult.precio_minimo_meli &&
      !messageText.includes('precio mínimo')
    ) {
      details.push(`Precio mínimo requerido: $${Number(meliResult.precio_minimo_meli).toFixed(2)} MXN`);
    }
  
    if (
      Array.isArray(meliResult.atributos_faltantes) &&
      meliResult.atributos_faltantes.length > 0 &&
      !messageText.includes('atributos obligatorios')
    ) {
      details.push(`Atributos faltantes: ${meliResult.atributos_faltantes.join(', ')}`);
    }
  
    if (meliResult.meli_item_id) {
      details.push(`ID Mercado Libre: ${meliResult.meli_item_id}`);
    }
  
    if (meliResult.raw && typeof meliResult.raw === 'string') {
      details.push(`Detalle técnico: ${meliResult.raw.substring(0, 250)}`);
    }
  
    return details;
  };

  const getFirstErrorField = (errors) => {
    return FIELD_ORDER.find((field) => errors[field]);
  };

  const focusFieldByName = (fieldName) => {
    if (!fieldName) return;

    setTimeout(() => {
      let el = document.querySelector(`[name="${fieldName}"]`);

      if (fieldName === 'meliCategoryId') {
        el = document.querySelector('#meliCategoryTextInput');
      }

      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        setTimeout(() => {
          el.focus({
            preventScroll: true
          });
        }, 400);
      }
    }, 150);
  };

  const focusFirstFormikError = async () => {
    const errors = await formik.validateForm();

    if (!errors || Object.keys(errors).length === 0) {
      return true;
    }

    const touchedFields = Object.keys(errors).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    formik.setTouched(touchedFields, true);

    const firstField = getFirstErrorField(errors);

    showUserAlert({
      type: 'danger',
      title: 'Faltan datos por revisar',
      message: firstField
        ? `Revisa el campo: ${FIELD_LABELS[firstField] || firstField}.`
        : 'Revisa los campos marcados en rojo antes de guardar.',
      details: Object.keys(errors).slice(0, 5).map((key) => {
        return `${FIELD_LABELS[key] || key}: ${errors[key]}`;
      }),
      focusTop: false
    });

    focusFieldByName(firstField);

    return false;
  };

  const validateFilesBeforeSubmit = () => {
    if (files.length === 0) {
      showUserAlert({
        type: 'danger',
        title: 'Falta agregar imágenes',
        message: 'Agrega al menos una imagen del producto antes de guardar.'
      });

      message("IncluirFoto");
      return false;
    }

    if (files.length > 4) {
      showUserAlert({
        type: 'danger',
        title: 'Demasiadas imágenes',
        message: 'Solo puedes subir máximo 4 imágenes.'
      });

      return false;
    }

    const invalidImage = files.find((file) => fileSizeMB(file) > MAX_IMAGE_SIZE_MB);

    if (invalidImage) {
      showUserAlert({
        type: 'danger',
        title: 'Imagen demasiado pesada',
        message: `La imagen "${invalidImage.name}" supera ${MAX_IMAGE_SIZE_MB} MB.`
      });

      return false;
    }

    if (pdfFile && fileSizeMB(pdfFile) > MAX_PDF_SIZE_MB) {
      showUserAlert({
        type: 'danger',
        title: 'PDF demasiado pesado',
        message: `El PDF "${pdfFile.name}" supera ${MAX_PDF_SIZE_MB} MB.`
      });

      return false;
    }

    return true;
  };

  const uploadProductImages = async () => {
    const nombres = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.set('file', files[i]);

      const response = await HTTP.post('/Images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data) {
        throw new Error(`No se pudo subir la imagen ${files[i].name}`);
      }

      nombres.push(response.data);
    }

    return nombres;
  };

  const uploadProductPdf = async () => {
    if (!pdfFile) {
      return 'N/A';
    }

    const formData = new FormData();
    formData.set('file', pdfFile);

    const response = await HTTP.post('/updatePro', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.data) {
      throw new Error('No se pudo subir el PDF del producto.');
    }

    return response.data;
  };

  const resetMeliUI = () => {
    setMeliCategoryText('');
    setMeliCategorySuggestions([]);
    setShowMeliSuggestions(false);
  };

  const clearFormAfterSuccess = (resetForm) => {
    resetForm();
    setFiles([]);
    setPdfFile(null);
    setCheck(false);
    resetMeliUI();
  };

  const buildMeliSearchText = (values, manualText = '') => {
    return [
      manualText,
      values.nombreIN,
      values.descripcionIN,
      values.marcaIN,
      values.numParteIN,
      values.categoriaIN
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  const buscarCategoriasMeli = async (texto) => {
    if (!texto || texto.length < 4) {
      setMeliCategorySuggestions([]);
      setShowMeliSuggestions(false);
      return;
    }

    try {
      setMeliCategoryLoading(true);
      setShowMeliSuggestions(true);

      const res = await HTTP.post("/buscarCategoriasMeli", {
        q: texto
      });

      if (res.data?.ok && Array.isArray(res.data.data)) {
        setMeliCategorySuggestions(res.data.data);
      } else {
        setMeliCategorySuggestions([]);
        console.log("Respuesta buscarCategoriasMeli:", res.data);
      }
    } catch (error) {
      console.error("Error buscando categorías ML:", error);

      setMeliCategorySuggestions([]);

      showUserAlert({
        type: 'warning',
        title: 'No se pudieron cargar categorías',
        message: 'No se pudieron obtener sugerencias de Mercado Libre. Puedes intentar escribir otra búsqueda.'
      });
    } finally {
      setMeliCategoryLoading(false);
    }
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
      AlmaUbiIN: "",

      publicarMeli: false,
      meliCategoryId: "",
      meliCategoryName: "",
      meliListingTypeId: "free"
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (loading) return;

      setSubmitStatus(null);
      setLoading(true);

      try {
        if (!idEmpresa) {
          showUserAlert({
            type: 'danger',
            title: 'Sesión inválida',
            message: 'No se encontró la empresa del usuario. Cierra sesión e inicia nuevamente.'
          });

          return;
        }

        if (!validateFilesBeforeSubmit()) {
          return;
        }

        const nombre = await uploadProductImages();
        const pdfName = await uploadProductPdf();

        const AllData = {
          Categoria: values.categoriaIN?.trim(),
          Estado: values.estadoIN,
          Estatus: "1",
          Oferta: check ? 1 : 0,
          Stock: Number(values.stokIN),
          descripcion: values.descripcionIN?.trim(),
          empresa: idEmpresa,
          estrellas: 5,
          img: nombre,
          monto: Number(values.precioIN),
          montoOferta: check ? Number(values.precioOfertaIN || 0) : 0,
          nombre: values.nombreIN?.trim(),
          marca: values.marcaIN?.trim(),
          codigo: values.CodigoProveedorIN?.trim(),
          peso: values.PesoIN?.trim(),
          TiempoEn: values.TempodeEntregaIN?.trim(),
          TiempoEnAg: values.TempoDdeEntregaAgotadoIN?.trim(),
          PDF: pdfName,
          identificadorA: values.identificadorAIN?.trim(),
          numParte: values.numParteIN?.trim(),
          almacen: values.AlmacenIN?.trim(),
          almacenUbi: values.AlmaUbiIN?.trim(),

          publicarMeli: values.publicarMeli ? 1 : 0,
          meliCategoryId: values.meliCategoryId,
          meliCategoryName: values.meliCategoryName,
          meliListingTypeId: values.meliListingTypeId
        };

        const response3 = await HTTP.post("/InsertarProducto", AllData);
        const result = normalizeInsertResponse(response3.data);

        console.log("Respuesta InsertarProducto:", result);

        if (result.status === "Existe") {
          showUserAlert({
            type: 'warning',
            title: 'Producto duplicado',
            message: 'Este producto ya existe. Revisa el SKU, código o número de parte.'
          });

          return;
        }

        const productoGuardado =
          result.ok === true ||
          result.status === "Insertado" ||
          result.message === "Insertado" ||
          result.message === "Producto insertado correctamente";

        if (!productoGuardado) {
          showUserAlert({
            type: 'danger',
            title: 'No se pudo guardar el producto',
            message: result.message || 'El servidor no pudo guardar el producto.',
            details: [
              result.error ? `Error: ${result.error}` : null,
              result.status ? `Estatus: ${result.status}` : null
            ].filter(Boolean)
          });

          return;
        }

        const meliResult = getMeliResultFromResponse(result);

        if (values.publicarMeli && meliResult && meliResult.ok === false) {
          showUserAlert({
            type: 'warning',
            title: 'Producto guardado, pero no se publicó en Mercado Libre',
            message: getMensajeMeli(meliResult),
            details: buildDetailsFromMeli(meliResult)
          });

          if (busquedas) {
            busquedas();
          }

          clearFormAfterSuccess(resetForm);
          return;
        }

        if (values.publicarMeli && meliResult && meliResult.ok === true) {
          showUserAlert({
            type: 'success',
            title: 'Producto creado y publicado',
            message: `El producto se guardó correctamente y fue publicado en Mercado Libre${meliResult.meli_item_id ? ` con ID ${meliResult.meli_item_id}` : ''}.`,
            details: buildDetailsFromMeli(meliResult)
          });
        } else if (values.publicarMeli && !meliResult) {
          showUserAlert({
            type: 'warning',
            title: 'Producto guardado',
            message: 'El producto se guardó correctamente, pero el servidor no regresó información de Mercado Libre. Revisa en Mis productos si fue publicado.'
          });
        } else {
          showUserAlert({
            type: 'success',
            title: 'Producto creado',
            message: 'El producto se guardó correctamente en tu sistema.'
          });
        }

        setNotiCarrito("ArticuloInsertado");
        setActiveNoti(true);

        setTimeout(() => {
          setActiveNoti(false);
        }, 5000);

        if (busquedas) {
          busquedas();
        }

        clearFormAfterSuccess(resetForm);

      } catch (error) {
        console.error("Error al guardar producto:", error);

        showUserAlert({
          type: 'danger',
          title: 'Error al guardar producto',
          message: getSafeErrorMessage(error),
          details: [
            error?.response?.status ? `HTTP: ${error.response.status}` : null,
            error?.code ? `Código: ${error.code}` : null
          ].filter(Boolean)
        });

      } finally {
        setLoading(false);
      }
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': []
    },
    maxFiles: 4,
    multiple: true,
    onDrop: (acceptedFiles) => {
      setSubmitStatus(null);

      if (files.length + acceptedFiles.length > 4) {
        setShowAlert(true);

        showUserAlert({
          type: 'danger',
          title: 'Límite de imágenes',
          message: 'No puedes subir más de 4 imágenes.'
        });

        return;
      }

      const invalidImage = acceptedFiles.find((file) => fileSizeMB(file) > MAX_IMAGE_SIZE_MB);

      if (invalidImage) {
        showUserAlert({
          type: 'danger',
          title: 'Imagen demasiado pesada',
          message: `La imagen "${invalidImage.name}" supera ${MAX_IMAGE_SIZE_MB} MB.`
        });

        return;
      }

      setShowAlert(false);

      setFiles(prevFiles => [
        ...prevFiles,
        ...acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }))
      ]);
    },
    onDropRejected: () => {
      showUserAlert({
        type: 'danger',
        title: 'Archivo no válido',
        message: 'Solo se permiten imágenes JPG o PNG.'
      });
    }
  });

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: {
      'application/pdf': []
    },
    maxFiles: 1,
    multiple: false,
    onDrop: (acceptedFiles) => {
      setSubmitStatus(null);

      if (acceptedFiles.length > 1) {
        setShowPdfAlert(true);
        return;
      }

      const selectedPdf = acceptedFiles[0];

      if (selectedPdf && fileSizeMB(selectedPdf) > MAX_PDF_SIZE_MB) {
        showUserAlert({
          type: 'danger',
          title: 'PDF demasiado pesado',
          message: `El PDF "${selectedPdf.name}" supera ${MAX_PDF_SIZE_MB} MB.`
        });

        return;
      }

      setShowPdfAlert(false);
      setPdfFile(selectedPdf);
    },
    onDropRejected: () => {
      showUserAlert({
        type: 'danger',
        title: 'PDF no válido',
        message: 'Solo se permite subir un archivo PDF.'
      });
    }
  });

  const handleRemoveFile = (file) => {
    setFiles(prevFiles => {
      const nextFiles = prevFiles.filter(f => f !== file);

      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }

      return nextFiles;
    });
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
  };

  const seleccionarCategoriaMeli = (cat) => {
    const categoryId = cat.category_id || '';
    const categoryName = cat.category_name || '';

    formik.setFieldValue('meliCategoryId', categoryId);
    formik.setFieldValue('meliCategoryName', categoryName);

    setMeliCategoryText(`${categoryName} (${categoryId})`);
    setShowMeliSuggestions(false);
  };

  useEffect(() => {
    if (!formik.values.publicarMeli) return;

    const texto = buildMeliSearchText(formik.values, meliCategoryText);

    if (texto.length < 4) {
      setMeliCategorySuggestions([]);
      setShowMeliSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      buscarCategoriasMeli(texto);
    }, 600);

    return () => clearTimeout(timer);
  }, [
    meliCategoryText,
    formik.values.publicarMeli,
    formik.values.nombreIN,
    formik.values.descripcionIN,
    formik.values.marcaIN,
    formik.values.numParteIN,
    formik.values.categoriaIN
  ]);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const thumbs = files.map(file => (
    <div className="mro-thumb" key={`${file.name}-${file.lastModified}`}>
      <div className="mro-thumb-img">
        <img src={file.preview} alt={file.name} />
      </div>

      <Button
        variant="danger"
        size="sm"
        className="mro-thumb-remove"
        type="button"
        onClick={() => handleRemoveFile(file)}
      >
        <Trash size={14} />
      </Button>
    </div>
  ));

  return (
    <>
      <style>{`
  .add-product-pro {
    padding-top: 1rem;
  }

  .add-product-pro .mro-topbar-product {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 0 22px;
    margin: 0 0 22px 0;
    border-bottom: 1px solid #edf0f2;
  }

  .add-product-pro .mro-topbar-left h2 {
    margin: 0;
    font-size: 1.9rem;
    line-height: 1.1;
    font-weight: 800;
    color: #263238;
  }

  .add-product-pro .mro-topbar-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .add-product-pro .mro-btn-products {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 18px;
    border-radius: 10px;
    background: #f5f6f7;
    border: 1px solid #e7eaed;
    color: #1f2933;
    font-size: 0.92rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .add-product-pro .mro-btn-products:hover {
    background: #eceff1;
    color: #1f2933;
  }

  .add-product-pro .mro-card {
    border: 1px solid #edf0f2;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
    overflow: visible;
  }

  .add-product-pro .mro-card .form-control,
  .add-product-pro .mro-card .form-select {
    border-radius: 10px;
    border: 1px solid #d9dee3;
  }

  .add-product-pro .mro-card .form-control:focus,
  .add-product-pro .mro-card .form-select:focus {
    border-color: #34495E;
    box-shadow: 0 0 0 .14rem rgba(52, 73, 94, .10);
  }

  .add-product-pro .mro-section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }

  .add-product-pro .mro-section-title.compact {
    margin-bottom: 12px;
  }

  .add-product-pro .mro-section-title.side {
    margin-bottom: 16px;
  }

  .add-product-pro .mro-section-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #f1f4f6;
    color: #34495E;
    display: grid;
    place-items: center;
    font-size: 1rem;
    flex: 0 0 auto;
  }

  .add-product-pro .mro-section-icon.danger {
    background: #fff1f2;
    color: #dc3545;
  }

  .add-product-pro .mro-section-icon.money {
    background: #eef8f2;
    color: #198754;
  }

  .add-product-pro .mro-section-icon.warehouse {
    background: #f1f3f5;
    color: #495057;
  }

  .add-product-pro .mro-section-title h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
    color: #263238;
  }

  .add-product-pro .mro-section-title p {
    margin: 2px 0 0;
    color: #6b7785;
    font-size: .84rem;
  }

  .add-product-pro .mro-submit-alert {
    border-radius: 14px;
    border: 1px solid transparent;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  }

  .add-product-pro .mro-alert-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    font-size: 1.1rem;
  }

  .add-product-pro .mro-alert-icon.success {
    background: #eaf7ef;
    color: #198754;
  }

  .add-product-pro .mro-alert-icon.warning {
    background: #fff7e6;
    color: #b7791f;
  }

  .add-product-pro .mro-alert-icon.danger {
    background: #fff1f2;
    color: #dc3545;
  }

  .add-product-pro .meli-pro-card {
    border: 1px solid #edf0f2;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: none;
    overflow: visible;
  }

  .add-product-pro .meli-pro-header {
    display: grid;
    grid-template-columns: 42px 1fr auto;
    gap: 12px;
    align-items: center;
  }

  .add-product-pro .meli-pro-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: #fff8db;
    color: #8a6d00;
    display: grid;
    place-items: center;
    font-size: 1.15rem;
  }

  .add-product-pro .meli-pro-text h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
    color: #263238;
  }

  .add-product-pro .meli-pro-text p {
    margin: 4px 0 0;
    color: #6b7785;
    font-size: .84rem;
  }

  .add-product-pro .meli-main-switch .form-check-input {
    width: 2.8rem;
    height: 1.35rem;
    cursor: pointer;
  }

  .add-product-pro .meli-main-switch .form-check-input:checked {
    background-color: #34495E;
    border-color: #34495E;
  }

  .add-product-pro .meli-pro-body {
    margin-top: 16px;
  }

  .add-product-pro .meli-category-wrap {
    position: relative;
  }

  .add-product-pro .meli-category-suggestions {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    z-index: 9999;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
    overflow: hidden;
    max-height: 280px;
    overflow-y: auto;
  }

  .add-product-pro .meli-category-item {
    width: 100%;
    border: 0;
    background: #ffffff;
    text-align: left;
    padding: 11px 13px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    border-bottom: 1px solid #f1f3f5;
    cursor: pointer;
  }

  .add-product-pro .meli-category-item:hover {
    background: #f8fafc;
  }

  .add-product-pro .meli-category-item strong {
    font-size: .9rem;
    color: #263238;
  }

  .add-product-pro .meli-category-item span {
    font-size: .76rem;
    color: #6b7785;
  }

  .add-product-pro .meli-category-item.muted {
    color: #6b7785;
    cursor: default;
    padding: 13px;
  }

  .add-product-pro .meli-preview-grid {
    display: grid;
    grid-template-columns: 1fr 150px 100px;
    gap: 10px;
    margin-top: 6px;
  }

  .add-product-pro .meli-preview-grid > div {
    background: #f8fafc;
    border: 1px solid #edf0f2;
    border-radius: 12px;
    padding: 10px 12px;
  }

  .add-product-pro .meli-preview-grid span {
    display: block;
    font-size: .7rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #7b8794;
    letter-spacing: .03em;
    margin-bottom: 3px;
  }

  .add-product-pro .meli-preview-grid strong {
    color: #263238;
    font-size: .9rem;
  }

  .add-product-pro .mro-upload-zone {
    position: relative;
    width: 100%;
    min-height: 135px;
    border: 1.8px dashed #cfd6dd;
    border-radius: 14px;
    background: #fafbfc;
    padding: 22px;
    cursor: pointer;
    transition: 0.16s ease-in-out;
  }

  .add-product-pro .mro-upload-zone:hover {
    background: #f5f7f9;
    border-color: #34495E;
  }

  .add-product-pro .mro-upload-zone-inner {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 88px;
  }

  .add-product-pro .mro-upload-icon {
    width: 54px;
    height: 54px;
    border-radius: 14px;
    background: #eef2f5;
    color: #34495E;
    display: grid;
    place-items: center;
    font-size: 1.55rem;
    flex: 0 0 auto;
  }

  .add-product-pro .mro-upload-icon.pdf {
    background: #fff1f2;
    color: #dc3545;
  }

  .add-product-pro .mro-upload-text h5 {
    margin: 0 0 5px 0;
    font-size: 1rem;
    font-weight: 800;
    color: #263238;
  }

  .add-product-pro .mro-upload-text p {
    margin: 0 0 10px 0;
    color: #6b7785;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .add-product-pro .mro-upload-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .add-product-pro .mro-upload-badges span {
    display: inline-flex;
    align-items: center;
    padding: 4px 9px;
    border-radius: 999px;
    background: #eef2f5;
    color: #34495E;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .add-product-pro .mro-upload-pdf {
    border-color: #e3c4c8;
    background: #fffdfd;
  }

  .add-product-pro .mro-upload-pdf:hover {
    background: #fff8f8;
    border-color: #dc3545;
  }

  .add-product-pro .mro-upload-badges.pdf span {
    background: #fff1f2;
    color: #b02a37;
  }

  .add-product-pro .mro-thumbs-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: 14px;
    gap: 10px;
  }

  .add-product-pro .mro-thumb {
    display: inline-flex;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    width: 96px;
    height: 96px;
    padding: 4px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    background: #fff;
  }

  .add-product-pro .mro-thumb-img {
    display: flex;
    width: 100%;
    overflow: hidden;
    border-radius: 9px;
  }

  .add-product-pro .mro-thumb-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .add-product-pro .mro-thumb-remove {
    position: absolute;
    top: 4px;
    right: 4px;
    padding: .16rem .26rem;
    border-radius: 8px;
  }

  .add-product-pro .mro-pdf-selected {
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    background: #fff8f8;
    border: 1px solid #f1d0d5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .add-product-pro .mro-pdf-selected > div {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #dc3545;
    font-weight: 700;
    min-width: 0;
  }

  .add-product-pro .mro-pdf-selected span {
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .add-product-pro .sticky-side-card {
    position: static !important;
    top: auto !important;
  }

  .add-product-pro .mro-radio-group {
    background: #fafbfc;
    border: 1px solid #edf0f2;
    border-radius: 12px;
    padding: 9px 11px;
  }

  .add-product-pro .mro-offer-switch {
    background: #fafbfc;
    border: 1px solid #edf0f2;
    border-radius: 12px;
    padding: 11px 14px 11px 2.8rem;
  }

  .add-product-pro .mro-offer-switch .form-check-input:checked {
    background-color: #34495E;
    border-color: #34495E;
  }

  .add-product-pro .mro-submit-box {
    position: sticky;
    bottom: 18px;
    z-index: 5;
  }

  .add-product-pro .mro-submit-btn {
    background: #34495E;
    border-color: #34495E;
    border-radius: 12px;
    font-weight: 800;
    padding: 12px 16px;
  }

  .add-product-pro .mro-submit-btn:hover {
    background: #253443;
    border-color: #253443;
  }

  .add-product-pro .mro-submit-btn:disabled {
    opacity: .75;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .add-product-pro .mro-topbar-product {
      flex-direction: column;
      align-items: flex-start;
    }

    .add-product-pro .mro-topbar-right {
      width: 100%;
      justify-content: flex-start;
    }

    .add-product-pro .mro-upload-zone-inner {
      flex-direction: column;
      text-align: center;
    }

    .add-product-pro .mro-upload-badges {
      justify-content: center;
    }

    .add-product-pro .meli-pro-header {
      grid-template-columns: 42px 1fr;
    }

    .add-product-pro .meli-main-switch {
      grid-column: 1 / -1;
    }

    .add-product-pro .meli-preview-grid {
      grid-template-columns: 1fr;
    }

    .add-product-pro .sticky-side-card,
    .add-product-pro .mro-submit-box {
      position: static;
    }
  }
`}</style>

      <main className="contenedorIndex">
        <Container className="mb-8 add-product-pro">

          <div className="mro-topbar-product">
            <div className="mro-topbar-left">
              <h2>Agregar Producto</h2>
            </div>

            <div className="mro-topbar-right">
              <Button as={Link} to="/Dashboard" variant="light" className="mro-btn-products">
                <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                Mis productos
              </Button>
            </div>
          </div>

          {submitStatus && (
            <Alert
              variant={submitStatus.type}
              className="mro-submit-alert"
              dismissible
              onClose={() => setSubmitStatus(null)}
            >
              <div className="d-flex align-items-start gap-3">
                <div className={`mro-alert-icon ${submitStatus.type}`}>
                  {submitStatus.type === 'success' && <i className="bi bi-check-circle-fill"></i>}
                  {submitStatus.type === 'warning' && <i className="bi bi-exclamation-triangle-fill"></i>}
                  {submitStatus.type === 'danger' && <i className="bi bi-x-circle-fill"></i>}
                </div>

                <div>
                  <h5 className="mb-1">{submitStatus.title}</h5>
                  <p className="mb-2">{submitStatus.message}</p>

                 
                </div>
              </div>
            </Alert>
          )}

          <Form
            onSubmit={async (e) => {
              e.preventDefault();

              if (loading || formik.isSubmitting) {
                return;
              }

              const isValid = await focusFirstFormikError();

              if (!isValid) {
                return;
              }

              formik.handleSubmit(e);
            }}
          >
            <Row>
              <Col lg={8} xs={12}>
                <Card className="mb-4 card-lg mro-card">
                  <Card.Body className="p-4 p-lg-5">

                    <div className="mro-section-title">
                      <div className="mro-section-icon">
                        <i className="bi bi-box-seam"></i>
                      </div>
                      <div>
                        <h4>Información del Producto</h4>
                        <p>Datos principales para mostrar el producto en la tienda.</p>
                      </div>
                    </div>

                    <Row>
                      <Col lg={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nombre del Producto"
                            {...formik.getFieldProps('nombreIN')}
                            isInvalid={formik.touched.nombreIN && !!formik.errors.nombreIN}
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
                            isInvalid={formik.touched.categoriaIN && !!formik.errors.categoriaIN}
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
                            isInvalid={formik.touched.PesoIN && !!formik.errors.PesoIN}
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
                            isInvalid={formik.touched.marcaIN && !!formik.errors.marcaIN}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.marcaIN}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col lg={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Tiempo de entrega en días</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Tiempo de entrega"
                            {...formik.getFieldProps('TempodeEntregaIN')}
                            isInvalid={formik.touched.TempodeEntregaIN && !!formik.errors.TempodeEntregaIN}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.TempodeEntregaIN}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col lg={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Tiempo en caso de agotarse</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Tiempo de entrega en caso de agotarse"
                            {...formik.getFieldProps('TempoDdeEntregaAgotadoIN')}
                            isInvalid={formik.touched.TempoDdeEntregaAgotadoIN && !!formik.errors.TempoDdeEntregaAgotadoIN}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.TempoDdeEntregaAgotadoIN}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col lg={12} className="mt-4">
                        <div className="mro-section-title compact">
                          <div className="mro-section-icon">
                            <i className="bi bi-card-text"></i>
                          </div>
                          <div>
                            <h4>Descripción del Producto</h4>
                            <p>Incluye características, compatibilidad, uso y detalles importantes.</p>
                          </div>
                        </div>

                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Descripción del Producto"
                            {...formik.getFieldProps('descripcionIN')}
                            isInvalid={formik.touched.descripcionIN && !!formik.errors.descripcionIN}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.descripcionIN}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col lg={12} className="mt-4">
                        <Card className="meli-pro-card">
                          <Card.Body>
                            <div className="meli-pro-header">
                              <div className="meli-pro-icon">
                                <i className="bi bi-shop"></i>
                              </div>

                              <div className="meli-pro-text">
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                  <h4>Mercado Libre</h4>
                                  <Badge bg={formik.values.publicarMeli ? "success" : "secondary"}>
                                    {formik.values.publicarMeli ? "Activado" : "Desactivado"}
                                  </Badge>
                                </div>
                                <p>
                                  Publica este producto en la cuenta principal de Mercado Libre después de guardarlo en tu sistema.
                                </p>
                              </div>

                              <Form.Check
                                type="switch"
                                id="publicarMeli"
                                className="meli-main-switch"
                                checked={formik.values.publicarMeli}
                                onChange={(e) => {
                                  const checked = e.target.checked;

                                  setSubmitStatus(null);
                                  formik.setFieldValue('publicarMeli', checked);

                                  if (!checked) {
                                    formik.setFieldValue('meliCategoryId', '');
                                    formik.setFieldValue('meliCategoryName', '');
                                    formik.setFieldValue('meliListingTypeId', 'free');
                                    resetMeliUI();
                                  }
                                }}
                                label=""
                              />
                            </div>

                            {formik.values.publicarMeli && (
                              <div className="meli-pro-body">
                                <Row>
                                  <Col lg={7} className="mb-3">
                                    <Form.Group>
                                      <Form.Label>Categoría Mercado Libre</Form.Label>

                                      <div className="meli-category-wrap">
                                        <Form.Control
                                          id="meliCategoryTextInput"
                                          type="text"
                                          placeholder="Busca una categoría. Ej. sensor industrial, herramienta, refacción..."
                                          value={meliCategoryText}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            setMeliCategoryText(value);
                                            setShowMeliSuggestions(true);

                                            formik.setFieldValue('meliCategoryId', '');
                                            formik.setFieldValue('meliCategoryName', '');
                                          }}
                                          onFocus={() => {
                                            if (meliCategorySuggestions.length > 0) {
                                              setShowMeliSuggestions(true);
                                            }
                                          }}
                                          isInvalid={formik.touched.meliCategoryId && !!formik.errors.meliCategoryId}
                                        />

                                        {showMeliSuggestions && (
                                          <div className="meli-category-suggestions">
                                            {meliCategoryLoading ? (
                                              <div className="meli-category-item muted">
                                                Buscando categorías...
                                              </div>
                                            ) : meliCategorySuggestions.length > 0 ? (
                                              meliCategorySuggestions.map((cat, index) => (
                                                <button
                                                  key={`${cat.category_id}-${index}`}
                                                  type="button"
                                                  className="meli-category-item"
                                                  onClick={() => seleccionarCategoriaMeli(cat)}
                                                >
                                                  <strong>{cat.category_name || 'Sin nombre'}</strong>
                                                  <span>
                                                    {cat.category_id}
                                                    {cat.domain_name ? ` · ${cat.domain_name}` : ''}
                                                  </span>
                                                </button>
                                              ))
                                            ) : (
                                              <div className="meli-category-item muted">
                                                No se encontraron categorías.
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        <Form.Control
                                          type="hidden"
                                          {...formik.getFieldProps('meliCategoryId')}
                                          isInvalid={formik.touched.meliCategoryId && !!formik.errors.meliCategoryId}
                                        />
                                      </div>

                                      <Form.Text className="text-muted">
                                        Escribe el producto o una categoría y selecciona una sugerencia de Mercado Libre.
                                      </Form.Text>

                                      <Form.Control.Feedback
                                        type="invalid"
                                        style={{
                                          display: formik.touched.meliCategoryId && formik.errors.meliCategoryId ? 'block' : 'none'
                                        }}
                                      >
                                        {formik.errors.meliCategoryId}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>

                                  <Col lg={5} className="mb-3">
                                    <Form.Group>
                                      <Form.Label>Tipo de publicación</Form.Label>
                                      <Form.Select
                                        {...formik.getFieldProps('meliListingTypeId')}
                                        isInvalid={formik.touched.meliListingTypeId && !!formik.errors.meliListingTypeId}
                                      >
                                        <option value="gold_special">Clásica</option>
                                        <option value="gold_pro">Premium</option>
                                        <option value="free">Gratuita</option>
                                      </Form.Select>
                                      <Form.Control.Feedback type="invalid">
                                        {formik.errors.meliListingTypeId}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Col>
                                </Row>

                                <div className="meli-preview-grid">
                                  <div>
                                    <span>Título</span>
                                    <strong>{formik.values.nombreIN || "Nombre del producto"}</strong>
                                  </div>
                                  <div>
                                    <span>Precio</span>
                                    <strong>${Number(formik.values.precioIN || 0).toLocaleString("es-MX")}</strong>
                                  </div>
                                  <div>
                                    <span>Stock</span>
                                    <strong>{formik.values.stokIN || 0}</strong>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col lg={12} className="mt-4">
                        <div className="mro-section-title compact">
                          <div className="mro-section-icon">
                            <i className="bi bi-images"></i>
                          </div>
                          <div>
                            <h4>Imágenes del Producto</h4>
                            <p>Máximo 4 imágenes. Se usarán para tienda y Mercado Libre.</p>
                          </div>
                        </div>

                        {showAlert && (
                          <Alert variant="danger">
                            No puedes subir más de 4 imágenes.
                          </Alert>
                        )}

                        <div {...getRootProps({ className: 'mro-upload-zone mro-upload-images' })}>
                          <input {...getInputProps()} />

                          <div className="mro-upload-zone-inner">
                            <div className="mro-upload-icon">
                              <i className="bi bi-cloud-arrow-up-fill"></i>
                            </div>

                            <div className="mro-upload-text">
                              <h5>Sube las imágenes del producto</h5>
                              <p>Arrastra y suelta tus imágenes aquí, o haz clic para seleccionarlas.</p>

                              <div className="mro-upload-badges">
                                <span>Máximo 4 imágenes</span>
                                <span>JPG</span>
                                <span>PNG</span>
                                <span>Máx. {MAX_IMAGE_SIZE_MB} MB c/u</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <aside className="mro-thumbs-wrap">
                          {thumbs}
                        </aside>
                      </Col>

                      <Col lg={12} className="mt-4">
                        <div className="mro-section-title compact">
                          <div className="mro-section-icon danger">
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                          </div>
                          <div>
                            <h4>PDF del Producto</h4>
                            <p>Opcional. Puedes adjuntar datasheet o ficha técnica.</p>
                          </div>
                        </div>

                        {showPdfAlert && (
                          <Alert variant="danger">
                            Solo puedes subir un archivo PDF.
                          </Alert>
                        )}

                        <div {...getPdfRootProps({ className: 'mro-upload-zone mro-upload-pdf' })}>
                          <input {...getPdfInputProps()} />

                          <div className="mro-upload-zone-inner">
                            <div className="mro-upload-icon pdf">
                              <i className="bi bi-file-earmark-pdf-fill"></i>
                            </div>

                            <div className="mro-upload-text">
                              <h5>Sube el datasheet o ficha técnica</h5>
                              <p>Arrastra y suelta un archivo PDF aquí, o haz clic para seleccionarlo.</p>

                              <div className="mro-upload-badges pdf">
                                <span>Opcional</span>
                                <span>Solo PDF</span>
                                <span>1 archivo</span>
                                <span>Máx. {MAX_PDF_SIZE_MB} MB</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {pdfFile && (
                          <div className="mro-pdf-selected">
                            <div>
                              <i className="bi bi-file-earmark-pdf-fill"></i>
                              <span>{pdfFile.name}</span>
                            </div>

                            <Button
                              variant="danger"
                              size="sm"
                              type="button"
                              onClick={handleRemovePdf}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4} xs={12}>
                <Card className="mb-4 card-lg mro-card sticky-side-card">
                  <Card.Body className="p-4">
                    <div className="mro-section-title side">
                      <div className="mro-section-icon">
                        <i className="bi bi-upc-scan"></i>
                      </div>
                      <div>
                        <h4>Datos rápidos</h4>
                        <p>SKU, stock y estado.</p>
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>Código del Producto (SKU/ID)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el código"
                        {...formik.getFieldProps('CodigoProveedorIN')}
                        isInvalid={formik.touched.CodigoProveedorIN && !!formik.errors.CodigoProveedorIN}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.CodigoProveedorIN}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Número de parte</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el número de parte"
                        {...formik.getFieldProps('numParteIN')}
                        isInvalid={formik.touched.numParteIN && !!formik.errors.numParteIN}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.numParteIN}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>
                      <div className="mro-radio-group">
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
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="1"
                        {...formik.getFieldProps('stokIN')}
                        isInvalid={formik.touched.stokIN && !!formik.errors.stokIN}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.stokIN}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card className="mb-4 card-lg mro-card">
                  <Card.Body className="p-4">
                    <div className="mro-section-title side">
                      <div className="mro-section-icon money">
                        <i className="bi bi-cash-coin"></i>
                      </div>
                      <div>
                        <h4>Precio</h4>
                        <p>Precio normal y oferta.</p>
                      </div>
                    </div>

                    <Form.Group className="form-check form-switch mb-4 mro-offer-switch">
                      <Form.Check.Input
                        type="checkbox"
                        role="switch"
                        id="flexSwitchStock"
                        checked={check}
                        onChange={() => {
                          setCheck(prev => !prev);

                          if (check) {
                            formik.setFieldValue('precioOfertaIN', 0);
                          }
                        }}
                      />
                      <Form.Check.Label htmlFor="flexSwitchStock">
                        Producto con oferta
                      </Form.Check.Label>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Precio Regular</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="$0.00"
                        {...formik.getFieldProps('precioIN')}
                        isInvalid={formik.touched.precioIN && !!formik.errors.precioIN}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.precioIN}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {check && (
                      <Form.Group className="mb-3">
                        <Form.Label>Precio en oferta</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="$0.00"
                          {...formik.getFieldProps('precioOfertaIN')}
                          isInvalid={formik.touched.precioOfertaIN && !!formik.errors.precioOfertaIN}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.precioOfertaIN}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}
                  </Card.Body>
                </Card>

                <Card className="mb-4 card-lg mro-card">
                  <Card.Body className="p-4">
                    <div className="mro-section-title side">
                      <div className="mro-section-icon warehouse">
                        <i className="bi bi-building"></i>
                      </div>
                      <div>
                        <h4>Almacén</h4>
                        <p>Ubicación interna del producto.</p>
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>Identificador Almacén</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="ID almacén"
                        {...formik.getFieldProps('identificadorAIN')}
                        isInvalid={formik.touched.identificadorAIN && !!formik.errors.identificadorAIN}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.identificadorAIN}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Almacén</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Almacén"
                        {...formik.getFieldProps('AlmacenIN')}
                        isInvalid={formik.touched.AlmacenIN && !!formik.errors.AlmacenIN}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.AlmacenIN}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Ubicación Almacén</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ubicación Almacén"
                        {...formik.getFieldProps('AlmaUbiIN')}
                        isInvalid={formik.touched.AlmaUbiIN && !!formik.errors.AlmaUbiIN}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.AlmaUbiIN}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <div className="d-grid mro-submit-box">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading || formik.isSubmitting}
                    className="mro-submit-btn"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Guardando producto...
                      </>
                    ) : formik.values.publicarMeli ? (
                      <>
                        <i className="bi bi-shop me-2"></i>
                        Crear y publicar
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-check-fill me-2"></i>
                        Crear Producto
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>

        <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
      </main>
    </>
  );
};

export default AddNewProduct;