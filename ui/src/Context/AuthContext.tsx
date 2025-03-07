import React, { createContext, useState, useContext, useEffect } from 'react';

// Define a more comprehensive user type
type UserProfile = {
    username: string;
    _id: string;
    // Add any other profile fields you need
};

type AuthContextType = {
    isAuthenticated: boolean;
    user: UserProfile | null;
    login: (token: string, userData: any) => void;
    logout: () => void;
    fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children} : {children : React.ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:3000/profile', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const profileData = await response.json();
                setUser(profileData);
            } else {
                throw new Error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:3000/verifyToken', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        credentials: 'include'
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setIsAuthenticated(true);
                        // Fetch the full profile after verifying token
                        await fetchProfile();
                    } else {
                        localStorage.removeItem('token');
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } catch (e) {
                    console.log('Auth Token Check failed', e);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
        };

        checkAuthentication();
    }, []);

    const login = async (token: string, userData: any) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);

        // Set basic user data immediately
        setUser({
            username: userData.username,
            _id: userData._id,
        });

        // Then fetch full profile
        await fetchProfile();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
