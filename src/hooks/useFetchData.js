import { useState, useEffect } from 'react';
import axios from 'axios';

const HTTP = axios.create({
    baseURL: "https://ba-mro.mx/Server/Data.php"
});

export const useFetchData = (idU) => {
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [pass, setPass] = useState("");
    const [direccion, setDireccion] = useState("");
    const [cp, setCP] = useState("");
    const [correo, setCorreo] = useState("");
    const [google, setGoogle] = useState(0);
    const [pais, setPais] = useState("México");
    const [estado, setEstado] = useState(1);
    const [municipio, setMunicipio] = useState(1);
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [direccion2, setDireccion2] = useState("");
    const [cp2, setCP2] = useState("");
    const [estado2, setEstado2] = useState(1);
    const [municipio2, setMunicipio2] = useState(1);
    const [compras, setCompras] = useState([]);
    const [elementsCarrito, setElementsCarrito] = useState(2);

    useEffect(() => {
        if (idU) {
            const getD = async () => {
                const response = await HTTP.post("/getDatosGenerales", { "IdUsuario": idU });
                console.log(response);
                const data = response.data[0];
                if (data) {
                    setNombre(data.Nombre);
                    setTelefono(data.telefono);
                    setPass(data.Password);
                    setDireccion(data.Direccion);
                    setCP(data.CP);
                    setCorreo(data.Correo);
                    setGoogle(data.google);
                    setEstado(data.estado || 1);
                    setMunicipio(data.municipio || 1);
                    setDireccion2(data.Direccion2 || "");
                    setCP2(data.CP2 || "");
                    setEstado2(data.Estado2 || 1);
                    setMunicipio2(data.Municipio2 || 1);
                    setLatitude(data.latitude);
                    setLongitude(data.longitude);
                }
            };

            const getCompras = async () => {
                const response = await HTTP.post("/getCompras", { "idUsuario": idU });
                if (response.data !== "0Elements") {
                    setElementsCarrito(response.data.length);
                    setCompras(response.data);
                } else {
                    setElementsCarrito(0);
                }
            };

            getD();
            getCompras();
        }
    }, [idU]);

    return {
        nombre, setNombre, telefono, setTelefono, pass, setPass, direccion, setDireccion,
        cp, setCP, correo, google, pais, estado, setEstado, municipio, setMunicipio,
        latitude, longitude, direccion2, setDireccion2, cp2, setCP2, estado2, setEstado2,
        municipio2, setMunicipio2, compras, elementsCarrito
    };
};
