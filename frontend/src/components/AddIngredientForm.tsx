import { useState } from 'react';
import useInventoryStore from '../store/inventoryStore';

const AddIngredientForm = () => {
  const addIngredient = useInventoryStore((state) => state.addIngredient);
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiry_date, setExpiryDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation temporarily disabled for debugging
    // if (!ingredientName || !quantity || !expiry_date) return;
    await addIngredient({ ingredientName, quantity, expiry_date });
    setIngredientName('');
    setQuantity('');
    setExpiryDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white/10 rounded-2xl shadow-inner backdrop-blur-md space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">새 재료 추가</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="재료명 (예: 삼겹살)"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          className="p-3 bg-white/20 border border-white/30 text-white rounded-md shadow-sm placeholder-white/60 focus:outline-none focus:ring-primary focus:border-primary"
        />
        <input
          type="text"
          placeholder="수량 (예: 500g)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="p-3 bg-white/20 border border-white/30 text-white rounded-md shadow-sm placeholder-white/60 focus:outline-none focus:ring-primary focus:border-primary"
        />
        <input
          type="date"
          value={expiry_date}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="p-3 bg-white/20 border border-white/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <button type="submit" className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-opacity-80 transition-all duration-300">
        추가하기
      </button>
    </form>
  );
};

export default AddIngredientForm;
