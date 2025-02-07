import React, { createContext, useState, useContext, useEffect } from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    user: any;
    login: (token: string, userData: any) => void;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children} : {children : React.ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        console.log('Authentication state:', isAuthenticated);
    }, [isAuthenticated]);

    const [user, setUser] = useState('null')

    useEffect(() => {
        const checkAuthentication = async () => {
            const token : string = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:3000/verifyToken', {
                        headers : {
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    if (response.ok) {
                        const userData = await response.json()
                        setUser(userData.user)
                        setIsAuthenticated(true)
                    } else {
                        localStorage.removeItem(token)
                    }
                } catch (e) {
                    console.log('Auth Token Check failed', e)
                }
            }
        };
        checkAuthentication()
    }, []);

    const login = (token: string, userData: any) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };
    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
