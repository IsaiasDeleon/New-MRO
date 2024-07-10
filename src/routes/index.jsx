import { useContext, useEffect, useState } from "react";
import { Head } from "../ui/components/Head";
import { Inicio } from "../ui/pages";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";
import { Noti } from "../ui/components/Notificaciones";
import { EditarPerfil } from "../ui/pages/EditarPerfil";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { Somos } from "../ui/pages/QuienesSomos";
import { Navigation } from "../ui/components/Nav";

import Dashboard from "../ui/pages/Dashboard";
import AddNewProduct from "../ui/pages/NewProducts";
import Footer from "../ui/components/footer";
import { Productos } from "../ui/pages/Productos";
import NewUser from "../ui/pages/NewUser";


const HTTP = axios.create({
    baseURL: "https://ba-mro.mx/Server/Data.php"
});

export const AppRoute = () => { 
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
   
    let idU = user?.id;
    let tipoUser= user?.tipoUser;
    let idEmpresa= user?.Empresa;
    const [estadoMenu, setEstadoMenu] = useState(false);
    const [data, setData] = useState([]);
    const [dataFiltrado, setDataFiltrado] = useState(() => {
        const saved = localStorage.getItem('dataFiltrado');
        return saved !== null ? JSON.parse(saved) : [];
    });
    const [dataFiltradoSinCat, setDataFiltradoSinCat] = useState(() => {
        const saved = localStorage.getItem('dataFiltradoSinCat');
        return saved !== null ? JSON.parse(saved) : [];
    });
    const [dataCategoria, setDataCategoria] = useState(() => {
        const saved = localStorage.getItem('dataCategoria');
        return saved !== null ? JSON.parse(saved) : '';
    });
    const [numArticulos, setNumArticulos] = useState(0);
    const [elemntsCarrito, setElemntsCarrito] = useState([]);
    const [numGustos, setNumGustos] = useState(0);
    const [numNoti, setNumNoti] = useState(0);
    const [elemntsNoti, setElementsNoti] = useState([]);
    const [elemntsGustos, setElementsGustos] = useState([]);
    const [notiCarrito, setNotiCarrito] = useState();
    const [activeNoti, setActiveNoti] = useState();
    const [menu, setMenu] = useState(1);
    const [clickProducto, setClickProducto] = useState();
    const [idCard, setIdCard] = useState();
    const [idCard2, setIdCard2] = useState();
    const [acomodoCars, setAcomodoCards] = useState(false);
    const [imagesArray, setImagenesArray] = useState([]);
    const [dataCategrorias, setCataCategrorias] = useState([]);
    const [misProductos, setMisProductos] = useState([]);
    const [showQuickViewModal, setShowQuickViewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [value, setValue] = useState([0, 20000]);
    const [filtros, setFiltros] = useState(() => {
        return  {
            Catego: "",
            text: "",
            value: [0, 20000],
            Oferta: 0,
            Estado: 3,
            Nombre: "",
            Order:1
        };
    });
    const [dataMasVendidos, setDataMasVendidos] = useState([]);
    const [dataNuevos, setDataNuevos] = useState([]);

    useEffect(() => {
        localStorage.setItem('dataFiltrado', JSON.stringify(dataFiltrado));
    }, [dataFiltrado]);

    useEffect(() => {
        localStorage.setItem('dataFiltradoSinCat', JSON.stringify(dataFiltradoSinCat));
    }, [dataFiltradoSinCat]);

    useEffect(() => {
        localStorage.setItem('dataCategoria', JSON.stringify(dataCategoria));
    }, [dataCategoria]);

    const handleShowQuickViewModal = (product) => {
        const imgSrc = product.img ? product.img.split(',')[0] : 'Box.jpg';
        setSelectedProduct(product);
        setSelectedImage(imgSrc);
        setShowQuickViewModal(true);
      };
      

    const handleCloseQuickViewModal = () => {
        setShowQuickViewModal(false);
        setSelectedProduct(null);
    };

    const getCate = () => {
        HTTP.post("/getCat", {"id": 1}).then((response) => {
            if (response.data !== "") {
                setCataCategrorias(response.data);
            } else {
                setCataCategrorias([]);
            }
        });
    };

    useEffect(() => {
        getCate();
        Nuevos();
        Vendidos();
        if(tipoUser !== 1){
            head2misproductos("");
        }
    }, []);

    const busquedas = () => {
        HTTP.post("/PruebasBusqueda", filtros).then((response) => {
            if (response.data !== "") {
                if (filtros.Catego !== dataCategoria) {
                    setDataFiltradoSinCat(response.data);
                    setDataCategoria(filtros.Catego);
                    setFiltros({ ...filtros, Nombre:"" });
                }
                setDataFiltrado(response.data);
            } else {
                setDataFiltrado([]);
            }
        });
    };
    const Nuevos = () => {
        HTTP.post("/ProductsNews", filtros).then((response) => {
            if (response.data !== "") {
                setDataNuevos(response.data);
            } else {
                setDataNuevos([]);
            }
        });
    };
    const Vendidos = () => {
        HTTP.post("/ProductsVendidos", filtros).then((response) => {
            if (response.data !== "") {
                setDataMasVendidos(response.data);
            } else {
                setDataMasVendidos([]);
            }
        });
    };

    useEffect(() => {
        busquedas();
    }, [filtros]);

    const NumElementsNoti = () => {
        setNumNoti(0);
        if (idU !== undefined) {
            HTTP.post("/GetNumNoti", {"id": idU}).then((response) => {
                if (response.data !== "") {
                    setNumNoti(response.data);
                }
            });
        } else {
            setNumNoti(0);
        }
    };

    const ElementsNoti = () => {
        setElementsNoti([]);
        if (idU !== undefined) {
            HTTP.post("/GetElementsNoti", {"id": idU}).then((response) => {
                if (response.data !== "") {
                    setElementsNoti(response?.data);
                }
            });
        } else {
            setElementsNoti([]);
        }
    };

    const NumElementsGustos = () => {
        setNumGustos(0);
        if (idU !== undefined) {
            HTTP.post("/GetNumGustos", {"id": idU}).then((response) => {
                if (response.data !== "") {
                    setNumGustos(response.data);
                }
            });
        }
    };

    const NumElementsCarrito = () => {
        setNumArticulos(0);
        if (idU !== undefined) {
            HTTP.post("/GetNumCarrito", {"id": idU}).then((response) => {
                if (response.data !== "") {
                    setNumArticulos(response.data);
                }
            });
        }
    };

    const ElementsCarrito = () => {
        setElemntsCarrito([]);
        if (idU !== undefined) {
            HTTP.post("/readCarrito", {"idU": idU}).then((response) => {
                if (response.data !== "") {
                  
                    setElemntsCarrito(response?.data);
                }
            });
        }
    };

    const ElementsGustos = () => {
        setElementsGustos([]);
        if (idU !== undefined) {
            HTTP.post("/GetElementsGustos", {"id": idU}).then((response) => {
                if (response.data !== "") {
                   
                    setElementsGustos(response?.data);
                }
            });
        }
    };

    const DeleteItemGustos = (id) => {
        if (idU !== undefined) {
            HTTP.post("/deleteItemGustos", {"idU": idU, "id": id }).then((response) => {
                if (response.data === "EliminadoGusto") {
                    ElementsGustos();
                    NumElementsGustos();
                    setNotiCarrito(response.data);
                    setActiveNoti(true);
                    setTimeout(() => {
                        setActiveNoti(false);
                    }, 4000);
                }
            });
        }
    };

    const EliminarNotiFicacion = (id) => {
        if (idU !== undefined) {
            HTTP.post("/EliminarNotiFicacion", {"idU": idU, "id": id }).then((response) => {
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
        }
    };

    const ComprarProductoNoti = (id) => {
        if (idU !== undefined) {
            HTTP.post("/ComprarPoductoNoti", {"idU": idU, "id": id}).then((response) => {
                setMenu(2);
                const dataToPass = {
                    idU: idU,
                    id: id,
                    ...response.data?.[0]
                };
                navigate('/Compras', {
                    replace: true,
                    state: dataToPass
                });
            });
        }
    };

    const head2misproductos = (Busiden) => {
        HTTP.post("/head2misproductos", {"idU": idEmpresa, "BusIden": Busiden}).then((response) => {
            setMisProductos(response.data);
        });
    };
    useEffect(() => {
        head2misproductos("");
    }, [idEmpresa]);

    useEffect(() => {
        if (clickProducto !== undefined) {
            localStorage.setItem('idProduct', JSON.stringify(clickProducto));
        }
    }, [clickProducto]);

    useEffect(() => {
        if (idU !== undefined) {
            NumElementsCarrito();
            NumElementsGustos();
            ElementsGustos();
            ElementsNoti();
            NumElementsNoti();
            ElementsCarrito();
        }
    }, [idU]);

    useEffect(() => {
        if (idCard !== undefined) {
            if (idU === undefined) {
                setNotiCarrito("NotUserGustos");
                setActiveNoti(true);
                setTimeout(() => {
                    setActiveNoti(false);
                }, 4000);
                return;
            }
            HTTP.post("/gustos", { "idU": idU, "Num": idCard }).then((response) => {
                setNotiCarrito(response.data);
                setActiveNoti(true);
                setTimeout(() => {
                    setActiveNoti(false);
                }, 4000);
                NumElementsGustos();
                ElementsGustos();
            });
        }
    }, [idCard]);

    useEffect(() => {
        if (idCard2 !== undefined) {
            if (idU === undefined) {
                setNotiCarrito("NotUserCarrito");
                setActiveNoti(true);
                setTimeout(() => {
                    setActiveNoti(false);
                }, 4000);
                return;
            }
            HTTP.post("/carrito", {"idU": idU, "Num": idCard2}).then((response) => {
                setNotiCarrito(response.data);
                setActiveNoti(true);
                setTimeout(() => {
                    setActiveNoti(false);
                }, 4000);
                NumElementsCarrito();
            });
        }
    }, [idCard2]);

 
    const reloadAll = () => {
        setNumArticulos(0);
        setNumGustos(0);
        setElementsGustos([]);
        setElementsNoti([]);
        setNumNoti(0);
        setElemntsCarrito([]);
    };

 return (
        <>
            <Routes>
                <Route path="Inicio" element={<Inicio data={data} dataNuevos={dataNuevos} dataMasVendidos={dataMasVendidos} handleShowQuickViewModal={handleShowQuickViewModal} setSelectedImage={setSelectedImage} selectedImage={selectedImage} showQuickViewModal={showQuickViewModal} selectedProduct={selectedProduct} handleCloseQuickViewModal={handleCloseQuickViewModal} dataFiltrado={dataFiltrado} setData={setData} NumElementsCarrito={NumElementsCarrito} setMenu={setMenu} NumElementsGustos={NumElementsGustos} ElementsGustos={ElementsGustos} setClickProducto={setClickProducto} acomodoCars={acomodoCars} setAcomodoCards={setAcomodoCards} setFiltros={setFiltros} filtros={filtros} setIdCard2={setIdCard2} setIdCard={setIdCard} />} />
                <Route path="Productos" element={<Productos data={data} handleShowQuickViewModal={handleShowQuickViewModal} setSelectedImage={setSelectedImage} selectedImage={selectedImage} showQuickViewModal={showQuickViewModal} selectedProduct={selectedProduct} handleCloseQuickViewModal={handleCloseQuickViewModal} dataFiltrado={dataFiltrado} setData={setData} NumElementsCarrito={NumElementsCarrito} setMenu={setMenu} NumElementsGustos={NumElementsGustos} ElementsGustos={ElementsGustos} setClickProducto={setClickProducto} acomodoCars={acomodoCars} setAcomodoCards={setAcomodoCards} setFiltros={setFiltros} filtros={filtros} setIdCard2={setIdCard2} setIdCard={setIdCard} estado={estadoMenu} setEstadoMenu={setEstadoMenu} setValue={setValue} value={value} dataCategrorias={dataCategrorias} dataFiltradoSinCat={dataFiltradoSinCat} ElementsCarrito={ElementsCarrito} />} />
                <Route path="/*" element={<Navigate to={"Inicio"} />} />
                <Route path="Somos" element={<Somos setMenu={setMenu}/>} />
                
                {
                    tipoUser === "4" &&(
                        <Route path="NewUser" element={<NewUser />} />
                    )
                }
                {
                    idU && (
                        <Route path="Perfil" element={<EditarPerfil numArticulos={numArticulos} setMenu={setMenu} />} />
                    )
                }
                {
                    idEmpresa && (
                        <>
                            <Route path="/Dashboard" element={<Dashboard head2misproductos={head2misproductos} misProductos={misProductos}/>} />
                            {tipoUser !== "2" && (
                                <Route path="NewProducts" element={<AddNewProduct imagesArray={imagesArray} setImagenesArray={setImagenesArray} setMenu={setMenu} busquedas={busquedas} />} />
                            )}
                        </>
                       
                    )
                }
            </Routes>
           
            
            <Navigation dataCategrorias={dataCategrorias} setFiltros={setFiltros} filtros={filtros}/>
            <Head setEstadoMenu={setEstadoMenu} ElementsCarrito={ElementsCarrito} NumElementsCarrito={NumElementsCarrito} numArticulos={numArticulos} numGustos={numGustos} numNoti={numNoti} elemntsCarrito={elemntsCarrito} elemntsGustos={elemntsGustos} DeleteItemGustos={DeleteItemGustos} setMenu={setMenu} clickProducto={clickProducto} setClickProducto={setClickProducto} setFiltros={setFiltros} filtros={filtros} elemntsNoti={elemntsNoti} EliminarNotiFicacion={EliminarNotiFicacion} ComprarProductoNoti={ComprarProductoNoti} reloadAll={reloadAll} handleShowQuickViewModal={handleShowQuickViewModal} setIdCard2={setIdCard2} />
            
            
            <Noti notiCarrito={notiCarrito} activeNoti={activeNoti} />
        </>
    );
    
};
