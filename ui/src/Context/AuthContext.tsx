import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
    username: string;
    _id: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (userData: User, token : string) => void;
    logout: () => void;
    refreshProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:3000/profile', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
                return userData;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                return null;
            }
        } catch (e) {
            console.log('Profile fetch failed', e);
            setUser(null);
            setIsAuthenticated(false);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Initial authentication check
    useEffect(() => {
        fetchProfile();
    }, []);

    const login = (userData: User, token : string) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:3000/logout', {
                method: 'POST',
                credentials: 'include',
            });

            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout,
            refreshProfile: fetchProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};
