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

interface InventoryState {
  inventory: InventoryItem[];
  fetchInventory: () => Promise<void>;
  addIngredient: (data: { ingredientName: string; quantity: string; expiry_date: string }) => Promise<void>;
  deleteIngredient: (id: number) => Promise<void>;
}

const useInventoryStore = create<InventoryState>((set) => ({
  inventory: [],
  fetchInventory: async () => {
    try {
      const response = await apiClient.get('/inventory');
      set({ inventory: response.data });
    } catch (error) {
      console.error("Error fetching inventory:", error);
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