import { useNavigate } from "react-router";

export const BtnMisProductos = () => {
    const navigate = useNavigate();
    function MisProductos() {
        navigate('/MisProductos', {
            replace: true
        })
    }
    return(
        <>
            <button onClick={()=> MisProductos()} className='btn btn-dark botonMisProductos'><i className="bi bi-bag-heart-fill"></i> Mis productos</button>
        </>
    )
}