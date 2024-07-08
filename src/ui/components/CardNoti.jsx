
export const CardNoti = ({ id, img, descripcion, monto, EliminarNotiFicacion,empresa,ContraOferta, setClickProducto, montoOferta, Oferta, ComprarProductoNoti}) => {
    function EliminarNoti(id){
        EliminarNotiFicacion(id)
    }
    function ComprarProductoN(id) {
        ComprarProductoNoti(id)
        
    }
    let images = img?.split(',');
    let imagenes = "";
    if(images?.[0] === undefined){
       imagenes = "Box.jpg"
    }else{
        imagenes = images?.[0]
    }
    return (
        <li>
            <div className="align-items-center FilaCarritoItem d-flex" style={{ "padding": "4px" }}>
                <div style={{"minWidth":"100px","maxWidth":"100px","textAlign":"center"}}>
                    <img src={`https://ba-mro.mx/Server/Images/${imagenes}`} alt="IMGCompra" className="GustosIMG" />
                </div>
                <div className=" ms-3" style={{ "width": "100%" }}>
                    <p className="text-secondary OpcionesFont"  style={{ "whiteSpace": "normal","margin":"0px" }} >El proveedor: <b className="text-dark OpcionesFont">BA-MRO</b>, realizo una contra oferta del producto: <b className="text-dark OpcionesFont">{descripcion}</b> </p>
                   
                       
                        <h6> Contra oferta: <b className="text-success">${ContraOferta}</b></h6>
                            {/* {
                                Oferta == 1 ? <h5> OFERTA: <b className="text-success">${montoOferta} </b></h5> : <></>
                            } */}
                      
                        <button className="btn btn-dark ms-4" onClick={() => ComprarProductoN(id)}>Aceptar</button>  
                        <button className="btn btn-secondary ms-4" onClick={() => EliminarNoti(id)}>Rechazar</button>    
                        {/* <i onClick={() => EliminarGusto(id)} className="bi bi-trash IconoBasura"></i> */}
                    
                </div>
            </div>
        </li>
    )
}