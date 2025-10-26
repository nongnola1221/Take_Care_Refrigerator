import { create } from 'zustand';
import apiClient from '../api/axios';

// Interface matching the backend response
interface InventoryItem {
  id: number;
  quantity: string;
  expiry_date: string;
  Ingredient: {
    name: string;
  };
}

interface Ingredient {
  id: number;
  name: string;
}

interface InventoryState {
  inventory: InventoryItem[];
  allIngredients: Ingredient[];
  fetchInventory: () => Promise<void>;
  fetchAllIngredients: () => Promise<void>;
  addIngredient: (data: { ingredientName: string; quantity: string; expiry_date: string }) => Promise<void>;
  deleteIngredient: (id: number) => Promise<void>;
}

const useInventoryStore = create<InventoryState>((set, get) => ({
  inventory: [],
  allIngredients: [],
  fetchInventory: async () => {
    try {
      const response = await apiClient.get('/inventory');
      set({ inventory: response.data });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      notification.error({
        message: '재고 목록 로딩 실패',
        description: '재고 목록을 불러오는 중 오류가 발생했습니다.',
      });
    }
  },
  fetchAllIngredients: async () => {
    try {
      const response = await apiClient.get('/ingredients');
      set({ allIngredients: response.data });
    } catch (error) {
      console.error("Error fetching all ingredients:", error);
      notification.error({
        message: '재료 목록 로딩 실패',
        description: '전체 재료 목록을 불러오는 중 오류가 발생했습니다.',
      });
    }
  },
  addIngredient: async (data) => {
    try {
      await apiClient.post('/inventory', data);
      // After adding, fetch the whole list again to get the updated data with ingredient name
      const updatedInventory = await apiClient.get('/inventory');
      set({ inventory: updatedInventory.data });
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  },
  deleteIngredient: async (id) => {
    try {
      await apiClient.delete(`/inventory/${id}`);
      set((state) => ({
        inventory: state.inventory.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  },
}));

export default useInventoryStore;