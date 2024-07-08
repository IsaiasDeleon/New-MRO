export const BtnSaveAll = ({saveAll}) => {
    return(
        <>
            <button onClick={() => saveAll() } className='btn btn-success botonMisProductos'><i className="bi bi-cloud-download-fill"></i> Guardar todos los cambios</button>
        </>
    )
}