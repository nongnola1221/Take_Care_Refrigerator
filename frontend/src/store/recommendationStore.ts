import { create } from 'zustand';
import apiClient from '../api/axios';

export interface IngredientWithDetails {
  name: string;
  quantity?: string;
  has_in_inventory: boolean;
  storage_tip?: string;
}

export interface Recipe {
  id: string;
  name: string;
  image_url?: string;
  original_url?: string;
  cuisine_type?: string;
  category?: string;
  serving_size?: string;
  cooking_time?: string;
  difficulty?: number;
  difficulty_text?: string;
  instructions?: string;
  ingredients: IngredientWithDetails[];
  missing_ingredients: string[];
}

interface RecommendationState {
  recommendations: Recipe[];
  allRecipes: Recipe[]; // New state for all recipes
  loading: boolean;
  error: string | null;
  message: string | null;
  fetchRecommendations: (filters?: any) => Promise<void>;
  fetchAllRecipes: () => Promise<void>; // New function
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [],
  allRecipes: [], // Initialize new state
  loading: false,
  error: null,
  message: null,
  fetchRecommendations: async (filters = {}) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await apiClient.post('/recommendations', filters);
      if (response.data.length === 0) {
        set({ message: '추천할 레시피가 없습니다. 다른 검색어를 시도해보세요.' });
      }
      set({ recommendations: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.error || '추천을 가져오는 데 실패했습니다.' });
    } finally {
      set({ loading: false });
    }
  },
  // New implementation for fetchAllRecipes
  fetchAllRecipes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get<Recipe[]>('/recommendations/all-from-csv');
      set({ allRecipes: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch all recipes', loading: false });
    }
  },
}));