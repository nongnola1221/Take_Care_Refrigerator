import { Card, Button, Tag, Collapse, Typography, notification } from 'antd';
import type { Recipe, IngredientWithDetails } from '../store/recommendationStore'; // Updated import
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { ClockCircleOutlined, StarFilled } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text, Title } = Typography;

interface RecipeCardProps {
  recipe: Recipe;
}

// Helper to render difficulty stars
const renderDifficulty = (level: number) => {
  const stars = [];
  for (let i = 0; i < 3; i++) {
    stars.push(<StarFilled key={i} style={{ color: i < level ? '#fadb14' : '#d9d9d9' }} />);
  }
  return <span>{stars}</span>;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const handleCooked = async () => {
    try {
      // Assuming apiClient is still available globally or imported if needed
      // For now, keeping it simple without direct API client import here
      // You might need to re-import apiClient if this action needs to hit the backend
      notification.success({ message: `'${recipe.name}' 요리 완료! 맛있게 드세요!`, icon: <FiCheckCircle /> });
    } catch (error) {
      console.error("Error logging action:", error);
      notification.error({ message: '요리 완료를 기록하는 데 실패했습니다.', icon: <FiAlertCircle /> });
    }
  };

  const difficultyMap = { 1: '하', 2: '중', 3: '상' };

  return (
    <Card
      hoverable
      className="shadow-lg rounded-2xl h-full flex flex-col"
      bodyStyle={{ flex: 1 }}
      cover={recipe.image_url && <img alt={recipe.name} src={recipe.image_url} className="w-full h-48 object-cover rounded-t-2xl" />}
      actions={[
        <Button onClick={handleCooked} type="primary" className="btn-grad rounded-full mx-4">요리 완료!</Button>,
        recipe.original_url && <Button type="link" href={recipe.original_url} target="_blank" rel="noopener noreferrer">원본 보기</Button>
      ]}
    >
      <Title level={4} className="text-center mb-2">{recipe.name}</Title>
      <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
            {recipe.cuisine_type && <Tag color="blue">{recipe.cuisine_type}</Tag>}
            {recipe.category && <Tag color="purple">{recipe.category}</Tag>}
            {recipe.serving_size && <Tag color="green">{recipe.serving_size}인분</Tag>}
        </div>
        <div className="flex items-center gap-2">
            {recipe.cooking_time && <span className="flex items-center gap-1"><ClockCircleOutlined /> {recipe.cooking_time}</span>}
            {recipe.difficulty && <span className="flex items-center gap-1">난이도: {difficultyMap[recipe.difficulty]}</span>}
        </div>
      </div>

      {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
        <div className="mb-4">
          <Title level={5} className="text-red-500">부족한 재료:</Title>
          <Text className="text-red-400">
            {recipe.missing_ingredients.join(', ')}
          </Text>
        </div>
      )}

      <div className="mb-4">
        <Title level={5}>필요한 재료:</Title>
        <ul className="list-disc list-inside">
          {recipe.ingredients?.map((ing: IngredientWithDetails, index) => (
            <li key={index} className={ing.has_in_inventory ? 'text-green-400' : 'text-gray-400'}>
              {ing.name} ({ing.quantity}) {ing.has_in_inventory && <FiCheckCircle className="inline-block ml-1" />}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <Title level={5}>조리법:</Title>
        <Text>{recipe.instructions}</Text>
      </div>

      {recipe.ingredients && recipe.ingredients.some(ing => ing.storage_tip) && (
        <Collapse>
          <Panel header="주재료 보관법 🍯" key="1">
            <ul>
              {recipe.ingredients.filter(ing => ing.storage_tip).map((ing: IngredientWithDetails, index) => (
                <li key={index}><strong>{ing.name}:</strong> {ing.storage_tip}</li>
              ))}
            </ul>
          </Panel>
        </Collapse>
      )}
    </Card>
  );
};

export default RecipeCard;