import { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/axios';
import type { Recipe } from '../store/recommendationStore'; // Assuming Recipe type is exported from store

interface Ingredient {
  id: number;
  name: string;
  storage_tip: string;
  RecipeIngredient: {
    quantity: string;
  };
}

interface RecipeCardProps {
  recipe: Recipe;
}

interface StorageTip {
  name: string;
  storage_tip: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [showTips, setShowTips] = useState(false);
  const [tips, setTips] = useState<StorageTip[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);

  const handleShowTips = async () => {
    if (showTips) {
      setShowTips(false);
      return;
    }

    setTipsLoading(true);
    try {
      const response = await apiClient.get(`/recipes/${recipe.id}/storage_tip`);
      setTips(response.data);
      setShowTips(true);
    } catch (error) {
      console.error("Error fetching storage tips:", error);
      alert('보관법을 가져오는 데 실패했습니다.');
    }
    setTipsLoading(false);
  };

  const handleCooked = async () => {
    try {
      await apiClient.post('/actions/log', { recipeId: recipe.id, action: 'cooked' });
      alert(`'${recipe.name}' 요리 완료! 맛있게 드세요!`);
    } catch (error) {
      console.error("Error logging action:", error);
      alert('요리 완료를 기록하는 데 실패했습니다.');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-glass rounded-2xl shadow-2xl backdrop-blur-lg overflow-hidden p-6 flex flex-col justify-between"
    >
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">{recipe.name}</h3>
        <div className="flex items-center mb-4">
          <span className="px-3 py-1 text-sm font-semibold text-white bg-primary/70 rounded-full mr-2">
            {recipe.cuisine_type}
          </span>
          <span className="px-3 py-1 text-sm font-semibold text-white bg-secondary/70 rounded-full">
            {recipe.serving_size}인분
          </span>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold text-lg text-white/90 mb-2">필요한 재료:</h4>
          <ul className="list-disc list-inside text-white/80 text-sm">
            {recipe.Ingredients.map(ing => (
              <li key={ing.id}>
                {ing.name} ({ing.RecipeIngredient.quantity})
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold text-lg text-white/90 mb-2">조리법:</h4>
          <p className="text-white/80 text-sm whitespace-pre-line">{recipe.instructions}</p>
        </div>

        {showTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-white/10 rounded-lg"
          >
            <h5 className="font-semibold text-md text-white/90 mb-2">주재료 보관법 🍯</h5>
            <ul className="list-disc list-inside text-white/80 text-sm">
              {tips.map(tip => (
                <li key={tip.name}><strong>{tip.name}:</strong> {tip.storage_tip}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2">
        <motion.button onClick={handleShowTips} disabled={tipsLoading} className="w-full px-4 py-3 text-base font-medium text-white bg-primary rounded-lg disabled:bg-primary/50"
          whileHover={{ backgroundColor: "#1a9999", y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {tipsLoading ? '로딩중...' : (showTips ? '팁 숨기기' : '보관법 보기')}
        </motion.button>
        <motion.button onClick={handleCooked} className="w-full px-4 py-3 text-base font-medium text-white bg-secondary rounded-lg"
          whileHover={{ backgroundColor: "#3a5bbd", y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          요리 완료!
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RecipeCard;