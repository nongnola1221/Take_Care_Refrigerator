import { create } from 'zustand';
import apiClient, { crawlAndRecommendRecipes } from '../api/axios';

export interface IngredientWithDetails {
  name: string;
  quantity: string;
  storage_tip: string;
  has_in_inventory: boolean;
}

export interface Recipe {
  id: number;
  name: string;
  instructions: string;
  cuisine_type: string;
  serving_size: number;
  cooking_time: string;
  difficulty: number;
  original_url?: string; // Optional for crawled recipes
  image_url?: string; // Optional for crawled recipes
  source?: string; // Optional for crawled recipes
  category?: string; // Optional for crawled recipes
  ingredients: IngredientWithDetails[]; // Updated to include details
  missing_ingredients?: string[]; // Added for recommendation logic
}

interface RecommendationState {
  recommendations: Recipe[] | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  fetchRecommendations: (filters: { cuisine_type?: string; serving_size?: number; difficulty?: number }) => Promise<void>;
  crawlAndFetchRecommendations: (params: { searchQuery: string; categoryFilter?: string; cuisine_type?: string; serving_size?: number; difficulty?: number }) => Promise<void>;
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
  crawlAndFetchRecommendations: async (params) => {
    set({ loading: true, error: null, message: null, recommendations: null });
    try {
      const response = await crawlAndRecommendRecipes(params);
      if (response.message) {
        set({ message: response.message, loading: false });
      } else {
        set({ recommendations: response, loading: false });
      }
    } catch (error) {
      console.error("Error crawling and fetching recommendations:", error);
      set({ error: '레시피를 크롤링하고 추천을 받아오는 중 오류가 발생했습니다.', loading: false });
    }
  },
}));

export default useRecommendationStore;
