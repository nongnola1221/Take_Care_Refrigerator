import { motion } from 'framer-motion';

// Define the types based on our backend models
interface Ingredient {
  id: number;
  name: string;
  storage_tip: string;
  RecipeIngredient: {
    quantity: string;
  };
}

interface Recipe {
  id: number;
  name: string;
  instructions: string;
  cuisine_type: string;
  serving_size: number;
  Ingredients: Ingredient[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
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
        <div>
          <h4 className="font-semibold text-lg mb-2">조리법:</h4>
          <p className="text-gray-700 whitespace-pre-line">{recipe.instructions}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
