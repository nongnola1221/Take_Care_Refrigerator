import AddIngredientForm from '../components/AddIngredientForm';
import InventoryList from '../components/InventoryList';

const InventoryPage = () => {
  return (
    <div className="space-y-8 p-6 bg-glass rounded-2xl shadow-2xl backdrop-blur-lg">
      <h2 className="text-3xl font-bold text-white text-center mb-6">나의 냉장고 재고</h2>
      <AddIngredientForm />
      <InventoryList />
    </div>
  );
};

export default InventoryPage;