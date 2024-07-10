import { useContext, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { Noti } from "../components/Notificaciones";
const URLServer = "http://192.168.100.18:3020/"
const HTTP = axios.create({
    //baseURL: "https://ba-mro.mx/Server/Data.php"
    baseURL: "https://ba-mro.mx/Server/Data.php"
})
export const Producto = ({setIdCard, setIdCard2, clickProducto, setMenu, setClickProducto}) => {

    const [imagenes, setImagenes] = useState(`${clickProducto}`);
    const [onClickImagen, setOnClickImagen] = useState(1);
    const [datosProducto, setDatosProducto] = useState([]);
    const [valueOferta, setValueOferta] = useState(0);
    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();
    const [arregloImages, setArregloImages] = useState([]);

    const { user } = useContext(AuthContext)
    let idU = user?.id;
    useEffect(() => {
        setMenu(2);
        if(clickProducto == undefined){
            const idProduct = JSON.parse( localStorage.getItem('idProduct') );
            setClickProducto(idProduct)
            
        }
    },[])
    useEffect(() => {
        setTimeout(() => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.style.display = 'none';
            });
        }, 100);
    }, []);
    useEffect(() => {
        if(clickProducto !== undefined){
            HTTP.post("/GetProducto", {"idProduct":clickProducto}).then((response) => {
              
                setDatosProducto(response.data)
                let images = response.data[0]?.img?.split(',');
                let valueImagen = "";
                if(images?.[0] == undefined){
                    valueImagen = "Box.jpg"
                }else{
                    valueImagen = images[0]
                }
                
                setImagenes(valueImagen);
                setOnClickImagen(images[0]);
                setArregloImages(images)
                if(response.data[0]?.Oferta == 1){
                    setValueOferta(response.data[0]?.montoOferta - 1 )
                }else{
                    setValueOferta(response.data[0]?.monto - 1 )
                }
            })
        }
    },[clickProducto]);
    function createMail(){
        fetch(`https://ba-mro.mx/Server/Correo.php?IP=${clickProducto}&IU=${idU}&Oferta=${valueOferta}`)
            .then(response => {
                setNotiCarrito("CorreoEnviado")
                setActiveNoti(true)
                setTimeout(() => {
                    setActiveNoti(false)
                }, 4000);
            })
            .catch(error => {
                // Ocurrió un error en la solicitud AJAX
                // Realiza cualquier acción de manejo de errores aquí si es necesario
            });


        // window.open(`https://ba-mro.mx/Server/Correo.php?IP=${clickProducto}&IU=${idU}&Oferta=${valueOferta}`, '_blank');
             
 
    }
    const onInputChange2 = ({ target }) => {
        const { name, value } = target;
        switch (name) {
            case 'Oferta':
                setValueOferta(value);
                break;
           
        }
    }
       
    function CreatePDF(){
        window.open(`https://ba-mro.mx/Server/PDF.php?IP=${clickProducto}&IU=${idU}`, '_blank');
    }
    
    const handleDownload = () => {
        if(datosProducto?.[0]?.PDF){
            window.open(`https://ba-mro.mx/Server/PDF/${datosProducto?.[0]?.PDF}`, '_blank');
        }
        
        // axios.post(URLServer+'download',{
        //     pdf:datosProducto?.[0]?.PDF
        // }, {
        //     responseType: 'blob'
        // }).then(response => {
        //   const url = window.URL.createObjectURL(new Blob([response.data]));
    
        //   const link = document.createElement('a');
        //   link.href = url;
        //   link.setAttribute('download', 'archivo.pdf');
          
        //   document.body.appendChild(link);
          
        //   link.click();
        // });
      }
      return (
        <>
         <div className="divProducto">
           <div className="divGrid">
                <div className="text-center">
                    <div  style={{"display": "flex","flexDirection": "column", "position":"absolute", "zIndex":"1"}}>
                    {
                        arregloImages.map((data) => (
                            <img src={`https://ba-mro.mx/Server/Images/${data}`} onClick={(e) => {setImagenes(`${data}`); setOnClickImagen(`${data}`)}} alt="IMGCompra" className={`m-1 imagenesProductos ${`${onClickImagen}` === `${data}` ? "BorderImagenSelect":"" }`}  />
                        ))
                    }
                    </div>
                    <img src={`https://ba-mro.mx/Server/Images/${imagenes}`} alt="IMGCompra" className="ProductoImg" />
                </div>
                <div className="mt-2">
                    <h4>{datosProducto?.[0]?.descripcion}</h4>
                    <div className="text-end">
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill h4 ${(datosProducto?.[0]?.estrellas >= 1) ? 'text-warning' : ''}`}></i>
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill h4 ${(datosProducto?.[0]?.estrellas >= 2) ? 'text-warning' : ''}`}></i>
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill h4 ${(datosProducto?.[0]?.estrellas >= 3) ? 'text-warning' : ''}`}></i>
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill h4 ${(datosProducto?.[0]?.estrellas >= 4) ? 'text-warning' : ''}`}></i>
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill h4 ${(datosProducto?.[0]?.estrellas >= 5) ? 'text-warning' : ''}`}></i>
                    </div>
                    <hr/>
                    <h6>Marca/Fabricante: <b className="text-secondary"> {datosProducto?.[0]?.Marca}</b></h6>
                    <h6>Código del proveedor (SKU/ID): <b className="text-secondary"> {datosProducto?.[0]?.CodigoProveedor}</b></h6>
                    <h6>Peso aproximado:<b className="text-secondary"> {datosProducto?.[0]?.Peso}</b></h6>
                    <h6>Estado:<b className={`${(datosProducto?.[0]?.Estado === "1")?"text-success":"text-primary"}`}> {(datosProducto?.[0]?.Estado === "1")?"Nuevo":"Semi-nuevo" }</b></h6>
                    <h6>Estatus:<b className="text-secondary"> Disponible</b></h6>
                    <h6>Tiempo de entrega: <b className="text-secondary"> {datosProducto?.[0]?.TempodeEntrega}</b></h6>
                    <h6>Tiempo de entrega en caso de agotarse: <b className="text-secondary">{datosProducto?.[0]?.TempoDdeEntregaAgotado}</b></h6>
                    <h6>Ficha técnica: <b onClick={() => handleDownload()} className="text-danger" style={{"textDecoration":"underline"}}> {datosProducto?.[0]?.PDF}</b></h6>
                    <hr/>
                    <div className="contenedorBotones">
                        <div>
                        <h4> Precio: <b className="text-success">${datosProducto?.[0]?.monto} MXN</b></h4>
                            {/* {
                                datosProducto?.[0]?.Oferta == 1 ? <h4 className="fw-bold"> OFERTA: <b className="text-success">${datosProducto?.[0]?.montoOferta} </b></h4> : <></>
                            } */}
                        </div>
                        <div className="text-end">
                            {/* <button className="btn btn-success m-1">¡Cómpralo ahora!</button> */}
                            <button className="btn btn-primary m-1"  data-bs-toggle="modal" data-bs-target="#exampleModal">Hacer oferta</button>
                            <button className="btn btn-dark m-1" onClick={(e) => {setIdCard2(clickProducto)}}>Agregar al carrito de compras</button>
                            <button className="btn btn-secondary m-1" onClick={(e) => { setIdCard(clickProducto)}}>Agregar a lista de favoritos</button>
                            {
                                idU && (
                                    <button className="btn btn-success m-1" onClick={() => CreatePDF()}>Cotizar</button>
                                )
                            } 
                        </div>
                        
                    </div>
                    <div style={{"background":"#EAEDED", "borderRadius":"10px"}}>
                            <div style={{"padding":"20px"}}>
                                <h6 style={{"fontWeight":"400"}}><b>Respira tranquilo.</b> Se aceptan devoluciones.</h6>
                                <h6 style={{"fontWeight":"400"}}><b >La gente está viendo este artículo.</b> 5 personas agregaron esto a su lista de favoritos.</h6>
                            </div>
                        </div>
                    <hr/>
                  
                    
                </div>
           </div>
          
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Ofertar por el producto</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <label>Oferta:</label>
                    <input name="Oferta" value={valueOferta} onChange={(e) => onInputChange2(e)}  className="form-control" type="number"/>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" onClick={() => createMail()} className="btn btn-primary" data-bs-dismiss="modal">Ofertar</button>
                </div>
                </div>
            </div>
            </div>
         </div>
         <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
        </>
    )
}