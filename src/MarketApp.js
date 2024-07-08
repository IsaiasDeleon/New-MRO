import { HashRouter } from "react-router-dom"
import { AppRoute } from "./routes"
import { AuthProvider } from "./auth/AuthProvider"



export const MarketApp = () => {
    return (
        <HashRouter>
            <AuthProvider>
                <AppRoute />
            </AuthProvider>
        </HashRouter>
    )
}