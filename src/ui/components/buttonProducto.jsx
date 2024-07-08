import { useNavigate } from "react-router";

export const BtnProducto = () => {
    const navigate = useNavigate();
    function ProductoNuevo() {
        navigate('/ProductoNuevo', {
            replace: true
        })
    }
    return(
        <>
            
            <button onClick={() => ProductoNuevo()} className='btn btn-dark botonCargaProduct'><i className="bi bi-cloud-arrow-up-fill"></i> Nuevo producto</button>
        </>
    )
}