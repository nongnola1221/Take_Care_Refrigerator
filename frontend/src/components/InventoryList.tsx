import { AnimatePresence, motion } from 'framer-motion';
import useInventoryStore from '../store/inventoryStore';

const InventoryList = () => {
  const { inventory, deleteIngredient } = useInventoryStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-white mb-4">나의 재고 목록</h2>
      <ul className="space-y-3">
        <AnimatePresence>
          {inventory.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
              className="flex justify-between items-center p-4 bg-white/10 rounded-lg shadow-md backdrop-blur-md border border-white/20"
            >
              <div>
                <p className="font-semibold text-white">{item.Ingredient.name}</p>
                <p className="text-sm text-white/80">
                  수량: {item.quantity} | 유통기한: {new Date(item.expiry_date).toLocaleDateString()}
                </p>
              </div>
              <motion.button
                onClick={() => deleteIngredient(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                삭제
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
};

export default InventoryList;
