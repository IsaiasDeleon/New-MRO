import { useReducer } from "react"
import { AuthContext } from "./AuthContext"
import { authReducer } from "./authReduces"
import { types } from "../types/types";

const init = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return {
        logged: !!user,
        user: user,
    }
}
export const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, {}, init)


    const Log = (Nombre = "", id = 0, img = "", tipoUser = 1, google = 0, logged = true,Empresa=null) => {
        const user = { id, Nombre, img, logged, tipoUser, google,Empresa }
        const action = {
            type: types.login,
            payload: user
        }
        localStorage.setItem('user', JSON.stringify(user))
        dispatch(action)
    }
    const LogOut = () => {
        localStorage.removeItem('user');
        const action = { type: types.logout };
        dispatch(action)
    }
    return (
        <AuthContext.Provider value={{
            ...authState,
            //Metodos
            Log,
            LogOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}