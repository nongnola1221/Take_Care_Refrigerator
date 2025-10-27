import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const crawlAndRecommendRecipes = async (params) => {
  try {
    const response = await apiClient.get('/recommendations/crawl-and-recommend', { params });
    return response.data;
  } catch (error) {
    console.error('Error crawling and recommending recipes:', error);
    throw error;
  }
};

export default apiClient;
