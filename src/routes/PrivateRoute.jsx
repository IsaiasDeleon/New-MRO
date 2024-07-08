import { useContext, useEffect } from "react"
import { AuthContext } from "../auth/AuthContext";
import { Navigate,useLocation } from "react-router";



export const PrivateRoute = ({ children }) => {
    const { logged } = useContext(AuthContext);
    const {pathname} = useLocation();
    const lastpath = pathname;
    useEffect(()=>{
        localStorage.setItem('lastPath', lastpath);
    },[lastpath])
    
    return(logged)
    ? children
    : <Navigate to="/Inicio"/>
}