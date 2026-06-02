import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const UPLOADS_URL = API_URL ? API_URL.replace(/\/api$/, '/uploads') : '/uploads';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getImageUrl(image) {
  if (!image) return 'https://via.placeholder.com/300x200?text=No+Image';
  if (image.startsWith('http')) return image;
  return `${UPLOADS_URL}/${image}`;
}

export default api;
