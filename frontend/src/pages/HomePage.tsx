import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Select, InputNumber, Button, Row, Col, Typography, Card, Segmented, Input } from 'antd';
import { useRecommendationStore, Recipe } from '../store/recommendationStore';
import RecipeCard from '../components/RecipeCard';

const { Title } = Typography;
const { Option } = Select;

const HomePage = () => {
  const {
    recommendations,
    loading,
    error,
    message,
    fetchRecommendations,
  } = useRecommendationStore();

  const [mode, setMode] = useState<'ingredient' | 'random'>('ingredient');
  const [cuisine, setCuisine] = useState('');
  const [servings, setServings] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // Added search query state
  const [categoryFilter, setCategoryFilter] = useState(''); // Added category filter state
  const [hasSearched, setHasSearched] = useState(false);

  const handleRecommendClick = () => {
    fetchRecommendations({
      cuisine_type: cuisine || undefined,
      serving_size: servings || undefined,
      difficulty: difficulty || undefined,
      searchQuery: searchQuery || undefined, // Pass searchQuery
      categoryFilter: categoryFilter || undefined, // Pass categoryFilter
    });
    setHasSearched(true);
  };

  const handleRandomRecommendClick = () => {
    fetchRecommendations({}); // Random recommendation doesn't need specific filters
    setHasSearched(true);
  };

  const resetSearch = () => {
    setHasSearched(false);
    useRecommendationStore.setState({ recommendations: [], message: null, error: null });
  }

  const recipeCategories = [
    '밑반찬', '메인반찬', '국/탕', '찌개', '디저트', '면/만두', '밥/죽/떡', '퓨전', 
    '양념/잼/소스', '양식', '샐러드', '스프', '빵', '과자', '차/음료/술'
  ];

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-glass mb-8 p-4 rounded-2xl">
        <Title level={2} className="text-center text-white mb-6">레시피 추천기</Title>
        
        <Segmented
          options={[
            { label: '재료 기반 추천', value: 'ingredient' }, 
            { label: '랜덤 추천', value: 'random' },
          ]}
          value={mode}
          onChange={(value) => setMode(value as any)}
          block
          className="mb-6"
        />

        {mode === 'ingredient' && (
          <div className="space-y-4">
            <Input
              placeholder="검색어 (예: 돼지고기 김치찌개)"
              style={{ width: '100%' }}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              size="large"
            />
            <Select
              placeholder="카테고리 필터 (전체)"
              style={{ width: '100%' }}
              onChange={(value) => setCategoryFilter(value)}
              value={categoryFilter || undefined}
              size="large"
            >
              <Option value="">전체</Option>
              {recipeCategories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
            </Select>
            <Select
              placeholder="요리 종류 (전체)"
              style={{ width: '100%' }}
              onChange={(value) => setCuisine(value)}
              value={cuisine || undefined}
              size="large"
            >
              <Option value="">전체</Option>
              <Option value="한식">한식</Option>
              <Option value="양식">양식</Option>
              <Option value="중식">중식</Option>
            </Select>
            <InputNumber
              placeholder="인분 (전체)"
              style={{ width: '100%' }}
              min={1}
              onChange={(value) => setServings(value)}
              value={servings}
              size="large"
            />
            <Select
              placeholder="난이도 (전체)"
              style={{ width: '100%' }}
              onChange={(value) => setDifficulty(value)}
              value={difficulty || undefined}
              size="large"
            >
              <Option value="">전체</Option>
              <Option value={1}>하</Option>
              <Option value={2}>중</Option>
              <Option value={3}>상</Option>
            </Select>
            <Button
              onClick={handleRecommendClick}
              loading={loading}
              className="w-full h-12 text-lg font-bold btn-grad rounded-full"
            >
              레시피 추천받기
            </Button>
          </div>
        )}

        {mode === 'random' && (
           <Button
              onClick={handleRandomRecommendClick}
              loading={loading}
              className="w-full h-12 text-lg font-bold btn-grad rounded-full"
            >
              랜덤 레시피 보기
            </Button>
        )}
      </Card>

      {hasSearched && (
        <div>
          {error && <p className="text-center text-red-200 bg-red-500/30 p-3 rounded-lg">{error}</p>}
          {message && <p className="text-center text-xl text-white/80">{message}</p>}
          {loading && <p className="text-center text-xl text-white/80">레시피를 가져오는 중입니다... (크롤링으로 인해 시간이 다소 소요될 수 있습니다)</p>}
          <AnimatePresence>
            <Row gutter={[16, 16]}>
              {recommendations?.map((recipe: Recipe) => (
                <Col xs={24} sm={12} lg={8} key={recipe.id}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                </Col>
              ))}
            </Row>
          </AnimatePresence>
          {!loading && recommendations?.length === 0 && !error && !message && (
            <p className="text-center text-xl text-white/80 mt-8">추천 레시피가 없습니다.</p>
          )}
          <div className="text-center mt-8">
            <Button onClick={resetSearch} type="primary" size="large" ghost>새로운 검색</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;