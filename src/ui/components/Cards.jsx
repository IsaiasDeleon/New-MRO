import { useNavigate } from "react-router-dom";

export const Card = ({ id, img, empresa, descripcion, estrellas, monto,Stock, setIdCard, Estado, setClickProducto, montoOferta, Oferta }) => {
    const navigate = useNavigate();
    function Gusto(id) {
        setIdCard(id);
    }
    let images = img?.split(',');
    let imagenes = "";
    if(images?.[0] === undefined){
       imagenes = "Box.jpg"
    }else{
        imagenes = images?.[0]
    }
    function ProductoShow(id) {
        setClickProducto(id)
        navigate('/Producto', {
            replace: true
        })
    }
    return (
        <div className="card contenedorC">
            <h6 style={{"position":"absolute","left":"10px","top":"10px"}} className={`fw-bold ${Estado === "1" ? "text-success" :"text-primary"} `}>{Estado === "1" ? "Nuevo" : "Semi-Nuevo"}</h6>
            <h6 style={{"position":"absolute","right":"10px","top":"10px"}} className={`fw-bold text-secondary `}>Stock: {Stock}</h6>
            <div className="text-center divImgMT">
                    <img src={`https://ba-mro.mx/Server/Images/${imagenes}`} onClick={() => ProductoShow(id)} alt="IMGCompra" className="ImgCard" />
            </div>
            <div className="content-txt TextCard">
                <div className="TextCardSeccion" >
                    <h6 className="text-secondary"></h6>
                    <div className="text-end">
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill ${(estrellas >= 1) ? 'text-warning' : ''}`}></i>
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill ${(estrellas >= 2) ? 'text-warning' : ''}`}></i>
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill ${(estrellas >= 3) ? 'text-warning' : ''}`}></i>
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill ${(estrellas >= 4) ? 'text-warning' : ''}`}></i>
                        <i style={{ "margin": "3px" }} className={`bi bi-star-fill ${(estrellas >= 5) ? 'text-warning' : ''}`}></i>
                    </div>
                </div>
                <h6 onClick={() => ProductoShow(id)} className="DescripcionCard" style={{"cursor":"pointer"}}>{descripcion}</h6>
                
                <div className="d-flex justify-content-between">
                    <div>
                        <h5> Precio: <b className="text-success">${monto} </b></h5>
                        {/* {
                            Oferta == 1 ? <h5> OFERTA: <b className="text-success">${montoOferta} </b></h5> : <></>
                        } */}
                    </div>
                    
                    <div className="text-center text-white IconTextCard">
                        <button onClick={() => { Gusto(id)}} className="btn btn-danger" style={{ "float": "right", "borderRadius": "40px" }}><i className="bi bi-heart-fill"></i></button>
                        {/* <button onClick={() => { Carrito(id) }} className="btnCarrito">
                            <i className="bi bi-cart-fill"></i> 
                                Agregar
                        </button> */}

                    </div>

                </div>

            </div>
        </div>
    )
}