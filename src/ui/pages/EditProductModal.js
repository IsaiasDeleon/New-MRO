import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import {
  Trash,
  UploadCloud,
  FileText,
  Image,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle
} from 'react-feather';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Noti } from "../components/Notificaciones";

const HTTP = axios.create({
  baseURL: "https://ba-mro.mx/Server/Data.php",
  timeout: 90000
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
  AlmacenIN: yup.string().required('Almacén es obligatorio'),
  AlmaUbiIN: yup.string().required('Ubicación almacén es obligatoria'),
  stokIN: yup.number().min(1, 'Debe ser al menos 1').required('El stock es obligatorio'),
});

const styles = {
  modalBody: {
    background: '#f6f8fb',
    padding: 0
  },
  headerBox: {
    padding: '22px 26px',
    borderBottom: '1px solid #edf0f5',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  },
  title: {
    fontWeight: 800,
    letterSpacing: '-0.02em',
    marginBottom: 4
  },
  subtitle: {
    color: '#64748b',
    marginBottom: 0,
    fontSize: 14
  },
  contentWrap: {
    padding: 22
  },
  sectionCard: {
    border: '1px solid #e8edf4',
    borderRadius: 18,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
    overflow: 'hidden',
    marginBottom: 18
  },
  cardHeader: {
    padding: '16px 18px',
    borderBottom: '1px solid #edf0f5',
    background: '#fff'
  },
  cardTitle: {
    fontWeight: 800,
    fontSize: 15,
    margin: 0,
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  cardHint: {
    margin: '4px 0 0',
    color: '#64748b',
    fontSize: 13
  },
  cardBody: {
    padding: 18,
    background: '#fff'
  },
  fieldLabel: {
    fontWeight: 700,
    fontSize: 13,
    color: '#334155',
    marginBottom: 7
  },
  input: {
    borderRadius: 12,
    border: '1px solid #dbe3ef',
    minHeight: 42
  },
  dropzone: {
    border: '1.5px dashed #b7c4d8',
    background: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    cursor: 'pointer',
    transition: 'all .2s ease',
    textAlign: 'center'
  },
  imageThumb: {
    width: 112,
    height: 112,
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    position: 'relative',
    background: '#fff',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)'
  },
  deleteBtn: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 28,
    height: 28,
    borderRadius: 999,
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sidebarSticky: {
    position: 'sticky',
    top: 16
  },
  meliBox: {
    borderRadius: 16,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: 14
  },
  footerBar: {
    borderTop: '1px solid #edf0f5',
    background: '#fff',
    padding: '14px 22px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap'
  }
};

const getMeliBadgeInfo = (status, itemId) => {
  const cleanStatus = String(status || '').toLowerCase();

  if (!itemId && cleanStatus === 'error') {
    return { label: 'Requiere atención', bg: 'danger' };
  }

  if (!itemId && cleanStatus === 'pendiente') {
    return { label: 'Pendiente', bg: 'secondary' };
  }

  if (!itemId) {
    return {
      label: 'No publicado',
      bg: 'light',
      textDark: true,
      border: true
    };
  }

  if (cleanStatus === 'active' || cleanStatus === 'publicado') {
    return { label: 'Publicado', bg: 'success' };
  }

  if (cleanStatus === 'paused' || cleanStatus === 'pausado') {
    return { label: 'Pausado', bg: 'warning', textDark: true };
  }

  if (cleanStatus === 'closed' || cleanStatus === 'inactivo') {
    return { label: 'Inactivo', bg: 'dark' };
  }

  if (cleanStatus === 'under_review') {
    return { label: 'En revisión', bg: 'info', textDark: true };
  }

  return { label: cleanStatus || 'Publicado', bg: 'secondary' };
};

const limpiarNombreArchivo = (value) => {
  if (!value) return '';

  if (typeof value === 'string') {
    return value.replaceAll('"', '').trim();
  }

  return String(value).replaceAll('"', '').trim();
};

const getSafeText = (value) => {
  try {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  } catch {
    return '';
  }
};

const extractMercadoLibreCauses = (res) => {
  const causes =
    res?.response?.cause ||
    res?.meli_error?.response?.cause ||
    res?.cause ||
    [];

  if (!Array.isArray(causes)) return [];

  return causes
    .map(cause => ({
      code: cause?.code || '',
      message: cause?.message || '',
      type: cause?.type || '',
      references: cause?.references || []
    }))
    .filter(cause => cause.message || cause.code);
};

const getFriendlyMeliError = (res) => {
  const causes = extractMercadoLibreCauses(res);

  const rawMessage =
    res?.message ||
    res?.meli_error?.message ||
    res?.response?.message ||
    '';

  const rawText = getSafeText(res).toLowerCase();

  const missingAttributes =
    res?.atributos_faltantes ||
    res?.meli_error?.atributos_faltantes ||
    [];

  if (
    rawText.includes('available quantity max. value is 1') ||
    rawText.includes('item.available_quantity.invalid')
  ) {
    return {
      title: 'Mercado Libre solo permite 1 pieza',
      message:
        'Esta publicación está configurada como gratuita. Para esta categoría, Mercado Libre solo permite publicar 1 pieza de stock. Baja el stock a 1 o cambia el tipo de publicación antes de sincronizar.',
      type: 'warning'
    };
  }

  if (
    rawText.includes('minimum price') ||
    rawText.includes('precio mínimo') ||
    rawText.includes('price below') ||
    rawText.includes('precio_minimo_meli')
  ) {
    const precioMinimo = res?.precio_minimo_meli || res?.meli_error?.precio_minimo_meli;

    return {
      title: 'El precio es menor al permitido',
      message: precioMinimo
        ? `Mercado Libre no permite publicar este producto con ese precio. Para esta categoría, el precio mínimo permitido es $${Number(precioMinimo).toFixed(2)} MXN.`
        : 'Mercado Libre no permite publicar este producto con ese precio. Sube el precio o revisa la categoría seleccionada.',
      type: 'warning'
    };
  }

  if (Array.isArray(missingAttributes) && missingAttributes.length > 0) {
    return {
      title: 'Faltan datos obligatorios',
      message: `Mercado Libre necesita algunos datos adicionales para publicar este producto: ${missingAttributes.join(', ')}.`,
      type: 'warning'
    };
  }

  if (
    rawText.includes('item.attributes.missing_required') ||
    rawText.includes('missing_catalog_required') ||
    rawText.includes('attributes are required') ||
    rawText.includes('atributos obligatorios')
  ) {
    const causeMessages = causes
      .filter(cause => cause.type === 'error' || cause.code.includes('missing'))
      .map(cause => cause.message)
      .filter(Boolean);

    return {
      title: 'Faltan características del producto',
      message: causeMessages.length > 0
        ? 'Mercado Libre necesita que completes algunas características obligatorias del producto antes de publicarlo.'
        : 'Mercado Libre necesita características adicionales del producto antes de publicarlo, como marca, modelo, tipo, kit u otros atributos de la categoría.',
      type: 'warning'
    };
  }

  if (
    rawText.includes('invalid category') ||
    rawText.includes('category_id') ||
    rawText.includes('category not found') ||
    rawText.includes('categoría')
  ) {
    return {
      title: 'La categoría no es válida',
      message:
        'Mercado Libre no permitió publicar con la categoría actual. Selecciona una categoría más específica o vuelve a buscar la categoría del producto.',
      type: 'warning'
    };
  }

  if (
    rawText.includes('pictures') ||
    rawText.includes('picture') ||
    rawText.includes('image') ||
    rawText.includes('imagen')
  ) {
    return {
      title: 'Problema con las imágenes',
      message:
        'Mercado Libre no aceptó las imágenes del producto. Revisa que al menos una imagen sea clara, válida y esté correctamente cargada.',
      type: 'warning'
    };
  }

  if (
    rawText.includes('title') ||
    rawText.includes('item.title') ||
    rawText.includes('título')
  ) {
    return {
      title: 'Revisa el nombre del producto',
      message:
        'Mercado Libre no aceptó el título del producto. Intenta usar un nombre más claro, sin texto repetido, sin símbolos raros y con menos caracteres.',
      type: 'warning'
    };
  }

  if (
    rawText.includes('description') ||
    rawText.includes('descripción')
  ) {
    return {
      title: 'Revisa la descripción',
      message:
        'Mercado Libre no aceptó la descripción del producto. Intenta agregar una descripción más clara y sin contenido inválido.',
      type: 'warning'
    };
  }

  if (
    rawText.includes('seller.not_allowed') ||
    rawText.includes('not allowed') ||
    rawText.includes('forbidden') ||
    rawText.includes('403')
  ) {
    return {
      title: 'La cuenta no puede realizar esta acción',
      message:
        'Mercado Libre no permitió esta acción con la cuenta vinculada. Puede ser por permisos, configuración de la cuenta o restricciones de publicación.',
      type: 'warning'
    };
  }

  if (
    rawText.includes('unauthorized') ||
    rawText.includes('invalid_token') ||
    rawText.includes('expired') ||
    rawText.includes('access token') ||
    rawText.includes('401')
  ) {
    return {
      title: 'Hay que reconectar Mercado Libre',
      message:
        'La conexión con Mercado Libre expiró o ya no es válida. Vuelve a vincular la cuenta para poder publicar o sincronizar.',
      type: 'warning'
    };
  }

  if (rawText.includes('not found') || rawText.includes('404')) {
    return {
      title: 'No se encontró la publicación',
      message:
        'Mercado Libre no encontró la publicación relacionada con este producto. Puede que haya sido eliminada o que el ID ya no sea válido.',
      type: 'warning'
    };
  }

  if (
    rawText.includes('shipping') ||
    rawText.includes('envío') ||
    rawText.includes('me2')
  ) {
    return {
      title: 'Revisa la configuración de envíos',
      message:
        'Mercado Libre detectó un problema con la configuración de envío. Revisa las preferencias de envío de la cuenta o la categoría del producto.',
      type: 'warning'
    };
  }

  if (
    rawText.includes('rate limit') ||
    rawText.includes('too many requests') ||
    rawText.includes('429')
  ) {
    return {
      title: 'Mercado Libre recibió muchas solicitudes',
      message:
        'Mercado Libre limitó temporalmente las solicitudes. Intenta nuevamente en unos minutos.',
      type: 'info'
    };
  }

  if (
    rawText.includes('internal server error') ||
    rawText.includes('500') ||
    rawText.includes('bad gateway') ||
    rawText.includes('502') ||
    rawText.includes('503')
  ) {
    return {
      title: 'Mercado Libre no respondió correctamente',
      message:
        'Mercado Libre tuvo un problema temporal. Intenta nuevamente en unos minutos.',
      type: 'info'
    };
  }

  if (rawMessage && !rawMessage.toLowerCase().includes('validation error')) {
    return {
      title: 'Mercado Libre no permitió la operación',
      message:
        'No se pudo completar la acción. Revisa stock, precio, categoría, imágenes y características obligatorias del producto.',
      type: 'warning'
    };
  }

  return {
    title: 'No se pudo completar la acción',
    message:
      'Mercado Libre no permitió publicar o sincronizar este producto. Revisa que tenga categoría, precio, stock, imágenes y características completas.',
    type: 'warning'
  };
};

const getFriendlyAppError = (error, fallback = 'No se pudo completar la acción.') => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const rawText = `${getSafeText(data)} ${error?.message || ''}`.toLowerCase();

  if (error?.code === 'ECONNABORTED' || rawText.includes('timeout')) {
    return {
      title: 'La solicitud tardó demasiado',
      message: 'El servidor tardó mucho en responder. Revisa tu conexión e intenta nuevamente.',
      type: 'info'
    };
  }

  if (rawText.includes('network error')) {
    return {
      title: 'No hay conexión con el servidor',
      message: 'No se pudo conectar con el servidor. Revisa tu internet o intenta nuevamente.',
      type: 'danger'
    };
  }

  if (status === 400) {
    return {
      title: 'Hay datos por revisar',
      message: 'El servidor no aceptó la información enviada. Revisa los campos del producto e intenta de nuevo.',
      type: 'warning'
    };
  }

  if (status === 401 || status === 403) {
    return {
      title: 'No tienes permiso para esta acción',
      message: 'Tu sesión o permisos no permiten completar esta operación.',
      type: 'warning'
    };
  }

  if (status === 404) {
    return {
      title: 'No se encontró el recurso',
      message: 'No se encontró el producto o la ruta solicitada en el servidor.',
      type: 'warning'
    };
  }

  if (status >= 500) {
    return {
      title: 'Error temporal del servidor',
      message: 'El servidor tuvo un problema al procesar la solicitud. Intenta nuevamente.',
      type: 'danger'
    };
  }

  if (data?.message) {
    return {
      title: 'No se pudo completar',
      message: data.message,
      type: 'warning'
    };
  }

  return {
    title: 'No se pudo completar',
    message: fallback,
    type: 'warning'
  };
};

const normalizeMeliActionResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return {
      ok: false,
      message: 'Respuesta inválida del servidor.'
    };
  }

  if (data.ok === true) {
    return data;
  }

  if (data.meli === 'error' && data.meli_error) {
    return {
      ok: false,
      ...data.meli_error,
      message: data.meli_error.message || data.message || 'Mercado Libre rechazó la operación.'
    };
  }

  return data;
};

const NoticeBox = ({ notice, onClose }) => {
  if (!notice) return null;

  const config = {
    success: {
      icon: <CheckCircle size={20} />,
      bg: '#ecfdf5',
      border: '#a7f3d0',
      color: '#065f46'
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      bg: '#fffbeb',
      border: '#fde68a',
      color: '#92400e'
    },
    danger: {
      icon: <XCircle size={20} />,
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#991b1b'
    },
    info: {
      icon: <Info size={20} />,
      bg: '#eff6ff',
      border: '#bfdbfe',
      color: '#1e40af'
    }
  };

  const current = config[notice.type] || config.info;

  return (
    <div
      style={{
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
        borderRadius: 16,
        padding: 14,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        marginBottom: 16
      }}
    >
      <div style={{ marginTop: 1 }}>{current.icon}</div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, marginBottom: 3 }}>
          {notice.title}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.45 }}>
          {notice.message}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 0,
            background: 'transparent',
            color: current.color,
            fontWeight: 800,
            lineHeight: 1,
            fontSize: 18
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

const ConfirmActionModal = ({
  show,
  title,
  message,
  confirmText,
  variant,
  loading,
  onCancel,
  onConfirm
}) => {
  return (
    <Modal show={show} onHide={loading ? undefined : onCancel} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title style={{ fontWeight: 800 }}>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0" style={{ color: '#475569', lineHeight: 1.55 }}>
          {message}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        <Button variant={variant || 'primary'} onClick={onConfirm} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Procesando...
            </>
          ) : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const EditProductModal = ({ show, handleClose, product, head2misproductos }) => {
  const [notiCarrito, setNotiCarrito] = useState();
  const [activeNoti, setActiveNoti] = useState();

  const [check, setCheck] = useState(String(product?.Oferta ?? '') === '1');
  const [estatusCheck, setEstatusCheck] = useState(String(product?.Estatus ?? '') === '1');

  const [files, setFiles] = useState([]);
  const [imagenesEliminadas, setImagenesEliminadas] = useState([]);

  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [appNotice, setAppNotice] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [submitMode, setSubmitMode] = useState('guardar');

  const [meliActionLoading, setMeliActionLoading] = useState(false);
  const [meliStatus, setMeliStatus] = useState(product?.meli_status || '');
  const [meliItemId, setMeliItemId] = useState(product?.meli_item_id || '');
  const [meliLastError, setMeliLastError] = useState(product?.meli_last_error || '');

  const meliBadge = getMeliBadgeInfo(meliStatus, meliItemId);
  const isMeliPublished = !!meliItemId;

  const isMeliActive =
    String(meliStatus || '').toLowerCase() === 'active' ||
    String(meliStatus || '').toLowerCase() === 'publicado';

  const isMeliPaused =
    String(meliStatus || '').toLowerCase() === 'paused' ||
    String(meliStatus || '').toLowerCase() === 'pausado';

  const hasMeliError =
    String(meliStatus || '').toLowerCase() === 'error' ||
    (!meliItemId && !!meliLastError);

  const showNotice = (notice) => {
    setAppNotice(notice);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombreIN: product?.nombre || '',
      categoriaIN: product?.Categoria || '',
      PesoIN: product?.Peso || '',
      marcaIN: product?.Marca || '',
      TempodeEntregaIN: product?.TempodeEntrega || '',
      TempoDdeEntregaAgotadoIN: product?.TempoDdeEntregaAgotado || '',
      descripcionIN: product?.descripcion || '',
      CodigoProveedorIN: product?.CodigoProveedor || '',
      numParteIN: product?.numParte || '',
      precioIN: product?.monto || '',
      precioOfertaIN: product?.montoOferta || '',
      identificadorAIN: product?.identificadorA || '',
      AlmacenIN: product?.almacen || '',
      AlmaUbiIN: product?.ubiAlma || '',
      estadoIN: String(product?.Estado || '1'),
      stokIN: product?.Stock || 1,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true);
      setAppNotice(null);

      try {
        let formData;

        if (pdfFile && pdfFile instanceof File) {
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
          montoOferta: check ? values.precioOfertaIN : 0,
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

        const saved = await saveOne(formData, datos, {
          closeAfterSave: submitMode === 'guardar'
        });

        if (saved && submitMode === 'guardar_sincronizar') {
          await ejecutarAccionMeli('sincronizar', {
            closeAfterAction: false,
            showSuccessNotice: true
          });
        }

      } catch (error) {
        console.error('Error guardando producto:', error);
        showNotice(getFriendlyAppError(error, 'No se pudieron guardar los cambios del producto.'));
      } finally {
        setLoading(false);
        setSubmitMode('guardar');
      }
    },
  });

  const eliminarImagenesMarcadas = async (idProducto) => {
    if (!idProducto || imagenesEliminadas.length === 0) return;

    for (const img of imagenesEliminadas) {
      await HTTP.post('/deleteImagen', {
        img,
        id: idProducto
      });
    }
  };

  const subirImagenesNuevas = async (idProducto) => {
    if (!idProducto) return;

    const nuevasImagenes = files.filter(file => !file.existing && file instanceof File);

    if (nuevasImagenes.length === 0) return;

    for (const file of nuevasImagenes) {
      const formDataImg = new FormData();
      formDataImg.append('file', file);

      const uploadImg = await HTTP.post('/Images', formDataImg, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const nombreImagen = limpiarNombreArchivo(uploadImg.data);

      if (!nombreImagen) {
        console.warn('No se recibió nombre de imagen:', uploadImg.data);
        continue;
      }

      await HTTP.post('/UpdateImagesA', {
        NameImg: nombreImagen,
        idA: idProducto
      });
    }
  };

  const saveOne = async (data, datos, options = {}) => {
    const { closeAfterSave = true } = options;

    try {
      let AllData = { ...datos };

      if (data !== 0) {
        const response = await HTTP.post("/updatePro", data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        AllData = {
          ...datos,
          PDF: limpiarNombreArchivo(response.data)
        };
      }

      const updateResponse = await HTTP.post("/updateProducto", AllData);

      const actualizado =
        updateResponse.data === "Actualizado" ||
        updateResponse.data?.status === "Actualizado" ||
        updateResponse.data?.ok === true;

      if (actualizado) {
        await eliminarImagenesMarcadas(datos.id);
        await subirImagenesNuevas(datos.id);

        setNotiCarrito("ArticuloUpdate");
        setActiveNoti(true);
        setImagenesEliminadas([]);

        showNotice({
          type: 'success',
          title: closeAfterSave ? 'Producto actualizado' : 'Producto guardado',
          message: closeAfterSave
            ? 'Los cambios se guardaron correctamente.'
            : 'Los cambios se guardaron correctamente. Ahora se sincronizará con Mercado Libre.'
        });

        if (head2misproductos) {
          head2misproductos("");
        }

        if (closeAfterSave) {
          setTimeout(() => {
            setActiveNoti(false);
            handleClose();
          }, 1300);
        }

        return true;
      }

      console.log("Respuesta updateProducto:", updateResponse.data);

      showNotice({
        type: 'warning',
        title: 'No se guardaron los cambios',
        message: updateResponse.data?.message || 'El servidor no confirmó la actualización del producto.'
      });

      return false;

    } catch (error) {
      console.error(error);
      showNotice(getFriendlyAppError(error, 'No se pudo actualizar el producto.'));
      return false;
    }
  };

  const ejecutarAccionMeli = async (accion, options = {}) => {
    const {
      closeAfterAction = false,
      showSuccessNotice = true
    } = options;

    try {
      setMeliActionLoading(true);
      setMeliLastError('');
      setAppNotice(null);

      const res = await HTTP.post('/accionMercadoLibreProducto', {
        idProducto: product.id,
        accion
      });

      const data = normalizeMeliActionResponse(res.data);

      console.log('Respuesta acción ML:', data);

      if (data.ok) {
        const newStatus = data.meli_status || data.status || meliStatus;
        const newItemId = data.meli_item_id || data.item_id || meliItemId;

        setMeliStatus(newStatus);
        setMeliItemId(newItemId);
        setMeliLastError('');

        setNotiCarrito("ArticuloUpdate");
        setActiveNoti(true);

        const successMessages = {
          publicar: {
            title: 'Producto publicado',
            message: 'El producto se publicó correctamente en Mercado Libre.'
          },
          sincronizar: {
            title: 'Guardado y sincronizado',
            message: 'Los cambios se guardaron en tu tienda y también se sincronizaron con Mercado Libre.'
          },
          pausar: {
            title: 'Publicación pausada',
            message: 'La publicación se pausó correctamente en Mercado Libre.'
          },
          reactivar: {
            title: 'Publicación reactivada',
            message: 'La publicación se reactivó correctamente en Mercado Libre.'
          },
          stock_cero: {
            title: 'Stock actualizado',
            message: 'El stock de Mercado Libre se actualizó a 0 correctamente.'
          }
        };

        if (showSuccessNotice) {
          showNotice({
            type: 'success',
            ...(successMessages[accion] || {
              title: 'Acción completada',
              message: 'Mercado Libre confirmó la operación correctamente.'
            })
          });
        }

        setTimeout(() => {
          setActiveNoti(false);

          if (closeAfterAction) {
            handleClose();
          }
        }, 2200);

        if (head2misproductos) {
          head2misproductos("");
        }

        return true;
      }

      const friendly = getFriendlyMeliError(data);

      setMeliStatus(data.meli_status || 'error');
      setMeliLastError(friendly.message);
      showNotice(friendly);

      if (head2misproductos) {
        head2misproductos("");
      }

      return false;

    } catch (error) {
      console.error('Error acción Mercado Libre:', error);

      const data = error?.response?.data;
      const friendly = data
        ? getFriendlyMeliError(data)
        : getFriendlyAppError(error, 'No se pudo conectar con Mercado Libre.');

      setMeliStatus('error');
      setMeliLastError(friendly.message);
      showNotice(friendly);

      return false;

    } finally {
      setMeliActionLoading(false);
      setConfirmAction(null);
    }
  };

  const confirmarAccionMeli = (accion) => {
    const texts = {
      pausar: {
        title: 'Pausar publicación',
        message: 'El producto dejará de estar disponible temporalmente en Mercado Libre. Podrás reactivarlo después.',
        confirmText: 'Sí, pausar',
        variant: 'warning'
      },
      reactivar: {
        title: 'Reactivar publicación',
        message: 'El producto volverá a estar disponible en Mercado Libre.',
        confirmText: 'Sí, reactivar',
        variant: 'success'
      },
      stock_cero: {
        title: 'Poner stock en 0',
        message: 'Mercado Libre mostrará este producto sin stock disponible. El stock de tu tienda no se modificará.',
        confirmText: 'Sí, poner en 0',
        variant: 'warning'
      }
    };

    setConfirmAction({
      accion,
      ...(texts[accion] || {
        title: 'Confirmar acción',
        message: '¿Deseas continuar con esta acción?',
        confirmText: 'Continuar',
        variant: 'primary'
      })
    });
  };

  useEffect(() => {
    setCheck(String(product?.Oferta ?? '') === '1');
    setEstatusCheck(String(product?.Estatus ?? '') === '1');

    setMeliStatus(product?.meli_status || '');
    setMeliItemId(product?.meli_item_id || '');
    setMeliLastError(product?.meli_last_error || '');

    setImagenesEliminadas([]);
    setAppNotice(null);
    setSubmitMode('guardar');

    if (product?.img) {
      const imageFiles = String(product.img)
        .split(',')
        .map(img => img.trim())
        .filter(Boolean)
        .map((img, index) => ({
          id: index,
          existing: true,
          name: img,
          preview: `https://ba-mro.mx/Server/Images/${img}`
        }));

      setFiles(imageFiles);
    } else {
      setFiles([]);
    }

    if (product?.PDF && product.PDF !== 'N/A') {
      setPdfFile({
        name: product.PDF,
        existing: true,
        preview: `https://ba-mro.mx/Server/PDFs/${product.PDF}`
      });
    } else {
      setPdfFile(null);
    }
  }, [product]);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file?.preview && !file.existing) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': []
    },
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      const total = files.length + acceptedFiles.length;

      if (total > 4) {
        showNotice({
          type: 'warning',
          title: 'Máximo 4 imágenes',
          message: 'Este producto solo puede tener hasta 4 imágenes. Elimina una imagen antes de agregar otra.'
        });
        return;
      }

      setFiles(prevFiles => [
        ...prevFiles,
        ...acceptedFiles.map(file =>
          Object.assign(file, {
            existing: false,
            preview: URL.createObjectURL(file)
          })
        )
      ]);

      showNotice({
        type: 'info',
        title: 'Imágenes listas',
        message: 'Las nuevas imágenes se guardarán cuando presiones “Guardar cambios”.'
      });
    }
  });

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: {
      'application/pdf': []
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        showNotice({
          type: 'warning',
          title: 'Solo un PDF',
          message: 'Este producto solo puede tener un archivo PDF.'
        });
        return;
      }

      setPdfFile(acceptedFiles[0]);

      showNotice({
        type: 'info',
        title: 'PDF listo',
        message: 'El nuevo PDF se guardará cuando presiones “Guardar cambios”.'
      });
    }
  });

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles[index];

      if (fileToRemove?.existing && fileToRemove?.name) {
        setImagenesEliminadas(prev => {
          if (prev.includes(fileToRemove.name)) return prev;
          return [...prev, fileToRemove.name];
        });

        showNotice({
          type: 'info',
          title: 'Imagen marcada para eliminar',
          message: 'La imagen se eliminará definitivamente cuando guardes los cambios.'
        });
      }

      if (fileToRemove?.preview && !fileToRemove.existing) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      return prevFiles.filter((_, i) => i !== index);
    });
  };

  const handleRemovePdf = () => {
    setPdfFile(null);

    showNotice({
      type: 'info',
      title: 'PDF removido',
      message: 'El cambio se aplicará cuando guardes el producto.'
    });
  };

  const inputProps = (name) => ({
    ...formik.getFieldProps(name),
    style: styles.input,
    isInvalid: formik.touched[name] && !!formik.errors[name]
  });

  const thumbs = files.map((file, index) => (
    <div key={`${file.preview}-${index}`} style={styles.imageThumb}>
      <img
        src={file.preview}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        alt=""
      />

      <Button
        variant="danger"
        size="sm"
        type="button"
        style={styles.deleteBtn}
        onClick={() => handleRemoveFile(index)}
      >
        <Trash size={14} />
      </Button>
    </div>
  ));

  const isBusy = loading || meliActionLoading;

  return (
    <>
      <Modal
        show={show}
        onHide={isBusy ? undefined : handleClose}
        size="xl"
        centered
        backdrop={isBusy ? 'static' : true}
      >
        <Modal.Header closeButton={!isBusy} style={styles.headerBox}>
          <div>
            <Modal.Title style={styles.title}>
              Editar producto
            </Modal.Title>
            <p style={styles.subtitle}>
              Actualiza información, imágenes, precio, inventario y publicación de Mercado Libre.
            </p>
          </div>
        </Modal.Header>

        <Modal.Body style={styles.modalBody}>
          <Form onSubmit={formik.handleSubmit}>
            <div style={styles.contentWrap}>
              <NoticeBox notice={appNotice} onClose={() => setAppNotice(null)} />

              <Row className="g-3">
                <Col lg={8} xs={12}>
                  <Card style={styles.sectionCard}>
                    <div style={styles.cardHeader}>
                      <h4 style={styles.cardTitle}>
                        <Info size={17} />
                        Información principal
                      </h4>
                      <p style={styles.cardHint}>
                        Datos visibles para tu tienda y referencia interna del producto.
                      </p>
                    </div>

                    <Card.Body style={styles.cardBody}>
                      <Row>
                        <Col lg={6} className="mb-3">
                          <Form.Group>
                            <Form.Label style={styles.fieldLabel}>Nombre</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Nombre del producto"
                              {...inputProps('nombreIN')}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.nombreIN}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col lg={6} className="mb-3">
                          <Form.Group>
                            <Form.Label style={styles.fieldLabel}>Categoría</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Categoría del producto"
                              {...inputProps('categoriaIN')}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.categoriaIN}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col lg={4} className="mb-3">
                          <Form.Group>
                            <Form.Label style={styles.fieldLabel}>Marca / Fabricante</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Marca"
                              {...inputProps('marcaIN')}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.marcaIN}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col lg={4} className="mb-3">
                          <Form.Group>
                            <Form.Label style={styles.fieldLabel}>Peso</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Peso"
                              {...inputProps('PesoIN')}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.PesoIN}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col lg={4} className="mb-3">
                          <Form.Group>
                            <Form.Label style={styles.fieldLabel}>Estado</Form.Label>

                            <div
                              style={{
                                display: 'flex',
                                gap: 8,
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: 12,
                                padding: 8
                              }}
                            >
                              <Form.Check
                                inline
                                label="Nuevo"
                                type="radio"
                                name="estadoIN"
                                id="estadoNuevo"
                                checked={String(formik.values.estadoIN) === '1'}
                                onChange={() => formik.setFieldValue('estadoIN', '1')}
                              />

                              <Form.Check
                                inline
                                label="Usado"
                                type="radio"
                                name="estadoIN"
                                id="estadoUsado"
                                checked={String(formik.values.estadoIN) === '2'}
                                onChange={() => formik.setFieldValue('estadoIN', '2')}
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col lg={6} className="mb-3">
                          <Form.Group>
                            <Form.Label style={styles.fieldLabel}>Tiempo de entrega</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Ej. 1 a 3 días hábiles"
                              {...inputProps('TempodeEntregaIN')}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.TempodeEntregaIN}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col lg={6} className="mb-3">
                          <Form.Group>
                            <Form.Label style={styles.fieldLabel}>Tiempo si se agota</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Ej. 2 semanas"
                              {...inputProps('TempoDdeEntregaAgotadoIN')}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.TempoDdeEntregaAgotadoIN}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col lg={12}>
                          <Form.Group>
                            <Form.Label style={styles.fieldLabel}>Descripción</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={5}
                              placeholder="Descripción del producto"
                              {...inputProps('descripcionIN')}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.descripcionIN}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card style={styles.sectionCard}>
                    <div style={styles.cardHeader}>
                      <h4 style={styles.cardTitle}>
                        <Image size={17} />
                        Imágenes del producto
                      </h4>
                      <p style={styles.cardHint}>
                        Máximo 4 imágenes. Las imágenes nuevas se guardan al presionar “Guardar cambios”.
                      </p>
                    </div>

                    <Card.Body style={styles.cardBody}>
                      <div {...getRootProps()} style={styles.dropzone}>
                        <input {...getInputProps()} />

                        <UploadCloud size={28} style={{ color: '#64748b', marginBottom: 8 }} />

                        <div style={{ fontWeight: 800, color: '#0f172a' }}>
                          Arrastra imágenes aquí
                        </div>

                        <div style={{ fontSize: 13, color: '#64748b' }}>
                          o haz clic para seleccionar archivos JPG o PNG
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 12,
                          marginTop: 16
                        }}
                      >
                        {thumbs}

                        {files.length === 0 && (
                          <div
                            style={{
                              border: '1px solid #e2e8f0',
                              borderRadius: 16,
                              padding: 18,
                              color: '#64748b',
                              background: '#f8fafc',
                              width: '100%'
                            }}
                          >
                            Este producto todavía no tiene imágenes.
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>

                  <Card style={styles.sectionCard}>
                    <div style={styles.cardHeader}>
                      <h4 style={styles.cardTitle}>
                        <FileText size={17} />
                        PDF del producto
                      </h4>
                      <p style={styles.cardHint}>
                        Ficha técnica, manual o documento relacionado.
                      </p>
                    </div>

                    <Card.Body style={styles.cardBody}>
                      <div {...getPdfRootProps()} style={styles.dropzone}>
                        <input {...getPdfInputProps()} />

                        <FileText size={28} style={{ color: '#64748b', marginBottom: 8 }} />

                        <div style={{ fontWeight: 800, color: '#0f172a' }}>
                          Arrastra un PDF aquí
                        </div>

                        <div style={{ fontSize: 13, color: '#64748b' }}>
                          o haz clic para seleccionar un archivo
                        </div>
                      </div>

                      {pdfFile && (
                        <div
                          style={{
                            marginTop: 14,
                            border: '1px solid #e2e8f0',
                            borderRadius: 14,
                            padding: 12,
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12
                          }}
                        >
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
                            <FileText size={18} style={{ color: '#475569' }} />
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontWeight: 800,
                                  fontSize: 14,
                                  color: '#0f172a',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {pdfFile.name}
                              </div>
                              <div style={{ fontSize: 12, color: '#64748b' }}>
                                PDF seleccionado
                              </div>
                            </div>
                          </div>

                          <Button variant="outline-danger" size="sm" type="button" onClick={handleRemovePdf}>
                            <Trash size={14} />
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4} xs={12}>
                  <div style={styles.sidebarSticky}>
                    <Card style={styles.sectionCard}>
                      <div style={styles.cardHeader}>
                        <h4 style={styles.cardTitle}>
                          Datos comerciales
                        </h4>
                      </div>

                      <Card.Body style={styles.cardBody}>
                        <Form.Group className="mb-3">
                          <Form.Label style={styles.fieldLabel}>Código SKU / ID</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Código del producto"
                            {...inputProps('CodigoProveedorIN')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.CodigoProveedorIN}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label style={styles.fieldLabel}>Número de parte</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Número de parte"
                            {...inputProps('numParteIN')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.numParteIN}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label style={styles.fieldLabel}>Stock</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            placeholder="1"
                            {...inputProps('stokIN')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.stokIN}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <div
                          style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: 14,
                            padding: 12,
                            background: estatusCheck ? '#ecfdf5' : '#f8fafc'
                          }}
                        >
                          <Form.Check
                            type="switch"
                            id="flexSwitchEstatus"
                            checked={estatusCheck}
                            onChange={() => setEstatusCheck(!estatusCheck)}
                            label={estatusCheck ? 'Producto activo en tienda' : 'Producto oculto en tienda'}
                          />
                        </div>
                      </Card.Body>
                    </Card>

                    <Card style={styles.sectionCard}>
                      <div style={styles.cardHeader}>
                        <h4 style={styles.cardTitle}>Mercado Libre</h4>
                        <p style={styles.cardHint}>
                          Administra la publicación sin mostrar errores técnicos al usuario.
                        </p>
                      </div>

                      <Card.Body style={styles.cardBody}>
                        <div style={styles.meliBox}>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>
                                Estado de publicación
                              </div>
                              <Badge
                                bg={meliBadge.bg}
                                text={meliBadge.textDark ? 'dark' : undefined}
                                className={meliBadge.border ? 'border mt-1' : 'mt-1'}
                              >
                                {meliBadge.label}
                              </Badge>
                            </div>

                            <i className="bi bi-shop" style={{ fontSize: 24, color: '#64748b' }} />
                          </div>

                          {meliItemId && (
                            <div className="mb-2">
                              <small className="text-muted d-block">ID Mercado Libre</small>
                              <strong>{meliItemId}</strong>
                            </div>
                          )}

                          {product?.meli_category_name && (
                            <div>
                              <small className="text-muted d-block">Categoría</small>
                              <strong>{product.meli_category_name}</strong>
                            </div>
                          )}
                        </div>

                        {hasMeliError && meliLastError && (
                          <div style={{ marginTop: 12 }}>
                            <NoticeBox
                              notice={{
                                type: 'warning',
                                title: 'Mercado Libre requiere atención',
                                message: meliLastError
                              }}
                            />
                          </div>
                        )}

                        {!isMeliPublished ? (
                          <Button
                            variant={hasMeliError ? "warning" : "primary"}
                            className="w-100 mt-2"
                            type="button"
                            disabled={isBusy}
                            onClick={() => ejecutarAccionMeli('publicar')}
                          >
                            {meliActionLoading ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Publicando...
                              </>
                            ) : hasMeliError ? (
                              <>
                                <i className="bi bi-arrow-repeat me-2"></i>
                                Reintentar publicación
                              </>
                            ) : (
                              <>
                                <i className="bi bi-shop me-2"></i>
                                Publicar en Mercado Libre
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="d-grid gap-2 mt-2">
                            {isMeliActive && (
                              <>
                                <Button
                                  variant="warning"
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => confirmarAccionMeli('pausar')}
                                >
                                  <i className="bi bi-pause-circle me-2"></i>
                                  Pausar publicación
                                </Button>

                                <Button
                                  variant="outline-warning"
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => confirmarAccionMeli('stock_cero')}
                                >
                                  <i className="bi bi-box-seam me-2"></i>
                                  Poner stock en 0
                                </Button>
                              </>
                            )}

                            {isMeliPaused && (
                              <Button
                                variant="success"
                                type="button"
                                disabled={isBusy}
                                onClick={() => confirmarAccionMeli('reactivar')}
                              >
                                <i className="bi bi-play-circle me-2"></i>
                                Reactivar publicación
                              </Button>
                            )}

                            <Button
                              variant="outline-primary"
                              type="button"
                              disabled={isBusy}
                              onClick={() => ejecutarAccionMeli('sincronizar')}
                            >
                              {meliActionLoading ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Procesando...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-arrow-repeat me-2"></i>
                                  Sincronizar ahora
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </Card.Body>
                    </Card>

                    <Card style={styles.sectionCard}>
                      <div style={styles.cardHeader}>
                        <h4 style={styles.cardTitle}>Precio</h4>
                      </div>

                      <Card.Body style={styles.cardBody}>
                        <div
                          style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: 14,
                            padding: 12,
                            background: check ? '#eff6ff' : '#f8fafc',
                            marginBottom: 14
                          }}
                        >
                          <Form.Check
                            type="switch"
                            id="flexSwitchOferta"
                            checked={check}
                            onChange={() => setCheck(!check)}
                            label={check ? 'Producto en oferta' : 'Sin oferta'}
                          />
                        </div>

                        <Form.Group className="mb-3">
                          <Form.Label style={styles.fieldLabel}>Precio regular</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="$0.00"
                            {...inputProps('precioIN')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.precioIN}
                          </Form.Control.Feedback>
                        </Form.Group>

                        {check && (
                          <Form.Group>
                            <Form.Label style={styles.fieldLabel}>Precio en oferta</Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="$0.00"
                              {...inputProps('precioOfertaIN')}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.precioOfertaIN}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}
                      </Card.Body>
                    </Card>

                    <Card style={styles.sectionCard}>
                      <div style={styles.cardHeader}>
                        <h4 style={styles.cardTitle}>Almacén</h4>
                      </div>

                      <Card.Body style={styles.cardBody}>
                        <Form.Group className="mb-3">
                          <Form.Label style={styles.fieldLabel}>Identificador almacén</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="ID almacén"
                            {...inputProps('identificadorAIN')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.identificadorAIN}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label style={styles.fieldLabel}>Almacén</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Almacén"
                            {...inputProps('AlmacenIN')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.AlmacenIN}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                          <Form.Label style={styles.fieldLabel}>Ubicación</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ubicación almacén"
                            {...inputProps('AlmaUbiIN')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.AlmaUbiIN}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>

            <div style={styles.footerBar}>
              <Button
                variant="light"
                type="button"
                onClick={handleClose}
                disabled={isBusy}
              >
                Cancelar
              </Button>

              <div className="d-flex gap-2 flex-wrap justify-content-end">
                <Button
                  variant="outline-primary"
                  type="submit"
                  disabled={isBusy}
                  onClick={() => setSubmitMode('guardar')}
                  style={{
                    borderRadius: 12,
                    paddingLeft: 20,
                    paddingRight: 20,
                    fontWeight: 800
                  }}
                >
                  {loading && submitMode === 'guardar' ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      Guardar cambios
                    </>
                  )}
                </Button>

                {isMeliPublished && (
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isBusy}
                    onClick={() => setSubmitMode('guardar_sincronizar')}
                    style={{
                      borderRadius: 12,
                      paddingLeft: 20,
                      paddingRight: 20,
                      fontWeight: 800
                    }}
                  >
                    {(loading || meliActionLoading) && submitMode === 'guardar_sincronizar' ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Sincronizando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-arrow-up me-2"></i>
                        Guardar y sincronizar ML
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </Modal.Body>

        <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
      </Modal>

      <ConfirmActionModal
        show={!!confirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.confirmText}
        variant={confirmAction?.variant}
        loading={meliActionLoading}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => ejecutarAccionMeli(confirmAction?.accion)}
      />
    </>
  );
};

export default EditProductModal;