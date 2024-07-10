import { useContext } from "react"
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router";
const clientId = "834174042599-ok7fjvug6opngk4devckt6kgcrc3iclf.apps.googleusercontent.com";

const HTTP = axios.create({
    //baseURL: "https://ba-mro.mx/Server/Data.php"
    baseURL: "https://ba-mro.mx/Server/Data.php"
})
function LoginB ({ handleClose}) {
    const { Log } = useContext(AuthContext); 
    const navigate = useNavigate(); 
    const onSuccess = (res) => {
        HTTP.post("/RegistrarGoogle",{"nombre":res.profileObj.name,"correo":res.profileObj.email, "IMG":res.profileObj.imageUrl}).then((response) => {
            const lastPath = localStorage.getItem('lastPath') || '/';
            let data = response.data[0];
            handleClose();
            Log(data.Nombre, data.id, data.img, data.tipoUser, 1);
            navigate(lastPath,{
                replace:true
            })
            //  setNotiCarrito(response.data);
            //  setActiveNoti(true)
            //  setTimeout(() => {
            //      setActiveNoti(false)
            //  }, 5000);
        })
    }
    const onFailure = (res) => {
        console.log("error", res)
    }
    return(
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Ingresar con google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={false}
            />
        </div>
    )
}
export default LoginB;