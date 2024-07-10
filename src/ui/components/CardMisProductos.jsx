import { useState } from "react"
import axios from "axios";

import { useForm } from "../../hooks/useForm"
import { Noti } from "./Notificaciones";

const HTTP = axios.create({
    //baseURL: "https://ba-mro.mx/Server/Data.php"
    baseURL: "https://ba-mro.mx/Server/Data.php"
})
export const CardMisProductos = ({ id, img, descripcion, estrellas, monto, montoOferta, Stock, Estado, Estatus, nombre = "", Categoria, Oferta, saveOne, Fecha, empresa, Marca, CodigoProveedor, Peso, TempodeEntrega, TempoDdeEntregaAgotado, PDF, almacen, ubiAlma,identificadorA, numParte }) => {
    let O = Oferta === "0" ? false : true;
    const { onInputChange, nombreIN, descripcionIN, precioIN, precioOfertaIN, stokIN, estadoIN, categoriaIN, marcaIN, CodigoProveedorIN, PesoIN, TempodeEntregaIN, TempoDdeEntregaAgotadoIN,AlmacenIN,AlmaUbiIN } = useForm({
        nombreIN: nombre,
        descripcionIN: descripcion,
        precioIN: monto,
        precioOfertaIN: montoOferta,
        stokIN: Stock,
        estadoIN: Estado,
        categoriaIN: Categoria,
        marcaIN: Marca,
        CodigoProveedorIN: CodigoProveedor,
        PesoIN: Peso,
        TempodeEntregaIN: TempodeEntrega,
        TempoDdeEntregaAgotadoIN: TempoDdeEntregaAgotado,
        AlmacenIN:almacen,
        AlmaUbiIN:ubiAlma
    })

    const [check, setCheck] = useState(O)
    const [file, setFile] = useState(null);

    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    }
    function cambios(e) {
        onInputChange(e)
    }
    function message(mess) {
        setNotiCarrito(`${mess}`);
        setActiveNoti(true)
        setTimeout(() => {
            setActiveNoti(false)
        }, 5000);
    }
    function save(id) {

        if(categoriaIN === ""){
            message("Categoria");
            return;
        }
        if (stokIN === 0 || stokIN === undefined) {
            message("Stock")
            return;
        }
        if (descripcionIN === "") {
            message("descripcion")
            return;
        }
        if (precioIN === undefined || precioIN === 0) {
            message("Precio")
            return;
        }
        if (nombreIN === "") {
            message("Nombre")
            return;
        }
        if (TempodeEntregaIN === "") {
            message("TiempoEN")
            return;
        }
        if(marcaIN === ""){
            message("MarcaEN");
            return;
        }
        if(CodigoProveedorIN === ""){
            message("CodigoProveedor");
            return;
        }
        if(PesoIN === ""){
            message("PesoIN");
            return;
        }
        if(TempoDdeEntregaAgotadoIN === ""){
            message("TempoDdeEntregaAgotadoIN");
            return;
        }
        if(AlmacenIN === ""){
            message("Almacen");
            return;
        }
        if(AlmaUbiIN === ""){
            message("AlmacenUbi");
            return;
        }
        let pdf = document.getElementById(`file${id}`);
        let file = pdf.files[0];
        
        let formData;
        if (file === undefined) {
            formData = 0;
        } else {
            formData = new FormData();
            formData.set('file', file);
        }

        saveOne(formData, {
            Categoria: categoriaIN,
            Estado: estadoIN,
            Estatus: "1",
            Fecha,
            Oferta: check === false?0:1,
            Stock: stokIN,
            descripcion: descripcionIN,
            empresa,
            estrellas: estrellas,
            id,
            monto: precioIN,
            montoOferta: precioOfertaIN,
            nombre: nombreIN,
            marca: marcaIN,
            codigo: CodigoProveedorIN,
            peso: PesoIN,
            TiempoEn: TempodeEntregaIN,
            TiempoEnAg: TempoDdeEntregaAgotadoIN,
            PDF,
            almacen:AlmacenIN,
            almacenUbi:AlmaUbiIN
        }
        )

    }

    let imagenes = img?.split(',');

    
    function deleteImage(e,image,id) {
        HTTP.post("/deleteImagen",{"img":image, "id":id}).then((response) => {
            let element = e.target;
            let elementPadre = element.parentNode;
            elementPadre.remove();
        })
    }
    function inputDivChange(e,id) {
        const files = e.dataTransfer.files
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let formData;
            if (file === undefined) {
                formData = 0;
            } else {
                formData = new FormData();
                formData.set('file', file);
            }
            if (formData !== 0) {
                HTTP.post("/Images",formData).then((response) => {
                    HTTP.post("/UpdateImagesA",{"NameImg":response.data,"idA":id}).then((response) => {
                        setNotiCarrito(response.data);
                        setActiveNoti(true)
                        setTimeout(() => {
                            setActiveNoti(false)
                        }, 5000);
                    })
                })
            }
        }
    }
    function inputChange(id){
        let Images = document.getElementById(`Images${id}`);
        const files = Images?.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let formData;
            if (file === undefined) {
                formData = 0;
            } else {
                formData = new FormData();
                formData.set('file', file);
            }
            if (formData !== 0) {
                HTTP.post("/Images",formData).then((response) => {
                    HTTP.post("/UpdateImagesA",{"NameImg":response.data,"idA":id}).then((response) => {
                        setNotiCarrito(response.data);
                        setActiveNoti(true)
                        setTimeout(() => {
                            setActiveNoti(false)
                        }, 5000);
                    })
                })
            }
        }
    }
    return (
        <> 
            <div className="d-flex align-items-center DiseñoMisProductos " >
            <div style={{"maxWidth":"20%", "width":"30%"}}>
                    <h6 className="text-success">Id sistema: <b className="text-dark">{id}</b> </h6>
                    <h6 className="text-success">Id alamcén:<b className="text-dark"> {identificadorA} </b> </h6>
                    <h6 className="text-success">Num. parte:<b className="text-dark"> {numParte} </b> </h6>
                    <div className="input-div2" onDrop={(e) => inputDivChange(e,id)} >
                        <p>Arrastra y suelta tus fotos aquí o <button style={{ "padding": "5px", "background": "#000", "color": "#fff", "borderRadius": "5px" }}>selecciona el archivo</button></p>
                        <input onChange={() => inputChange(id)} id={`Images${id}`} type="file" className="file Images" multiple="multiple" accept="image/jpeg, image/png, image/jpg" />
                    </div>
                    <br />
                {
                    
                    imagenes?.map((image, index) => (
                        image !== "" ?(
                            <div style={{"width":"47%","display":"inline-block","border":"2px dashed #D7DBDD","margin":"3px"}} className="image" key={index}>
                            <img src={`https://ba-mro.mx/Server/Images/${image}`} alt="IMGCompra"  className="ImgMisProductos" />
                            <i style={{"float":"right","margin":"0"}} onClick={(e) => deleteImage(e, image, id)} className="bi bi-trash-fill h4"></i>
                        </div>
                        ):(
                            <></>
                        )
                       
                    ))
                }
                
            </div>
            <div className=" ms-3" style={{ "width": "100%" }}>
                <div className="m-2 InputsPrimeroGrid">
                    <div className="d-flex">
                        <div className="form-floating col-sm ">
                            <input id={`nombreIN${id}`} name={`nombreIN`} value={nombreIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Nombre del producto:<code>*</code></label>
                        </div>

                        <div className="form-floating col-sm ms-1 " >
                            <input name={`categoriaIN`} id={`categoriaIN${id}`} value={categoriaIN} onChange={(e) => cambios(e)} type="text"  className="form-control " />
                            <label className='fw-bold'>Categoría del producto:<code>*</code></label>
                        </div>
                    </div>


                    <div className="gridEstado" >
                        <div className="form-floating ">
                            <select className="form-select" id={`estadoIN${id}`} name="estadoIN" onChange={(e) => cambios(e)} value={estadoIN} aria-label="Floating label select example">
                                <option value="1">Nuevo</option>
                                <option value="2">Usado</option>
                            </select>
                            <label className='fw-bold'>Estado del producto:<code>*</code></label>
                        </div>

                        <div>
                            <label className="switch2">
                                <input type="hidden" value={check} id={`ofertaIN${id}`} />
                                <input type="checkbox" checked={check} name="ofertaIN" onChange={() => setCheck(!check)} />
                                <div className="slider2">
                                    <span>Sin oferta</span>
                                    <span>Con oferta</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="m-2 InputsSegundoGrid">
                    <div>
                        <div className="form-floating " style={{ "width": "100%" }}>
                            <textarea style={{ "width": "100%", "height": "auto" }} name={`descripcionIN`} id={`descripcionIN${id}`} value={descripcionIN} onChange={(e) => cambios(e)} type="text" className="form-control">
                            </textarea>
                            <label className='fw-bold'>Descripción:<code>*</code></label>
                        </div>
                    </div>

                    <div className="precioEstralla">
                        <div className="d-flex">
                            <div className="form-floating col-sm" style={{ "marginRight": "5px" }}>
                                <input name={`precioIN`} id={`precioIN${id}`} value={precioIN} onChange={(e) => cambios(e)} type="Number" min={1} className="form-control " />
                                <label className='fw-bold'>Precio:<code>*</code></label>
                            </div>
                            <div className="form-floating col-sm" style={{ "marginLeft": "5px" }}>
                                <input name={`precioOfertaIN`} id={`precioOfertaIN${id}`} value={precioOfertaIN} onChange={(e) => cambios(e)} type="Number" min={1} className="form-control " />
                                <label className='fw-bold'>Precio con oferta:</label>
                            </div>
                        </div>
                        <div className="divEstrellas text-center">
                            <h6 className="TitulosMenu">Valoración:<code>*</code></h6>
                            <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 1) ? 'text-warning' : ''}`}></i>
                            <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 2) ? 'text-warning' : ''}`}></i>
                            <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 3) ? 'text-warning' : ''}`}></i>
                            <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 4) ? 'text-warning' : ''}`}></i>
                            <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 5) ? 'text-warning' : ''}`}></i>
                        </div>
                    </div>
                </div>
                <div className="m-2 InputsTerceroGrid" >
                    <div className="d-flex"  style={{ "marginRight":"5px" }}>
                        <div className="form-floating margin-Inputs col-8" style={{ "marginLeft":"0" }}>
                            <input id={`marcaIN${id}`} name={`marcaIN`} value={marcaIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Marca/Fabricante:<code>*</code></label>
                        </div>
                        <div className="form-floating margin-Inputs col-4" >
                            <input id={`CodigoProveedorIN${id}`} name={`CodigoProveedorIN`} value={CodigoProveedorIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Código del proveedor (SKU/ID):<code>*</code></label>
                        </div>
                    </div>
                    
                    <div className="d-flex">
                        <div className="form-floating margin-Inputs col-sm" style={{ "width": "100%" }}>
                            <input id={`PesoIN${id}`} name={`PesoIN`} value={PesoIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Peso:<code>*</code></label>
                        </div>
                        <div className="form-floating margin-Inputs col-sm" style={{ "width": "100%" }}>
                            <input id={`TempodeEntregaIN${id}`} name={`TempodeEntregaIN`} value={TempodeEntregaIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Tiempo de entrega:<code>*</code></label>
                        </div>
                        <div className="form-floating margin-Inputs col-sm" style={{ "width": "100%" }}>
                            <input id={`TempoDdeEntregaAgotadoIN${id}`} name={`TempoDdeEntregaAgotadoIN`} value={TempoDdeEntregaAgotadoIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Tiempo de entrega en caso de agotarse:<code>*</code></label>
                        </div>
                    </div>
                    <div  style={{"display":"grid","gridTemplateColumns":"50% 50%"}}>
                        <div className="form-floating " style={{ "marginRight": "10px" }}>
                            <input id={`AlmacenIN${id}`} name={`AlmacenIN`} value={AlmacenIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Almacen:<code>*</code></label>
                        </div>

                        <div className="form-floating " style={{ "marginLeft": "10px" }}>
                            <input id={`AlmaUbiIN${id}`} name={`AlmaUbiIN`} value={AlmaUbiIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Ubicación almacen:<code>*</code></label>
                        </div>
                    </div>
                </div>
                <div className="m-2" style={{ "width": "100%" }}>
                    <div className="stockDIV">
                        <div className="form-floating " style={{ "width": "100%" }}>
                            <input name={`stokIN`} value={stokIN} id={`stokIN${id}`} onChange={(e) => cambios(e)} type="Number" min={1} className="form-control" />
                            <label className='fw-bold'>Stock:<code>*</code></label>
                        </div>

                        <div></div>
                        <div className="text-center">
                            <h5 style={{ "visibility": "hidden" }} className="TitulosMenu">Stock:</h5>
                            <label htmlFor={`file${id}`} className='btn btn-danger'><i className="bi bi-file-earmark-pdf-fill"></i> PDF</label>
                            <input type="file" onChange={handleChange} style={{ "display": "none" }} name="upload" id={`file${id}`} accept="application/pdf" />

                        </div>
                        <div >
                            <h5 style={{ "visibility": "hidden" }} className="TitulosMenu">Stock:</h5>
                            <button onClick={() => save(id)} className='btn btn-primary'><i className="bi bi-cloud-download-fill"></i> Guardar</button>
                        </div>
                    </div>

                </div>
            </div>

            </div>
            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
        </>
       
    )
}