import { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../api/axios';
import type { Recipe } from '../store/recommendationStore';

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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{recipe.name}</h3>
        <div className="flex items-center mb-4">
          <span className="px-2 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full mr-2">
            {recipe.cuisine_type}
          </span>
          <span className="px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
            {recipe.serving_size}인분
          </span>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold text-lg mb-2">필요한 재료:</h4>
          <ul className="list-disc list-inside text-gray-700">
            {recipe.Ingredients.map(ing => (
              <li key={ing.id}>
                {ing.name} ({ing.RecipeIngredient.quantity})
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold text-lg mb-2">조리법:</h4>
          <p className="text-gray-700 whitespace-pre-line">{recipe.instructions}</p>
        </div>

        {showTips && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-md mb-2">주재료 보관법 팁 🍯</h5>
            <ul className="list-disc list-inside text-gray-600">
              {tips.map(tip => (
                <li key={tip.name}><strong>{tip.name}:</strong> {tip.storage_tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-between gap-2">
          <button onClick={handleShowTips} disabled={tipsLoading} className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400">
            {tipsLoading ? '로딩중...' : (showTips ? '팁 숨기기' : '보관법 보기')}
          </button>
          <button onClick={handleCooked} className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded hover:bg-teal-600 transition-colors">
            요리 완료!
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;