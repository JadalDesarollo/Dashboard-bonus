import { InitialTableState } from '@tanstack/react-table';
import React, { createContext, useCallback, useState } from 'react'

export interface authStateInitial {
    id: Number,
    logged: boolean,
    name: string,
    email: string,
    rol: string
}
export interface AuthContext {
    auth: authStateInitial,
    login: (email: string, password: string) => Promise<boolean>
    checkToken: () => Promise<void>
    logout: () => void
}
const initialState: authStateInitial = {
    id: null,
    logged: false,
    name: null,
    email: null,
    rol: null
}
const AuthContext = createContext<AuthContext | undefined>(undefined);
const AuthProvider: React.FC<{
    children?: React.ReactNode;
}> = ({ children }: { children?: React.ReactNode }) => {
    const [auth, setAuth] = useState<authStateInitial>(initialState)
    const login = async (email: string, password: string) => {
        return true
        /* 
                const resp = await fetchSinToken('login', { email, password }, 'POST');
                if (resp.ok) {
                    localStorage.setItem('token', resp.token);
                    const { usuario } = resp;
                    setAuth({
                        uid: usuario.uid,
                        checking: false,
                        logged: true,
                        name: usuario.nombre,
                        email: usuario.email,
                        rol: usuario.rol
                    });
        
                }
                return resp.ok; */
    }
    const checkToken = useCallback(async () => {
        const token = localStorage.getItem('token');
        /*  // Si token no existe
         if (!token) {
             setAuth({
                 uid: null,
                 checking: false,
                 logged: false,
                 name: null,
                 email: null,
                 rol: null
             })
 
             return false;
         }
 
         const resp = await fetchConToken('login/renew');
         if (resp.ok) {
             localStorage.setItem('token', resp.token);
             const { usuario } = resp;
 
             setAuth({
                 uid: usuario.uid,
                 checking: false,
                 logged: true,
                 name: usuario.nombre,
                 email: usuario.email,
                 rol: usuario.rol
             });
 
             return true;
         } else {
             setAuth({
                 uid: null,
                 checking: false,
                 logged: false,
                 name: null,
                 email: null,
                 rol: null
             });
 
             return false;
         } */

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

export default AuthProvider