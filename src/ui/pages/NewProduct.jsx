import { useContext, useEffect, useState } from "react";
import * as XLSX from 'xlsx';

import { useForm } from "../../hooks/useForm"
import { Fotos } from "../components/fotos";
import { AuthContext } from "../../auth/AuthContext";
import axios from "axios";
import { Noti } from "../components/Notificaciones";
const URLServer = "http://192.168.100.18:3020/"
const HTTP = axios.create({
    //baseURL: "https://ba-mro.mx/Server/Data.php"
    baseURL: "http://localhost/Server/Data.php"
})
export const NewProduct = ({ setMenu, setImagenesArray, imagesArray,busquedas }) => {
    let id = "New";
    let estrellas = 5;
    const { user } = useContext(AuthContext);
    let idU = user?.id;
    const { onInputChange, nombreIN, descripcionIN, precioIN, precioOfertaIN, stokIN, estadoIN, categoriaIN, marcaIN, CodigoProveedorIN, PesoIN, TempodeEntregaIN, TempoDdeEntregaAgotadoIN, identificadorAIN, numParteIN,AlmacenIN, AlmaUbiIN } = useForm({
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
        identificadorAIN:"",
        numParteIN:"",
        AlmacenIN:"", 
        AlmaUbiIN:""
    })
    useEffect(() => {
        setTimeout(() => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
                backdrop.style.display = 'none';
            });
        }, 100);
    }, []);
    const [check, setCheck] = useState(false)
    const [file, setFile] = useState(null);

    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    }
    function cambios(e) {
        onInputChange(e)
    }
    useEffect(() => {
        setMenu(2);
    }, [])

    function message(mess) {
        setNotiCarrito(`${mess}`);
        setActiveNoti(true)
        setTimeout(() => {
            setActiveNoti(false)
        }, 5000);
    }
    async function save() {
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
        if(identificadorAIN === ""){
            message("identificadorAIN");
            return;
        }
        if(numParteIN === ""){
            message("numParteIN");
            return;
        }
        if(categoriaIN === ""){
            message("Categoria");
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
        let Images = document.getElementById(`Images`);
        let nombre = [];
        for (let i = 0; i < imagesArray.length; i++) {
            let file = imagesArray[i];
            let formData;
            if (file === undefined) {
                formData = 0;
            } else {
                formData = new FormData();
                formData.set('file', file);
            }
            if (formData !== 0) {
                HTTP.post("/Images",formData).then((response) => {
                    
                    nombre.push(response.data);
                    if (nombre.length === imagesArray.length) {
                        let pdf = document.getElementById(`file${id}`);
                        let file2 = pdf.files[0];
                        let formData2;
                        if (file2 === undefined) {
                            formData2 = 0;
                        } else {
                            formData2 = new FormData();
                            formData2.set('file', file2);
                        }
                        if (formData2 !== 0) {

                            HTTP.post("/updatePro",formData2).then((response2) => {
                                let AllData = {
                                Categoria: categoriaIN,
                                Estado: estadoIN,
                                Estatus: "1",
                                Oferta: check ? 1:0,
                                Stock: stokIN,
                                descripcion: descripcionIN,
                                empresa: idU,
                                estrellas: estrellas,
                                img: nombre,
                                monto: precioIN,
                                montoOferta: precioOfertaIN,
                                nombre: nombreIN,
                                marca: marcaIN,
                                codigo: CodigoProveedorIN,
                                peso: PesoIN,
                                TiempoEn: TempodeEntregaIN,
                                TiempoEnAg: TempoDdeEntregaAgotadoIN,
                                PDF: response2.data,
                                identificadorA:identificadorAIN,
                                numParte:numParteIN,
                                almacen:AlmacenIN,
                                almacenUbi:AlmaUbiIN
                            }
                          
                            HTTP.post("/InsertarProducto", AllData).then((response3) => {
                               
                                if (response3.data === "Insertado") {
                                    setNotiCarrito("ArticuloInsertado");
                                    busquedas()
                                    setActiveNoti(true)
                                    setTimeout(() => {
                                        setActiveNoti(false)
                                    }, 5000);
                                }
                            })
                          
                        })  
                        } else {
                            let AllData = {
                                Categoria: categoriaIN,
                                Estado: estadoIN,
                                Estatus: "1",
                                Oferta: check ? 1:0,
                                Stock: stokIN,
                                descripcion: descripcionIN,
                                empresa: idU,
                                estrellas: estrellas,
                                img: nombre,
                                monto: precioIN,
                                montoOferta: precioOfertaIN,
                                nombre: nombreIN,
                                marca: marcaIN,
                                codigo: CodigoProveedorIN,
                                peso: PesoIN,
                                TiempoEn: TempodeEntregaIN,
                                TiempoEnAg: TempoDdeEntregaAgotadoIN,
                                PDF: "N/A",
                                identificadorA:identificadorAIN,
                                numParte:numParteIN,
                                almacen:AlmacenIN,
                                almacenUbi:AlmaUbiIN
                            }
                            HTTP.post("/InsertarProducto", AllData).then((response3) => {
                                if (response3.data === "Insertado") {
                                    busquedas()
                                    setNotiCarrito("ArticuloInsertado");
                                    setActiveNoti(true)
                                    setTimeout(() => {
                                        setActiveNoti(false)
                                    }, 5000);
                                }
                            })
                        }
                    }
                })
            } else {
                setNotiCarrito("IncluirFoto");
                setActiveNoti(true)
                setTimeout(() => {
                    setActiveNoti(false)
                }, 5000);
            }

        }
        if(imagesArray.length === 0){
            setNotiCarrito("IncluirFoto");
            setActiveNoti(true)
            setTimeout(() => {
                setActiveNoti(false)
            }, 5000);
        }
    }

    //Imagenes

    const input = document.getElementById("Images")
    const output = document.querySelector("output");
    function deleteImage(index) {
        let val = [...imagesArray];
        val.splice(index, 1);
        setImagenesArray(val)
    }
    function inputChange() {
        const files = input.files;
        
        let e = [];
        for (let i = 0; i < files.length; i++) {
            e.push(files[i]);
            if (i === files.length - 1) {
                let val = [];
                val.push(...imagesArray, ...e)
                setImagenesArray(val)
            }
        }

    }
    function inputDivChange(e) {
        e.preventDefault()
        let eF = [];
        const files = e.dataTransfer.files
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match("image")) continue;

            eF.push(files[i]);
            if (i === files.length - 1) {
                let val = [];
                val.push(...imagesArray, ...eF)
                setImagenesArray(val)
            }
            //   if (imagesArray.every(image => image.name !== files[i].name))

        }

    }
    function excelLoad(e){
        const file = e.target.files[0]; // Obtener el archivo Excel desde un input
        const reader = new FileReader();

        reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, {type: 'binary'});
        const sheetName = workbook.SheetNames[0]; // Obtener el nombre de la primera hoja del libro
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet); // Convertir la hoja a un objeto JSON
        let dataExcel = [];
        let InicioCelda = 7;
        for(let i = 1; i < jsonData.length; i++){
            if( i >= 2){
                let D1 = sheet[`A${InicioCelda}`]?.v;
                let D2 = sheet[`B${InicioCelda}`]?.v;
                let D3 = sheet[`C${InicioCelda}`]?.v;
                let D4 = sheet[`D${InicioCelda}`]?.v
                let D5 = sheet[`E${InicioCelda}`]?.v
                let D6 = sheet[`F${InicioCelda}`]?.v
                let D7 = sheet[`G${InicioCelda}`]?.v
                let D8 = sheet[`H${InicioCelda}`]?.v
                let D9 = sheet[`I${InicioCelda}`]?.v
                let D10 = sheet[`J${InicioCelda}`]?.v
                let D11 = sheet[`K${InicioCelda}`]?.v
                let D12 = sheet[`L${InicioCelda}`]?.v
                let D13 = sheet[`M${InicioCelda}`]?.v
                let D14 = sheet[`N${InicioCelda}`]?.v
                let D15 = sheet[`O${InicioCelda}`]?.v
                let D16 = sheet[`P${InicioCelda}`]?.v
                if(D1 === undefined){
                    alert(`La celda A${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D2 === undefined){
                    alert(`La celda B${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D3 === undefined){
                    alert(`La celda C${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D4 === undefined){
                    alert(`La celda D${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D5 === undefined){
                    alert(`La celda E${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D6 === undefined){
                    alert(`La celda F${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D7 === undefined){
                    D7 = "";
                }
                if(D8 === undefined){
                    alert(`La celda H${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D9 === undefined){
                    alert(`La celda I${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D10 === undefined){
                    D10 = "";
                }
                if(D11 === undefined){
                    D11 = "";
                }
                if(D12 === undefined){
                    alert(`La celda L${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D13 === undefined){
                    alert(`La celda M${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D14 === undefined){
                    alert(`La celda N${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D15 === undefined){
                    alert(`La celda O${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
                if(D16 === undefined){
                    alert(`La celda P${InicioCelda} se encuentra vacia favor de verificar su información`)
                    return;
                }
               
                let datos={D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13,D14,D15,D16,idU};
               
                dataExcel.push(datos);
                InicioCelda= InicioCelda+1;
           
            }
                
        }
        if(dataExcel.length > 0){
            HTTP.post("/DataExcel",dataExcel).then((response) => {
                alert(`${response.data} registros insertados`)
                busquedas()
            })
        }
        };

        reader.readAsBinaryString(file);
    }

    return (
        <>
            <div style={{"width":"100%","padding":"4px","marginBottom":"2px", "marginTop":"65px"}} className="alert alert-primary text-center " role="alert">
                <h5 className="text-center">Los campos con el simbolo (<code>*</code>) se consideran obligatorios</h5>
            </div>
            <div className="d-flex divNewProducto " >
                <div className="imagenesNewProduct">
                    <div class="input-div" onDrop={(e) => inputDivChange(e)} >
                        <p>Arrastra y suelta tus fotos aquí o <button style={{ "padding": "5px", "background": "#000", "color": "#fff", "borderRadius": "5px" }}>selecciona el archivo</button></p>
                        <input onChange={() => inputChange()} id="Images" name="Images" type="file" class="file" multiple="multiple" accept="image/jpeg, image/png, image/jpg" />
                    </div>
                    <br />
                    <output>
                        {
                            imagesArray.map((image, index) => (
                                <Fotos key={index} image={image} index={index} deleteImage={deleteImage} />
                            ))
                        }
                    </output>
                </div>
                <div className="DatosNewProduct" >
                    <div className="m-2 newProducto-gridEstrellas">
                        <div></div>
                        <div style={{ "display": "grid", "gridTemplateColumns": "65% 35% " }}>
                            <div >
                                <label style={{ "float": "right" }} className="switch2">
                                    <input type="hidden" value={check} id={`ofertaIN${id}`} />
                                    <input type="checkbox" checked={check} name="ofertaIN" onChange={() => setCheck(!check)} />
                                    <div className="slider2">
                                        <span>Sin oferta</span>
                                        <span>Con oferta</span>
                                    </div>
                                </label>
                            </div>
                            <div className="divEstrellas text-center  ">
                                <h6 className="TitulosMenu">Valoración:</h6>
                                <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 1) ? 'text-warning' : ''}`}></i>
                                <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 2) ? 'text-warning' : ''}`}></i>
                                <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 3) ? 'text-warning' : ''}`}></i>
                                <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 4) ? 'text-warning' : ''}`}></i>
                                <i style={{ "margin": "2px" }} className={`bi bi-star-fill TitulosMenu ${(estrellas >= 5) ? 'text-warning' : ''}`}></i>
                            </div>
                        </div>
                    </div>
                    <div className="m-2 newProducto-PrimerosInput">
                        <div className="form-floating " style={{ "width": "100%" }}>
                            <input id={`nombreIN${id}`} name={`nombreIN`} value={nombreIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Nombre del producto:<code>*</code></label>
                        </div>
                        
                        <div className="form-floating " style={{ "width": "100%" }}>
                            <input name={`categoriaIN`} id={`categoriaIN${id}`} value={categoriaIN} onChange={(e) => cambios(e)} type="text"  className="form-control " />
                            <label className='fw-bold'>Categoría del producto:<code>*</code></label>
                        </div>
                       
                        <div className="form-floating ">
                            <select className="form-select" id={`estadoIN${id}`} name="estadoIN" onChange={(e) => cambios(e)} value={estadoIN} aria-label="Floating label select example">
                                <option value="1">Nuevo</option>
                                <option value="2">Usado</option>
                            </select>
                            <label className='fw-bold'>Estado del producto:<code>*</code></label>
                        </div>

                    </div>

                    <div className="m-2" style={{ "display": "grid", "gridTemplateColumns": "100%" }}>
                        <div>
                            <div className="form-floating " style={{ "width": "100%" }}>
                                <textarea style={{ "width": "100%" }} name={`descripcionIN`} id={`descripcionIN${id}`} value={descripcionIN} onChange={(e) => cambios(e)} type="text" className="form-control">
                                </textarea>
                                <label className='fw-bold'>Descripción:<code>*</code></label>
                            </div>
                        </div>

                    </div>
                    <div className="m-2" style={{ "display": "grid", "gridTemplateColumns": "50% 50%" }}>
                        <div className="d-flex">
                            <div className="form-floating col-sm" style={{ "marginRight": "10px" }}>
                                <input name={`precioIN`} id={`precioIN${id}`} value={precioIN} onChange={(e) => cambios(e)} type="Number" min={1} className="form-control " />
                                <label className='fw-bold'>Precio:<code>*</code></label>
                            </div>
                            {
                                check && (
                                    <div className="form-floating col-sm" style={{ "marginLeft": "10px", "marginRight": "10px" }}>
                                        <input name={`precioOfertaIN`} id={`precioOfertaIN${id}`} value={precioOfertaIN} onChange={(e) => cambios(e)} type="Number" min={1} className="form-control " />
                                        <label className='fw-bold'>Precio con oferta:</label>
                                    </div>
                                )
                            }

                        </div>

                        <div className="d-flex">
                            <div className="form-floating col-sm " style={{ "marginLeft": "10px", "marginRight": "10px" }}>
                                <input id={`marcaIN${id}`} name={`marcaIN`} value={marcaIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                                <label className='fw-bold'>Marca/Fabricante:<code>*</code></label>
                            </div>
                            <div className="form-floating col-sm" style={{ "marginLeft": "10px" }}>
                                <input id={`CodigoProveedorIN${id}`} name={`CodigoProveedorIN`} value={CodigoProveedorIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                                <label className='fw-bold'>Código del proveedor (SKU/ID):<code>*</code></label>
                            </div>
                        </div>
                    </div>
                    <div className="m-2" style={{ "display": "grid", "gridTemplateColumns": "25% 25% 25% 25%" }}>

                        <div className="form-floating " style={{ "marginRight": "10px" }}>
                            <input id={`identificadorAIN${id}`} name={`identificadorAIN`} value={identificadorAIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Identificador almacen:<code>*</code></label>
                        </div>


                        <div className="form-floating " style={{ "marginLeft": "10px", "marginRight": "10px" }}>
                            <input name={`numParteIN`} value={numParteIN} id={`numParteIN${id}`} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Número de parte:<code>*</code></label>
                        </div>

                        <div className="form-floating "  style={{ "marginLeft": "10px", "marginRight": "10px" }}>
                            <input id={`PesoIN${id}`} name={`PesoIN`} value={PesoIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Peso:<code>*</code></label>
                        </div>


                        <div className="form-floating " style={{ "marginLeft": "10px" }}>
                            <input name={`stokIN`} value={stokIN} id={`stokIN${id}`} onChange={(e) => cambios(e)} type="Number" min={1} className="form-control" />
                            <label className='fw-bold'>Stock:<code>*</code></label>
                        </div>
                        </div>
                    <div className="m-2" style={{"display":"grid","gridTemplateColumns":"50% 50%"}}>
                        <div className="form-floating " style={{ "marginRight": "10px" }}>
                            <input id={`TempodeEntregaIN${id}`} name={`TempodeEntregaIN`} value={TempodeEntregaIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Tiempo de entrega:<code>*</code></label>
                        </div>

                        <div className="form-floating " style={{ "marginLeft": "10px" }}>
                            <input id={`TempoDdeEntregaAgotadoIN${id}`} name={`TempoDdeEntregaAgotadoIN`} value={TempoDdeEntregaAgotadoIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Tiempo de entrega en caso de agotarse:<code>*</code></label>
                        </div>
                    </div>
                    <div className="m-2" style={{"display":"grid","gridTemplateColumns":"50% 50%"}}>
                        <div className="form-floating " style={{ "marginRight": "10px" }}>
                            <input id={`AlmacenIN${id}`} name={`AlmacenIN`} value={AlmacenIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Almacen:<code>*</code></label>
                        </div>

                        <div className="form-floating " style={{ "marginLeft": "10px" }}>
                            <input id={`AlmaUbiIN${id}`} name={`AlmaUbiIN`} value={AlmaUbiIN} onChange={(e) => cambios(e)} type="text" className="form-control" />
                            <label className='fw-bold'>Ubicación almacen:<code>*</code></label>
                        </div>
                    </div>
                    <div className="m-2" style={{ "width": "100%" }}>
                        <div className="nuevoProductoGridBTN" >
                            <div></div>
                            <div className="text-center">
                                <h5 style={{ "visibility": "hidden" }} className="TitulosMenu">Stock:</h5>
                                <label htmlFor={`file${id}`} className='btn btn-danger btn-lg'><i className="bi bi-file-earmark-pdf-fill"></i> Subir datasheet</label>
                                <input type="file" onChange={handleChange} style={{ "display": "none" }} name="upload" id={`file${id}`} accept="application/pdf" />

                            </div>
                            <div className="text-end">
                                <h5 style={{ "visibility": "hidden" }} className="TitulosMenu">Stock:</h5>
                                <button onClick={() => save(id)} className='btn btn-primary btn-lg'><i className="bi bi-cloud-download-fill"></i> Guardar</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <div className="m-2 text-center">
                <label htmlFor={`ExcelFile`} className="btn btn-success mt-3">Carga de datos masivos</label>
                <input onChange={(e) => excelLoad(e)} id="ExcelFile" type="file" style={{ "display": "none" }} accept=".xlsx, .xls, .csv"/>
            </div>
            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
        </>
    )
}