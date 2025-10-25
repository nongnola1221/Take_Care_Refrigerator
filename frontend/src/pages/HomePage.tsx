import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import useRecommendationStore from '../store/recommendationStore';
import RecipeCard from '../components/RecipeCard';

const HomePage = () => {
  const {
    recommendations,
    loading,
    error,
    message,
    fetchRecommendations,
  } = useRecommendationStore();

  const [cuisine, setCuisine] = useState('');
  const [servings, setServings] = useState<number | undefined>(undefined);

  const handleRecommendClick = () => {
    fetchRecommendations({
      cuisine_type: cuisine || undefined,
      serving_size: servings,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">레시피 추천받기</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">요리 종류 (전체)</option>
            <option value="한식">한식</option>
            <option value="양식">양식</option>
            <option value="중식">중식</option>
          </select>
          <input
            type="number"
            placeholder="최대 인분 (예: 2)"
            onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : undefined)}
            className="p-2 border rounded"
            min="1"
          />
          <button
            onClick={handleRecommendClick}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? '찾는 중...' : '추천받기'}
          </button>
        </div>
      </div>

      <div>
        {error && <p className="text-center text-red-500">{error}</p>}
        {message && <p className="text-center text-xl text-gray-600">{message}</p>}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations?.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;