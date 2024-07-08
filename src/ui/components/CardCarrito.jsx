import { useForm } from "../../hooks/useForm"

export const CardCarrito = ({ id, img, empresa, descripcion, estrellas, monto, DeletItem, variable, Totales, Stock, montoOferta, Oferta }) => {
    const { onInputChange, v } = useForm({
        v: 1
    })
    let images = img?.split(',');
    let imagenes = "";
    if(images?.[0] === undefined){
       imagenes = "Box.jpg"
    }else{
        imagenes = images?.[0]
    } 
    function cambios(e) {
        onInputChange(e)
        Totales(e);
    }
    return (
        <div className="d-flex align-items-center FilaCarritoItem" >
            <div style={{"width":"12%", "textAlign":"center"}}>
                <img src={`https://ba-mro.mx/Server/Images/${imagenes}`} alt="IMGCompra" className="ImgCard2" />
            </div>
            <div className=" ms-3" style={{ "width": "88%" }}>
                <div className="d-flex justify-content-between" style={{ "width": "100%" }}>
                    <div className="col-sm divEmpresa">
                        <h5 className="TitulosMenu">Descripción:</h5>
                        <h6 className="text-secondary OpcionesFont" >{descripcion}</h6>
                    </div>
                    <div className="d-flex ContenedorCantidadDineroEstrellas">
                        <div className="col-sm w100">
                            <h5 className="TitulosMenu">Cantidad:</h5>
                            <input name={`v`} id={variable} value={v} onChange={(e) => cambios(e)} type="Number" min={1} max={Stock} className="form-control text-center FilaInput" />
                        </div>
                        <div className="col-sm w100">
                            <h5 className="TitulosMenu">Precio C/U:</h5>
                            <h5 className="fw-bold text-success TitulosMenu">${monto} </h5>
                            {
                                Oferta === 1 ? <h6> OFERTA: <b className="text-success">${montoOferta} </b></h6> : <></>
                            }
                        </div>
                        <div className="col-sm w100 divEstrellas">
                            <h5 className="TitulosMenu">Valoración:</h5>
                            <i style={{ "margin": "3px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 1) ? 'text-warning' : ''}`}></i>
                            <i style={{ "margin": "3px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 2) ? 'text-warning' : ''}`}></i>
                            <i style={{ "margin": "3px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 3) ? 'text-warning' : ''}`}></i>
                            <i style={{ "margin": "3px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 4) ? 'text-warning' : ''}`}></i>
                            <i style={{ "margin": "3px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 5) ? 'text-warning' : ''}`}></i>
                        </div>
                    </div>

                </div>
                <div className="d-flex justify-content-end">
                    <div className="d-flex justify-content-around" style={{ "width": "20%" }}>
                        <div className="m-auto text-center">
                            <h5 className="OpcionesFont">Stock:</h5>
                            <h6 className="text-secondary OpcionesFont">{Stock}</h6>
                        </div>
                        <i className="bi bi-trash IconoBasura" onClick={() => { DeletItem(id) }}></i>
                    </div>

                </div>

            </div>

        </div>
    )
}