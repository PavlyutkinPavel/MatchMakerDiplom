import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('jwt');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('jwt');
            sessionStorage.removeItem('userId');
            if (window.location.pathname != '/signin') {
                window.location = '/signin';
            }
        }
        return Promise.reject(error);
    }
);

export default api;