import { InitialTableState } from '@tanstack/react-table';
import { Login, serviceAuth } from 'auth/services/AuthServices';
import { fetchConToken } from 'helpers/fetch';
import { createContext, useCallback, useContext, useState } from 'react'

export interface authStateUser {
    id: Number,
    logged: boolean,
    name: string,
    email: string,
    rol: string
}
export interface AuthContext {
    auth: authStateUser,
    login: (email: string, password: string) => Promise<boolean>
    checkToken: () => Promise<void>
    logout: () => void
}
const initialState: authStateUser = {
    id: null,
    logged: false,
    name: null,
    email: null,
    rol: null
}
const AuthContext = createContext<AuthContext | undefined>(undefined);
export const AuthProvider: React.FC<{
    children?: React.ReactNode;
}> = ({ children }: { children?: React.ReactNode }) => {
    const [auth, setAuth] = useState<authStateUser>(initialState)
    const login = async (email: string, password: string) => {
        const { status, userData } = await serviceAuth.login({ email, password })
        setAuth(userData)
        return status
    }
    const checkToken = useCallback(async () => {
        const { status } = await serviceAuth.checkToken()
        if (status) {
            const resp = await fetchConToken('login/renew');
            if (resp.ok) {
                localStorage.setItem('token', resp.token);
                const { usuario } = resp;
                setAuth({
                    id: usuario.uid,
                    logged: true,
                    name: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                });
            } else {
                setAuth({
                    id: null,
                    logged: false,
                    name: null,
                    email: null,
                    rol: null
                });
            }
        }
    }, [])
    const logout = () => {
        localStorage.removeItem('token');
        setAuth({
            id: null,
            logged: false,
            name: null,
            email: null,
            rol: null
        });
    }
    return (
        <AuthContext.Provider value={{
            auth,
            login,
            checkToken,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useBonus debe ser utilizado dentro de un BonusProvider");
    }
    return context;
}
