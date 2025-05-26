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
            // Токен недействителен или просрочен, можно перенаправить на страницу входа
            sessionStorage.removeItem('jwt');
            // const excludedPaths = ['/signin', '/signup', '/verification', '/verification_rq', '/reset_password', '/faq', '/reviews', '/', ''];

            // if (!excludedPaths.includes(window.location.pathname)) {
            //     window.location.href = '/signin';
            // }
            window.location = '/signin';
        }
        return Promise.reject(error);
    }
);

export default api;