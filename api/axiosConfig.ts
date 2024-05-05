import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://192.168.4.27:8100',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,
});

export default instance;