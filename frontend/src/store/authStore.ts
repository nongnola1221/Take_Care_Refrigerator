import { create } from 'zustand';
import apiClient from '../api/axios';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  register: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
  login: async (data) => {
    set({ error: null });
    try {
      const response = await apiClient.post(`/auth/login`, data);
      const { token } = response.data;
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true });
      return true;
    } catch (error: any) {
      console.error("Login failed:", error);
      set({ error: '이메일 또는 비밀번호가 올바르지 않습니다.', isAuthenticated: false });
      return false;
    }
  },
  register: async (data) => {
    set({ error: null });
    try {
      console.log('Frontend: Registering with', data);
      const response = await apiClient.post(`/auth/register`, data);
      console.log('Frontend: Registration successful', response.data);
      return true;
    } catch (error: any) {
      console.error("Frontend: Registration failed:", error.response?.data || error.message);
      set({ error: '회원가입에 실패했습니다. 이미 사용중인 이메일일 수 있습니다.' });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;