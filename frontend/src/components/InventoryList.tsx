import { AnimatePresence, motion } from 'framer-motion';
import useInventoryStore from '../store/inventoryStore';

const InventoryList = () => {
  const { inventory, deleteIngredient } = useInventoryStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">나의 재고</h2>
      <ul className="space-y-3">
        <AnimatePresence>
          {inventory.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
            >
              <div>
                <p className="font-semibold">{item.Ingredient.name}</p>
                <p className="text-sm text-gray-600">
                  수량: {item.quantity} | 유통기한: {new Date(item.expiry_date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => deleteIngredient(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default InventoryList;