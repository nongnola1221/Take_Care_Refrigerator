import { useEffect } from 'react';
import AddIngredientForm from '../components/AddIngredientForm';
import InventoryList from '../components/InventoryList';
import useInventoryStore from '../store/inventoryStore';

const InventoryPage = () => {
  const fetchInventory = useInventoryStore((state) => state.fetchInventory);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <div className="space-y-8">
      <AddIngredientForm />
      <InventoryList />
    </div>
  );
};

export default InventoryPage;
