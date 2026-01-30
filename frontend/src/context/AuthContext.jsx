import { createContext, useState, useEffect } from 'react';
import { apiRequest } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    const data = await apiRequest('/users/me', 'GET', null, token);
                    if (!data.error) {
                        setUser(data);
                    } else {
                        logout(); 
                    }
                } catch (err) {
                    console.error("Token validation failed:", err);
                    logout();
                }
            }
            setLoading(false);
        };
        validateToken();
    }, [token]);

    const login = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};