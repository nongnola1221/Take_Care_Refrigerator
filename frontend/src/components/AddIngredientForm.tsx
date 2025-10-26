import { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, AutoComplete, Row, Col } from 'antd';
import useInventoryStore from '../store/inventoryStore';

const AddIngredientForm = () => {
  const [form] = Form.useForm();
  const { addIngredient, allIngredients, fetchAllIngredients } = useInventoryStore();
  const [options, setOptions] = useState<{ value: string }[]>([]);

  useEffect(() => {
    fetchAllIngredients();
  }, [fetchAllIngredients]);

  const handleSearch = (searchText: string) => {
    if (!searchText) {
      setOptions([]);
    } else {
      const filtered = allIngredients
        .filter(i => i.name.toLowerCase().includes(searchText.toLowerCase()))
        .map(i => ({ value: i.name }));
      setOptions(filtered);
    }
  };

  const onFinish = async (values: any) => {
    const { ingredientName, quantity, expiry_date } = values;
    await addIngredient({
      ingredientName,
      quantity,
      expiry_date: expiry_date.format('YYYY-MM-DD'),
    });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      name="add_ingredient"
      onFinish={onFinish}
      layout="vertical"
    >
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="ingredientName"
            label="재료명"
            rules={[{ required: true, message: '재료명을 입력해주세요!' }]}
          >
            <AutoComplete
              options={options}
              onSearch={handleSearch}
              placeholder="예: 돼지고기"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="quantity"
            label="수량"
            rules={[{ required: true, message: '수량을 입력해주세요!' }]}
          >
            <Input placeholder="예: 500g" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="expiry_date"
        label="유통기한"
        rules={[{ required: true, message: '유통기한을 입력해주세요!' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" className="w-full h-12 text-lg font-bold btn-grad rounded-full">
          추가하기
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddIngredientForm;

