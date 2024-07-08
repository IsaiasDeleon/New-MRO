import { useState, useCallback } from 'react';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

function valuetext(value) {
    return `${value}`;
}

export const Menu = ({ estado, setEstadoMenu, setFiltros, filtros, setValue, value, dataCategrorias }) => {
    const [filtroCat, setFiltroCat] = useState([]); 

    const onSubmitHideMenu = useCallback(() => {
        setEstadoMenu(false);
    }, [setEstadoMenu]);

    const handleChange = useCallback((event, newValue) => {
        setValue(newValue);
    }, [setValue]);
    
    const handlePriceChangeCommitted = useCallback(() => {
        setFiltros({ ...filtros, value });
    }, [filtros, setFiltros, value]);

    const handleCategoryChange = useCallback((category) => {
        setFiltroCat((prevFiltroCat) => {
            let updatedFiltroCat;
            if (prevFiltroCat.includes(category)) {
                updatedFiltroCat = prevFiltroCat.filter((cat) => cat !== category);
            } else {
                updatedFiltroCat = [...prevFiltroCat, category];
            }
            setFiltros({ ...filtros, Catego: updatedFiltroCat.join(",") });
            return updatedFiltroCat;
        });
    }, [filtros, setFiltros]);

    return (
        <div style={{ zIndex: 3 }} className={`contenedorM ${estado ? 'contenedorMActive' : ''}`}>
            <div style={{ alignItems: "center" }} className="d-flex text-center contenedorMHead">
                <p className="text-white fw-bold h5 col LogoFont">Market place <b style={{ color: "#F1C40F" }}>B</b><b style={{ color: "#2980B9" }}>A</b></p>
                <i onClick={onSubmitHideMenu} className="bi bi-x-square-fill cerrarMenu"></i>
            </div>
            <div style={{ overflowY: "auto", height: "100%" }}>
                <div className="padding3 paginasMenu">
                    <p className="text-white fw-bold TitulosMenu"><i className="bi bi-layout-text-window-reverse"></i> Paginas</p>
                    <p className="nav-link fw-bold text-white OpcionesFont">Inicio</p>
                    <p className="nav-link fw-bold text-white OpcionesFont">Productos nuevos</p>
                </div>

                <div>
                    <p style={{ margin: "5px", marginBottom: "0" }} className="text-white fw-bold TitulosMenu"><i className="bi bi-filter"></i> Filtros</p>
                </div>
                
                <div className="padding3">
                    <p style={{ margin: "0" }} className="text-white fw-bold TitulosMenu"><i className="bi bi-box2"></i> Categorias</p>
                    {dataCategrorias?.map((cat) => (
                        <div key={cat} className="form-check margin3">
                            <input 
                                className="form-check-input checkbox" 
                                type="checkbox" 
                                onChange={() => handleCategoryChange(cat)} 
                                id={cat}  
                            />
                            <label className="form-check-label text-white OpcionesFont" htmlFor={cat}>
                                {cat}
                            </label>
                        </div>
                    ))}
                </div>
                
                <hr className='hrMenu' />
                <div className="p-3" style={{ marginBottom: "50px" }}>
                    <p style={{ margin: "0" }} className="text-white fw-bold mb-4"><i className="bi bi-currency-dollar"></i> Rango de precio</p>
                    <Stack spacing={2} direction="row" sx={{ mb: 1, mt: 4 }} alignItems="center">
                        <h6 className='text-white text-slider'>$0</h6>
                        <Slider
                            value={value}
                            onChange={handleChange}
                            min={1}
                            max={25000}
                            valueLabelDisplay="on"
                            step={100}
                            getAriaValueText={valuetext}
                            color="warning"
                            onChangeCommitted={handlePriceChangeCommitted}
                        />
                        <h6 className='text-white text-slider'>$25,000</h6>
                    </Stack>
                </div>
            </div>
        </div>
    );
}
