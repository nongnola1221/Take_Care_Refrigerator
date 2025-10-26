import { create } from 'zustand';
import apiClient from '../api/axios';

export interface Recipe {
  id: number;
  name: string;
  instructions: string;
  cuisine_type: string;
  serving_size: number;
  cooking_time: string;
  difficulty: number;
  Ingredients: { name: string }[];
}

interface RecommendationState {
  recommendations: Recipe[] | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  fetchRecommendations: (filters: { cuisine_type?: string; serving_size?: number }) => Promise<void>;
}

const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: null,
  loading: false,
  error: null,
  message: null,
  fetchRecommendations: async (filters) => {
    set({ loading: true, error: null, message: null, recommendations: null });
    try {
      const response = await apiClient.post(`/recommendations`, filters);
      if (response.data.message) {
        set({ message: response.data.message, loading: false });
      } else {
        set({ recommendations: response.data, loading: false });
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      set({ error: '추천을 받아오는 중 오류가 발생했습니다.', loading: false });
    }
  },
}));

export default useRecommendationStore;
