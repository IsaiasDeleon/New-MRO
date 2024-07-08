export const Fotos = ({image, index, deleteImage}) =>{
    return(
        <div  className="image">
            <img src={URL.createObjectURL(image)} alt="image" />
            <i onClick={() => deleteImage(index)} className="bi bi-trash-fill"></i>
        </div>
    )
}