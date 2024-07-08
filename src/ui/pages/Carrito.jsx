import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CardCarrito } from '../components/CardCarrito';
import { Noti } from '../components/Notificaciones';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router';

const HTTP = axios.create({
    //baseURL: "https://ba-mro.mx/Server/Data.php"
    baseURL: "http://localhost/Server/Data.php"
})

export const Carrito = ({ NumElementsCarrito, setMenu }) => {
    const { user } = useContext(AuthContext);
    let idU = user?.id;
    const [elementsCarrito, setElementsCarrito] = useState([]);
    const [numArticulos, setNumArticulos] = useState(0);
    const [totalPrecio, setTotalPrecio] = useState(0);
    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();
    const [imgProducts, setImgProducts] = useState(true);
    // const [valueCP, setValueCP] = useState("");
    // const [valueUbi, setValueUbi] = useState("");
    const [Telefono, setTelefono] = useState("1");
    const [direccion, setDireccion] = useState("");
    const [CP, setCP] = useState("");
    // const [pais, setPais] = useState("");
    const [estado, setEstado] = useState(1);
    const [municipio, setMunicipio] = useState(1);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    // Estado para controlar si el modal está abierto o cerrado
    const [modalOpen, setModalOpen] = useState(false);

    const [OtraUbiCheck, setOtraUbiCheck] = useState(true);
    const [direccion2, setDireccion2] = useState("");
    const [CP2, setCP2] = useState("");
    const [estado2, setEstado2] = useState(1);
    const [municipio2, setMunicipio2] = useState(1);
    useEffect(() => {
        setTimeout(() => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.style.display = 'none';
            });
        }, 100);
    }, []);
    // const onInputChange2 = ({ target }) => {
    //     const { name, value } = target;
    //     switch (name) {
    //         case 'Ubicación':
    //             setValueUbi(value);
    //             break;
    //         case 'CP':
    //             setValueCP(value);
    //             break;

    //     }
    // }
    const handleCheckboxChange = () => {
        setOtraUbiCheck(!OtraUbiCheck);
    };
    //Function para obtener los elementos en el carrito
    function getItemCarrito() {
        if (idU !== undefined) {
            HTTP.post("/readCarrito", { "idU": idU }).then((response) => {
                if (response.data !== "") {
                    //Si la respuesta es correacta modificaremos el array con los objetos que obtenga desde la busqueda
                    setElementsCarrito(response.data);
                    setImgProducts(false);
                } else {
                    setElementsCarrito([]);
                    setImgProducts(true);
                }
            })
        }
    }
    const getD = async () => {
        let respuesta = await HTTP.post("/getDatosGenerales2", { "IdUsuario": idU }).then((response) => {
            return response?.data[0]
        })
        let respuesta2 = await HTTP.post("/getDatosGenerales2Facturacion", { "IdUsuario": idU }).then((response) => {
            return response?.data[0]
        })
        if (respuesta2 !== undefined) {
            setDireccion2(respuesta2.Direccion2);
            setCP2(respuesta2.CP2);
            setEstado2(respuesta2.estado);
            setMunicipio2(respuesta2.municipio);
        }
        if (respuesta !== undefined) {
            setTelefono(respuesta.telefono);
            setDireccion(respuesta.Direccion);
            setCP(respuesta.CP);
            // setPais("Mexico");
            setEstado(respuesta.estado);
            setMunicipio(respuesta.municipio);
            setLatitude(respuesta.latitude);
            setLongitude(respuesta.longitude)
        }

    }
    //Hacemos una peticion para obtener los primero resultados que mostraremos
    useEffect(() => {
        //Peticion para obtener los elemtos del carrito
        getItemCarrito();
        Totales()
        setMenu(2)
        getD()
    }, [])

    //Funcion para eliminar elemento del carrito enviamos el id del elemento clickeado
    function DeletItem(id) {
        if (idU !== undefined) {
            HTTP.post("/deleteItem", { "idU": idU, "id": id }).then((response) => {
                //Si la operacion se hizo correctamente nos regresara Eliminado
                if (response.data === "Eliminado") {
                    //Mandamos a llamar a la funcion de getItemCarrito para obtener la actualizacion de los elementos 
                    getItemCarrito()
                    //Llamamos a la funcion NumELementsCarrito para obtener ka actualizacion de los elementos en el carrito
                    NumElementsCarrito()
                    //Enviamos el mensaje a las notificaciones para mostrar la alerta al usuario
                    setNotiCarrito(response.data)
                    setActiveNoti(true)
                    setTimeout(() => {
                        setActiveNoti(false)
                    }, 4000);
                    //Llamamos a la funcion de totales para actualizar la cantida de productos y el total del precio
                    Totales()
                }
            })

        }
    }
    function Totales() {
        if (idU !== undefined) {
            HTTP.post("/readCarrito", { "idU": idU }).then((response) => {
                if (response.data !== "") {
                    let num = 0;
                    let total = 0;
                    //recorremos los datos que nos arrojo para poder hacer una sumatoria del precio y los elementos ya que el usuario tendra la opcion de elegir la cantidad de stock que necesite
                    response.data.map((elementsCarrito) => {
                        let element;
                        try {
                            element = document.getElementById(`VItem${elementsCarrito.id}`).value;
                        } catch (error) {
                            element = 1;
                        }

                        //Validamos que no venga vacio
                        if (element === "") {
                            element = 0;
                        }

                        // Lo parseamos ya que necesitamos un tipo numerico
                        element = parseInt(element);
                        let multi = 0;
                        if (elementsCarrito.Oferta === 1) {
                            multi = elementsCarrito.montoOferta * element;
                        } else {
                            multi = elementsCarrito.monto * element;
                        }

                        total = total + multi;

                        //Sumamos las cantidades que se píden 
                        num = num + element;
                    })
                    setNumArticulos(num)
                    setTotalPrecio(total.toFixed(2))
                }
            })

        }

    }
    function Cotizar() {
        let ids = [];
        let cantidadByProducto = [];
        elementsCarrito.map((element) => {
            ids.push(element.id);
            let elements = document.getElementById(`VItem${element.id}`).value;
            cantidadByProducto.push(elements);
        });
        if (idU !== undefined) {
            window.open(`https://ba-mro.mx/Server/Script.php?IP=${ids}&IU=${idU}&cantidades=${cantidadByProducto.toString()}`, '_blank');
        }

    }
    function Comprar() {
        closeModal()
        let ids = [];
        let cantidadByProducto = [];
        elementsCarrito.map((element) => {
            ids.push(element.id);
            let elements = document.getElementById(`VItem${element.id}`).value;
            cantidadByProducto.push(elements);
        });

        if (idU !== undefined) {
            window.open(`https://ba-mro.mx/Server/CorreoComprasCarrito.php?IP=${ids}&IU=${idU}&cantidades=${cantidadByProducto.toString()}&Telefono=${Telefono}&direccion=${direccion}&CP=${CP}&estado=${estado}&municipio=${municipio}&latitude=${latitude}&longitude=${longitude}`, '_blank');
        }


    }
    const navigate = useNavigate();
    function inicio() {
        navigate('/Inicio', {
            replace: true
        })
    }
    // Función para abrir el modal
    const openModal = () => {
        setModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setModalOpen(false);
    };
    function EditarPerfil() {
        closeModal()
        navigate('/Perfil', {
            replace: true
        })
    }
        return (
            <>
                <div className="contenedorCarrito" style={{ "overflowY": "auto" }}>
                    {elementsCarrito.map((elementsCarrito) => (
                        <CardCarrito key={elementsCarrito.id} {...elementsCarrito} DeletItem={DeletItem} variable={`VItem${elementsCarrito.id}`} Totales={Totales} />
                    ))}
                    {
                        imgProducts && (
                            <div className='CarritoVacio'>
                                <img src={`https://ba-mro.mx/Server/Images/CarritoVacio.png`} alt="IMGVacio" />
                                <h3>No hay productos agregados</h3>
                                <button className='btn btn-dark' onClick={() => inicio()}>Agregar nuevo producto</button>
                            </div>


                        )
                    }
                </div>
                <div className='ContenedorBottonTotales'>
                    <hr style={{ "width": "95%", "margin": "0", "marginLeft": "2.5%" }} />
                    <div className="d-flex justify-content-evenly align-items-center" style={{ "height": "95%" }}>
                        <div className=" text-center">
                            <h5 className='TotalesFont text-white'>Total de productos:</h5>
                            <h4 className="fw-bold text-secondary TotalesFont  text-white">{numArticulos}</h4>
                        </div>
                        <div className=" text-center">
                            <h5 className='TotalesFont text-white'>Precio total:</h5>
                            <h4 className=" fw-bold text-success TotalesFont">${totalPrecio}</h4>
                        </div>
                        <div className=" text-center">
                            <button className="btn btn-success btn-lg m-2" onClick={openModal} >Comprar</button>
                            <button className="btn btn-light btn-lg m-2" onClick={() => Cotizar()}>Cotizar</button>
                        </div>
                    </div>
                </div>
                <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
                {modalOpen && (
                    <div className="modal" style={{ "display": "block" }} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Compras</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="alert alert-success" role="alert">
                                        Realice el pago de <b>${totalPrecio}</b> al siguiente número de cuenta 123456789098765, por un total de <b>{numArticulos}</b> artículos. Una vez que el proveedor confirme su pago se le enviara su producto. se le enviara un correo con todos los datos de sus productos y proveedores
                                    </div>
                                    {/* <div class="form-group">
                 <label htmlFor="ubicacion">Ubicación:</label>
                 <input name="Ubicación" value={valueUbi} onChange={(e) => onInputChange2(e)}  type="text" className="form-control" id="ubicacion"/>
             </div>
             <div class="form-group">
                 <label htmlFor="codigo-postal">Código Postal:</label>
                 <input name="CP" value={valueCP} onChange={(e) => onInputChange2(e)}  className="form-control"id="codigo-postal" type="number"/>
             </div> */}
                                    {
                                        direccion !== "" ? (
                                            <div >
                                                <div className="alert alert-primary" role="alert" onClick={() => EditarPerfil()} >
                                                    Si quiere actualizar sus datos antes de comprar presione <b style={{ "textDecoration": "underline red", "cursor": "pointer" }}>aquí</b>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ flex: '1', padding: '10px' }}>
                                                        <h5 className='TitulosMenu'>País:</h5>
                                                        <h6 className="text-secondary OpcionesFont">México</h6>
                                                    </div>
                                                    <div style={{ flex: '1', padding: '10px' }}>
                                                        <h5 className='TitulosMenu'>Estado:</h5>
                                                        <h6 className="text-secondary OpcionesFont">{estado}</h6>
                                                    </div>
                                                    <div style={{ flex: '1', padding: '10px' }}>
                                                        <h5 className='TitulosMenu'>Municipio:</h5>
                                                        <h6 className="text-secondary OpcionesFont">{municipio}</h6>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ flex: '2', padding: '10px' }}>
                                                        <h5 className='TitulosMenu'>Dirección:</h5>
                                                        <h6 className="text-secondary OpcionesFont">{direccion}</h6>
                                                    </div>
                                                    <div style={{ flex: '1', padding: '10px' }}>
                                                        <h5 className='TitulosMenu'>Código postal:</h5>
                                                        <h6 className="text-secondary OpcionesFont">{CP}</h6>
                                                    </div>
                                                    <div style={{ flex: '1', padding: '10px' }}>
                                                        <h5 className='TitulosMenu'>Teléfono:</h5>
                                                        <h6 className="text-secondary OpcionesFont">{Telefono}</h6>
                                                    </div>
                                                </div>
                                                <div className="form-check text-center">
                                                    <input style={{ "float": "revert" }} onClick={handleCheckboxChange} id="defaultCheck1" className="form-check-input" type="checkbox" checked={OtraUbiCheck} />
                                                    <label onClick={handleCheckboxChange} className="form-check-label datosPerfil h6" >
                                                        La dirección de envio es igual a la de facturación
                                                    </label>
                                                </div>
                                                {
                                                    OtraUbiCheck === false ?
                                                        (
                                                            direccion2 !== "" ?
                                                                <>
                                                                    <div className="alert alert-primary text-center" role="alert">
                                                                        Ubicación de facturación
                                                                    </div>
                                                                    <div className="selectoresPerfil">
                                                                        <div style={{ flex: '1', padding: '10px' }}>
                                                                            <h5 className='TitulosMenu'>País:</h5>
                                                                            <h6 className="text-secondary OpcionesFont">México</h6>
                                                                        </div>
                                                                        <div style={{ flex: '1', padding: '10px' }}>
                                                                            <h5 className='TitulosMenu'>Estado:</h5>
                                                                            <h6 className="text-secondary OpcionesFont">{estado2}</h6>
                                                                        </div>
                                                                        <div style={{ flex: '1', padding: '10px' }}>
                                                                            <h5 className='TitulosMenu'>Municipio:</h5>
                                                                            <h6 className="text-secondary OpcionesFont">{municipio2}</h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className="formularioPerfil">
                                                                        <div style={{ flex: '2', padding: '10px' }}>
                                                                            <h5 className='TitulosMenu'>Dirección:</h5>
                                                                            <h6 className="text-secondary OpcionesFont">{direccion2}</h6>
                                                                        </div>
                                                                        <div style={{ flex: '1', padding: '10px' }}>
                                                                            <h5 className='TitulosMenu'>Código postal:</h5>
                                                                            <h6 className="text-secondary OpcionesFont">{CP2}</h6>
                                                                        </div>

                                                                    </div>
                                                                </> :
                                                                <div className="alert alert-danger text-center" role="alert" onClick={() => EditarPerfil()}>
                                                                    La ubicación de facturación no ha sido ingresada, favor de ir a su <b style={{ "textDecoration": "underline red", "cursor": "pointer" }}>perfil</b> e ingresarla
                                                                </div>
                                                        )
                                                        : <></>
                                                }
                                            </div>
                                        ) :
                                            (
                                                <div className="alert alert-primary" role="alert" onClick={() => EditarPerfil()}>
                                                    Sus datos no han sido proporcionados, le sugerimos que vaya a su <b style={{ "textDecoration": "underline red", "cursor": "pointer" }}>perfil</b> y los ingrese
                                                </div>
                                            )
                                    }

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Cancelar</button>
                                    <button type="button" onClick={() => Comprar()} className="btn btn-primary" data-bs-dismiss="modal" disabled={direccion !== "" ? false : true} >Comprar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
            </>

        )
    }