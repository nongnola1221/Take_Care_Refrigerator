import AddIngredientForm from '../components/AddIngredientForm';
import InventoryList from '../components/InventoryList';

const InventoryPage = () => {
  return (
    <div className="space-y-8">
      <AddIngredientForm />
      <InventoryList />
    </div>
  );
};

export default InventoryPage;