import { Login, serviceAuth } from 'auth/services/AuthServices';
import { createContext, useCallback, useContext, useState } from 'react'

export interface authStateUser {
    id: Number,
    logged: boolean,
    name: string,
    email: string,
    rol: string,
    commerce_code: string

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
    rol: null,
    commerce_code: ''

}
const AuthContext = createContext<AuthContext | undefined>(undefined);
export const AuthProvider: React.FC<{
    children?: React.ReactNode;
}> = ({ children }: { children?: React.ReactNode }) => {
    const [auth, setAuth] = useState<authStateUser>(initialState)
    const login = async (username: string, password: string) => {
        try {
            const { status, userData } = await serviceAuth.login({ username, password })

            setAuth(userData)
            return status
        } catch (error) {
            return false
        }
    }
    const checkToken = async () => {
        const { status, userData } = await serviceAuth.checkToken()
        setAuth(userData)
    }
    const logout = () => {
        localStorage.removeItem('token');
        setAuth({
            id: null,
            logged: false,
            name: null,
            email: null,
            rol: null,
            commerce_code: null
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
