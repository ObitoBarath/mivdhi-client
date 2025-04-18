import axios from 'axios';

const axiosAPI = axios.create({
    baseURL: ' http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosAPI;