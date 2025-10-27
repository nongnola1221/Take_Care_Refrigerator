import { useState } from 'react';
import { Card, Button, Tag, Collapse, Typography, notification } from 'antd';
import apiClient from '../api/axios';
import type { Recipe } from '../store/recommendationStore';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { ClockCircleOutlined, StarFilled } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text, Title } = Typography;

interface RecipeCardProps {
  recipe: Recipe;
}

interface StorageTip {
  name: string;
  storage_tip: string;
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
  const [tips, setTips] = useState<StorageTip[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);

  const handleShowTips = async () => {
    if (tips.length > 0) {
      return;
    }

    setTipsLoading(true);
    try {
      const response = await apiClient.get(`/recipes/${recipe.id}/storage_tip`);
      setTips(response.data);
    } catch (error) {
      console.error("Error fetching storage tips:", error);
      notification.error({ message: '보관법을 가져오는 데 실패했습니다.' });
    }
    setTipsLoading(false);
  };

  const handleCooked = async () => {
    try {
      await apiClient.post('/actions/log', { recipeId: recipe.id, action: 'cooked' });
      notification.success({ message: `'${recipe.name}' 요리 완료! 맛있게 드세요!`, icon: <FiCheckCircle /> });
    } catch (error) {
      console.error("Error logging action:", error);
      notification.error({ message: '요리 완료를 기록하는 데 실패했습니다.', icon: <FiAlertCircle /> });
    }
  };

  return (
    <Card
      hoverable
      title={recipe.name}
      className="shadow-lg rounded-2xl h-full flex flex-col"
      bodyStyle={{ flex: 1 }}
      actions={[
        <Button onClick={handleCooked} type="primary" className="btn-grad rounded-full mx-4">요리 완료!</Button>,
      ]}
    >
      <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
            <Tag color="blue">{recipe.cuisine_type}</Tag>
            <Tag color="green">{recipe.serving_size}인분</Tag>
        </div>
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><ClockCircleOutlined /> {recipe.cooking_time}</span>
            <span className="flex items-center gap-1">{renderDifficulty(recipe.difficulty)}</span>
        </div>
      </div>
      <div className="mb-4">
        <Title level={5}>필요한 재료:</Title>
        <Text>
          {recipe.Ingredients.map(ing => ing.name).join(', ')}
        </Text>
      </div>
      <div className="mb-4">
        <Title level={5}>조리법:</Title>
        <Text>{recipe.instructions}</Text>
      </div>
      <Collapse onChange={handleShowTips}>
        <Panel header="주재료 보관법 🍯" key="1">
          {tipsLoading ? <p>로딩중...</p> : (
            <ul>
              {tips.map(tip => (
                <li key={tip.name}><strong>{tip.name}:</strong> {tip.storage_tip}</li>
              ))}
            </ul>
          )}
        </Panel>
      </Collapse>
    </Card>
  );
};

export default RecipeCard;