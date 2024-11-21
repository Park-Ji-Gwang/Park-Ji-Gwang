import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.20.206:8081',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

// 여기서 axiosInstance를 default로 내보내기
export default axiosInstance;
