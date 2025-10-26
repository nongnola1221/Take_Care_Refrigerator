import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

  const handleRandomRecommendClick = () => {
    setCuisine('');
    setServings(undefined);
    fetchRecommendations({}); // Fetch with no filters for random
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        className="bg-glass p-6 rounded-2xl shadow-2xl backdrop-blur-lg mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">레시피 추천받기</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="p-3 bg-white/10 border border-white/20 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
            className="p-3 bg-white/10 border border-white/20 text-white rounded-md shadow-sm placeholder-white/50 focus:outline-none focus:ring-primary focus:border-primary"
            min="1"
          />
          <motion.button
            onClick={handleRecommendClick}
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/50"
            whileHover={{ backgroundColor: "#1a9999", y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? '찾는 중...' : '추천받기'}
          </motion.button>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <motion.button
            onClick={handleRecommendClick}
            disabled={loading}
            className="px-6 py-3 bg-secondary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-secondary/50"
            whileHover={{ backgroundColor: "#3a5bbd", y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            재검색
          </motion.button>
          <motion.button
            onClick={handleRandomRecommendClick}
            disabled={loading}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 disabled:bg-gray-400"
            whileHover={{ backgroundColor: "#4a4a4a", y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            랜덤 추천
          </motion.button>
        </div>
      </motion.div>

      <div>
        {error && <p className="text-center text-red-200 bg-red-500/30 p-3 rounded-lg">{error}</p>}
        {message && <p className="text-center text-xl text-white/80">{message}</p>}
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