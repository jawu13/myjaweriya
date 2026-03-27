import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // NEW loading state

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        try {
            if (storedToken) {
                const decodedToken = jwtDecode(storedToken);
                if (decodedToken.exp * 1000 < Date.now()) {
                    // Token is expired
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                } else {
                    // Token is valid
                    setToken(storedToken);
                    setUser({
                        id: decodedToken.userId,
                        email: decodedToken.sub,
                        roles: decodedToken.roles
                    });
                }
            }
        } catch (error) {
            console.error("Auth context initialization error:", error);
            // Clear out invalid token
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false); // Finished loading, whether successful or not
        }
    }, []);

    const login = (newToken) => {
        const decodedToken = jwtDecode(newToken);
        const userPayload = {
            id: decodedToken.userId,
            email: decodedToken.sub,
            roles: decodedToken.roles
        };
        
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userPayload);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };
    
    const isAdmin = () => user && user.roles && user.roles.includes('ROLE_ADMIN');
    const isTherapist = () => user && user.roles && user.roles.includes('ROLE_THERAPIST');

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAdmin, isTherapist, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
};