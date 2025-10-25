import { useState } from 'react';
import useInventoryStore from '../store/inventoryStore';

const AddIngredientForm = () => {
  const addIngredient = useInventoryStore((state) => state.addIngredient);
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiry_date, setExpiryDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientName || !quantity || !expiry_date) return;
    addIngredient({ ingredientName, quantity, expiry_date });
    setIngredientName('');
    setQuantity('');
    setExpiryDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold">새 재료 추가</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="재료명 (예: 삼겹살)"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="수량 (예: 500g)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={expiry_date}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        추가하기
      </button>
    </form>
  );
};

export default AddIngredientForm;