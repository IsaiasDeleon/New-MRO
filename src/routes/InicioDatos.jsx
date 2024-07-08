import { useContext, useEffect, useState } from "react";
import { Head } from "../ui/components/Head";
import { Menu } from "../ui/components/Menu";
import { Inicio } from "../ui/pages";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import { Noti } from "../ui/components/Notificaciones";
import { Head2 } from "../ui/components/Head2";
import { Carrito } from "../ui/pages/Carrito";
import { EditarPerfil } from "../ui/pages/EditarPerfil";
import { Producto } from "../ui/pages/Producto";
import { Navigate, Route, Routes } from "react-router";
const URLServer = "http://192.168.100.21:3020/"
//ESTE YA NO SIRVE
export const IncioD = () => {
        //Obtenemos el id logueado
        const { user } = useContext( AuthContext );
        let idU = user?.id;
       
        //Global estado de menu
        const [estadoMenu, setEstadoMenu] = useState(false);
        //Get data 
        const [data, setData] = useState([])
        //Data de filtros
        const [dataFiltrado, setDataFiltrado] = useState([])
        //Get Numero de articulos en el carrito
        const [numArticulos, setNumArticulos] = useState(0);
        //Get numero de articulos en gustos
        const [numGustos, setNumGustos] = useState(0);
        //Elementos de la tabla gustos
        const [elemntsGustos, setElementsGustos] = useState([]);
        const [notiCarrito, setNotiCarrito] = useState();
        const [activeNoti, setActiveNoti] = useState();

        //Identificador para ver si quitamos el menu y cambiamos de head
        const [menu, setMenu] = useState(false);
        //ELemento clickeado PRODUCTO
        const [clickProducto, setClickProducto] = useState();

        const [idCard, setIdCard] = useState();
        const [idCard2, setIdCard2] = useState();
       
        function NumElementsGustos(){
            axios.post(URLServer + "GetNumGustos",{"id":idU}).then((response) => {
                setNumGustos(response.data)
            })
        }
        function NumElementsCarrito() {
            //Peticion para obtener el numero de productosque tiene en el carrito
            axios.post(URLServer + "GetNumCarrito",{"id":idU}).then((response) => {
                setNumArticulos(response.data)
            })
        }
        function ElementsGustos(){
            axios.post(URLServer + "GetElementsGustos", {"id":idU}).then((response) => {
                setElementsGustos(response.data);
            })
        }
        function DeleteItemGustos(id) {
            axios.post(URLServer + "deleteItemGustos", {"idU":idU, "id": id }).then((response) => {
                //Si la operacion se hizo correctamente nos regresara Eliminado
                if (response.data == "EliminadoGusto") {
                    //Mandamos a llamar a la funcion de getItemCarrito para obtener la actualizacion de los elementos 
                    ElementsGustos()
                    //Llamamos a la funcion NumELementsCarrito para obtener ka actualizacion de los elementos en el carrito
                    NumElementsGustos()
                    //Enviamos el mensaje a las notificaciones para mostrar la alerta al usuario
                    setNotiCarrito(response.data)
                    setActiveNoti(true)
                    setTimeout(() => {
                        setActiveNoti(false)
                    }, 4000);
                }
            });
        }
        useEffect(() => {
            NumElementsCarrito();
            NumElementsGustos();
            ElementsGustos();
        }, [idU])
    
        useEffect(() => {
            //Comrpobamos que el idCard no venga vacio
            if (idCard != undefined) {
                if(idU == undefined){ 
                    return;
                }
                //Peticion para agregar un nuevo producto al carrito
                axios.post(URLServer + "gustos", { "idU": idU,"Num": idCard }).then((response) => {
                    //Actualizamos el mensaje que nos envio el server para mostarr la alerta
                    setNotiCarrito(response.data)
                    //Activamos y desactivamos la alerta para tener una animacion
                    setActiveNoti(true)
                    setTimeout(() => {
                        setActiveNoti(false)
                    }, 4000);
                    NumElementsGustos();
                    ElementsGustos();
                })
            }
        }, [idCard])
    
        useEffect(() => {
            //Comprobamos que el idCar2 no este vacio
            if(idCard2 !== undefined){
                if(idU === undefined){
                    return;
                }
                axios.post(URLServer + "carrito", {"idU":idU,"Num":idCard2}).then((response) => {
                    //Actualizamo el mensaje que nos envio el server para mostrar en pantalla
                    setNotiCarrito(response.data);
                    //Activamos y desactivamos la alerta para atener una animacion
                    setActiveNoti(true);
                    setTimeout(() => {
                        setActiveNoti(false)
                    }, 4000);
                    NumElementsCarrito();
                })
            }
        },[idCard2])
    return (
        <>
            <Routes>
                <Route path="Inicio" element={<Inicio data={data} dataFiltrado={dataFiltrado} setData={setData} NumElementsCarrito={NumElementsCarrito} setMenu={setMenu} NumElementsGustos={NumElementsGustos} ElementsGustos={ElementsGustos} />} />
                <Route path="Carrito" element={<Carrito NumElementsCarrito={NumElementsCarrito} setMenu={setMenu} />} />
                <Route path="Perfil" element={<EditarPerfil numArticulos={numArticulos} setMenu={setMenu} />} />
                <Route path="Producto" element={<Producto setIdCard={setIdCard} setIdCard2={setIdCard2} />} />
                {/* <Route path="/*" element={<Navigate to={"Inicio"} />} /> */}
            </Routes>
            {
                menu 
                ? (
                    <>
                        <Head setEstadoMenu={setEstadoMenu} numArticulos={numArticulos} numGustos={numGustos} elemntsGustos={elemntsGustos} DeleteItemGustos={DeleteItemGustos}/>
                        <Menu estado={estadoMenu} setEstadoMenu={setEstadoMenu} setDataFiltrado={setDataFiltrado} />
                    </>
                )
                :(
                    <Head2 numArticulos={numArticulos} numGustos={numGustos} elemntsGustos={elemntsGustos} DeleteItemGustos={DeleteItemGustos} />
                )
            }
             <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />

            {/* <Inicio data={data} dataFiltrado={dataFiltrado} setData={setData} NumElementsCarrito={NumElementsCarrito} setMenu={setMenu} NumElementsGustos={NumElementsGustos} ElementsGustos={ElementsGustos} />
            <Head setEstadoMenu={setEstadoMenu} numArticulos={numArticulos} numGustos={numGustos} elemntsGustos={elemntsGustos} DeleteItemGustos={DeleteItemGustos} />
            <Menu estado={estadoMenu} setEstadoMenu={setEstadoMenu} setDataFiltrado={setDataFiltrado} />  
            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} /> */}
        </>
    )
}