
export const CardNotiAceptar = ({ id, img, descripcion, EliminarNotiFicacion,empresa,OfertaNoti, ComprarProductoNoti}) => {
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
                    <p className="text-secondary OpcionesFont"  style={{ "whiteSpace": "normal","margin":"0px" }} >El proveedor: <b className="text-dark OpcionesFont">BA-MRO</b>, <b className="text-success">acepto</b> su oferta del producto: <b className="text-dark OpcionesFont">{descripcion}</b> </p>
                        <h6> Precio: <b className="text-success">${OfertaNoti}</b></h6>
                        <button className="btn btn-dark ms-4" onClick={() => ComprarProductoN(id)}>Aceptar</button>  
                        <button className="btn btn-secondary ms-4" onClick={() => EliminarNoti(id)}>Rechazar</button>    
                </div>
            </div>
        </li>
    )
}