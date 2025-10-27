
import { useEffect } from 'react';
import { useRecommendationStore, Recipe } from '../store/recommendationStore';
import RecipeCard from '../components/RecipeCard';
import { Row, Col, Spin, Typography, Alert } from 'antd';

const { Title } = Typography;

const AllRecipesPage = () => {
  const { allRecipes, loading, error, fetchAllRecipes } = useRecommendationStore();

  useEffect(() => {
    fetchAllRecipes();
  }, [fetchAllRecipes]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="p-4 md:p-8">
      <Title level={2} className="text-center text-white mb-8">모든 레시피</Title>
      <Row gutter={[16, 16]}>
        {allRecipes.map((recipe: Recipe) => (
          <Col key={recipe.id} xs={24} sm={12} md={8} lg={6}>
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AllRecipesPage;
