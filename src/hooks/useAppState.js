import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";

const HTTP = axios.create({
    baseURL: "http://localhost/Server/Data.php"
});

export const useAppState = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const idU = user?.id;

    const [estadoMenu, setEstadoMenu] = useState(false);
    const [data, setData] = useState([]);
    const [dataFiltrado, setDataFiltrado] = useState([]);
    const [numArticulos, setNumArticulos] = useState(0);
    const [numGustos, setNumGustos] = useState(0);
    const [numNoti, setNumNoti] = useState(0);
    const [elemntsNoti, setElementsNoti] = useState([]);
    const [elemntsGustos, setElementsGustos] = useState([]);
    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState(false);
    const [menu, setMenu] = useState(1);
    const [clickProducto, setClickProducto] = useState();
    const [idCard, setIdCard] = useState();
    const [idCard2, setIdCard2] = useState();
    const [acomodoCars, setAcomodoCards] = useState(false);
    const [imagesArray, setImagenesArray] = useState([]);
    const [dataCategrorias, setCataCategrorias] = useState([]);
    const [misProductos, setMisProductos] = useState([]);
    const [value, setValue] = useState([1000, 15000]);
    const [filtros, setFiltros] = useState({
        Catego: "",
        text: "",
        value: value,
        Oferta: 0,
        Estado: 3
    });

    useEffect(() => {
        if (idU !== undefined) {
            fetchData();
        }
    }, [idU]);

    useEffect(() => {
        getCate();
    }, []);

    useEffect(() => {
        busquedas();
    }, [filtros]);

    useEffect(() => {
        if (idCard !== undefined) {
            addToGustos(idCard);
        }
    }, [idCard]);

    useEffect(() => {
        if (idCard2 !== undefined) {
            addToCarrito(idCard2);
        }
    }, [idCard2]);

    useEffect(() => {
        if (clickProducto !== undefined) {
            localStorage.setItem('idProduct', JSON.stringify(clickProducto));
        }
    }, [clickProducto]);

    const fetchData = () => {
        NumElementsCarrito();
        NumElementsGustos();
        ElementsGustos();
        ElementsNoti();
        NumElementsNoti();
    };

    const getCate = async () => {
        try {
            const response = await HTTP.post("/getCat", { "id": 1 });
            setCataCategrorias(response.data || []);
        } catch (error) {
            setCataCategrorias([]);
        }
    };

    const busquedas = async () => {
        try {
            const response = await HTTP.post("/PruebasBusqueda", filtros);
            setDataFiltrado(response.data || []);
        } catch (error) {
            setDataFiltrado([]);
        }
    };

    const NumElementsNoti = async () => {
        if (idU !== undefined) {
            try {
                const response = await HTTP.post("/GetNumNoti", { "id": idU });
                setNumNoti(response.data || 0);
            } catch (error) {
                setNumNoti(0);
            }
        }
    };

    const ElementsNoti = async () => {
        if (idU !== undefined) {
            try {
                const response = await HTTP.post("/GetElementsNoti", { "id": idU });
                setElementsNoti(response.data || []);
            } catch (error) {
                setElementsNoti([]);
            }
        }
    };

    const NumElementsGustos = async () => {
        if (idU !== undefined) {
            try {
                const response = await HTTP.post("/GetNumGustos", { "id": idU });
                console.log(response.data)
                setNumGustos(response.data || 0);
            } catch (error) {
                setNumGustos(0);
            }
        }
    };

    const NumElementsCarrito = async () => {
        if (idU !== undefined) {
            try {
                const response = await HTTP.post("/GetNumCarrito", { "id": idU });
                setNumArticulos(response.data || 0);
            } catch (error) {
                setNumArticulos(0);
            }
        }
    };

    const ElementsGustos = async () => {
        if (idU !== undefined) {
            try {
                const response = await HTTP.post("/GetElementsGustos", { "id": idU });
                setElementsGustos(response.data || []);
            } catch (error) {
                setElementsGustos([]);
            }
        }
    };

    const addToGustos = async (id) => {
        if (idU === undefined) {
            setNotiCarrito("NotUserGustos");
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 4000);
            return;
        }
        try {
            const response = await HTTP.post("/gustos", { "idU": idU, "Num": id });
            console.log((response.data))
            setNotiCarrito(response.data);
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 4000);
            await NumElementsGustos();
            await ElementsGustos();
        } catch (error) {
            setNotiCarrito("Error adding to Gustos");
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 4000);
        }
    };

    const addToCarrito = async (id) => {
        if (idU === undefined) {
            setNotiCarrito("NotUserCarrito");
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 4000);
            return;
        }
        try {
            const response = await HTTP.post("/carrito", { "idU": idU, "Num": id });
            setNotiCarrito(response.data);
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 4000);
            await NumElementsCarrito();
        } catch (error) {
            setNotiCarrito("Error adding to Carrito");
            setActiveNoti(true);
            setTimeout(() => {
                setActiveNoti(false);
            }, 4000);
        }
    };

    const DeleteItemGustos = async (id) => {
        if (idU !== undefined) {
            try {
                const response = await HTTP.post("/deleteItemGustos", { "idU": idU, "id": id });
                if (response.data === "EliminadoGusto") {
                    await ElementsGustos();
                    await NumElementsGustos();
                    setNotiCarrito(response.data);
                    setActiveNoti(true);
                    setTimeout(() => {
                        setActiveNoti(false);
                    }, 4000);
                }
            } catch (error) {
                // Manejar error si es necesario
            }
        }
    };

    return {
        estadoMenu, setEstadoMenu,
        data, setData,
        dataFiltrado, setDataFiltrado,
        numArticulos, setNumArticulos,
        numGustos, setNumGustos,
        numNoti, setNumNoti,
        elemntsNoti, setElementsNoti,
        elemntsGustos, setElementsGustos,
        notiCarrito, setNotiCarrito,
        activeNoti, setActiveNoti,
        menu, setMenu,
        clickProducto, setClickProducto,
        idCard, setIdCard,
        idCard2, setIdCard2,
        acomodoCars, setAcomodoCards,
        imagesArray, setImagenesArray,
        dataCategrorias, setCataCategrorias,
        misProductos, setMisProductos,
        value, setValue,
        filtros, setFiltros,
        busquedas, DeleteItemGustos,
        head2misproductos: (Busiden) => {
            HTTP.post("/head2misproductos", { "idU": idU, "BusIden": Busiden }).then((response) => {
                setMisProductos(response.data);
            });
        },
        EliminarNotiFicacion: (id) => {
            HTTP.post("/EliminarNotiFicacion", { "idU": idU, "id": id }).then((response) => {
                if (response.data === "ContraRechazada") {
                    ElementsNoti();
                    NumElementsNoti();
                    setNotiCarrito(response.data);
                    setActiveNoti(true);
                    setTimeout(() => {
                        setActiveNoti(false);
                    }, 4000);
                }
            });
        },
        ComprarProductoNoti: (id) => {
            HTTP.post("/ComprarPoductoNoti", { "idU": idU, "id": id }).then((response) => {
                setMenu(2);
                const dataToPass = {
                    idU: idU,
                    id: id,
                    ...response.data?.[0] // Incluimos los datos de response.data si es necesario
                };
                navigate('/Compras', {
                    replace: true,
                    state: dataToPass
                });
            });
        }
    };
};
