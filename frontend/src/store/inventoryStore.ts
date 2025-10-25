import { create } from 'zustand';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  expiry_date: string;
}

interface InventoryState {
  inventory: Ingredient[];
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  deleteIngredient: (id: number) => void;
}

const useInventoryStore = create<InventoryState>((set) => ({
  inventory: [
    { id: 1, name: '계란', quantity: '10개', expiry_date: '2025-11-10' },
    { id: 2, name: '우유', quantity: '1개', expiry_date: '2025-11-05' },
    { id: 3, name: '대파', quantity: '1단', expiry_date: '2025-11-08' },
  ],
  addIngredient: (ingredient) =>
    set((state) => ({
      inventory: [...state.inventory, { ...ingredient, id: Date.now() }],
    })),
  deleteIngredient: (id) =>
    set((state) => ({
      inventory: state.inventory.filter((item) => item.id !== id),
    })),
}));

export default useInventoryStore;
