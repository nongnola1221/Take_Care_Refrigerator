import { useEffect } from 'react';
import { List, Button, Tag, Typography } from 'antd';
import useInventoryStore from '../store/inventoryStore';
import moment from 'moment';

const { Text } = Typography;

const InventoryList = () => {
  const { inventory, fetchInventory, deleteIngredient } = useInventoryStore();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const getExpiryStatus = (expiryDate: string) => {
    const today = moment().startOf('day');
    const expiry = moment(expiryDate).startOf('day');
    const diffDays = expiry.diff(today, 'days');

    if (diffDays < 0) return <Tag color="#f5222d">만료</Tag>;
    if (diffDays <= 3) return <Tag color="#faad14">D-{diffDays}</Tag>;
    return <Tag color="#52c41a">{diffDays}일 남음</Tag>;
  };

  const EmptyList = () => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Text type="secondary">현재 재고가 없습니다. 새 재료를 추가해주세요.</Text>
    </div>
  );

  return (
    <List
      itemLayout="horizontal"
      dataSource={inventory}
      locale={{ emptyText: <EmptyList /> }}
      renderItem={item => (
        <List.Item
          actions={[<Button type="text" danger onClick={() => deleteIngredient(item.id)}>삭제</Button>]}
          className="bg-white rounded-lg mb-2 p-4 shadow-sm"
        >
          <List.Item.Meta
            title={<Text strong>{item.Ingredient.name}</Text>}
            description={<Text type="secondary">수량: {item.quantity}</Text>}
          />
          <div>{getExpiryStatus(item.expiry_date)}</div>
        </List.Item>
      )}
    />
  );
};

export default InventoryList;
