import { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const success = await login(values);
    setLoading(false);
    if (success) {
      navigate('/');
      notification.success({ message: '로그인 성공!', description: '냉장고를 부탁해에 오신 것을 환영합니다.' });
    } else {
      notification.error({ message: '로그인 실패', description: useAuthStore.getState().error });
    }
  };

  return (
    <div className="min-h-screen w-full main-bg-gradient flex items-center justify-center p-4">
      <div className="bg-glass p-8 rounded-2xl w-full max-w-md">
        <Title level={2} className="text-center text-white mb-8 font-bold">로그인</Title>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: '이메일을 입력해주세요!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="이메일 주소" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" loading={loading} className="w-full h-12 text-lg font-bold btn-grad rounded-full">
              로그인
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text className="text-gray-300">계정이 없으신가요? </Text>
            <Link to="/register" className="font-semibold text-white hover:text-gray-200">회원가입</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;