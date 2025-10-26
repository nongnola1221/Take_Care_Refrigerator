import { Row, Col, Typography, Card, Divider } from 'antd';
import AddIngredientForm from '../components/AddIngredientForm';
import InventoryList from '../components/InventoryList';

const { Title } = Typography;

const InventoryPage = () => {
  return (
    <div className="p-4 md:p-8">
      <Title level={2} className="text-center text-white mb-8">나의 냉장고 재고</Title>
      <Row justify="center">
        <Col xs={24} md={20} lg={16} xl={12}>
          <Card className="shadow-lg rounded-2xl">
            <Title level={4}>새 재료 추가</Title>
            <AddIngredientForm />
            <Divider />
            <Title level={4}>나의 재고 목록</Title>
            <InventoryList />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InventoryPage;