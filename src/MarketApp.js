import { BrowserRouter } from "react-router-dom";
import { AppRoute } from "./routes";
import { AuthProvider } from "./auth/AuthProvider";

export const MarketApp = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoute />
            </AuthProvider>
        </BrowserRouter>
    );
};