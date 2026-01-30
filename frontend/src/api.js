export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            return { error: data.error || "Server Error", status: response.status };
        }
        
        return data;
    } catch (err) {
        console.error("API Error:", err);
        return { error: "Network Connection Failed. Is the backend awake?" };
    }
};