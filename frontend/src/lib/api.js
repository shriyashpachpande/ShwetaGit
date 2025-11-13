import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE_DR_APP || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

export function setToken(token) {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${ token }`;
    else delete api.defaults.headers.common['Authorization'];
}

export default api;