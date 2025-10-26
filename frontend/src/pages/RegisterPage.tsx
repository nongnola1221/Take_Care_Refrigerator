import { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const success = await register(values);
    setLoading(false);
    if (success) {
      notification.success({ 
        message: '회원가입 성공!', 
        description: '로그인 페이지로 이동합니다.' 
      });
      navigate('/login');
    } else {
      notification.error({ 
        message: '회원가입 실패', 
        description: useAuthStore.getState().error 
      });
    }
  };

  return (
    <div className="min-h-screen w-full main-bg-gradient flex items-center justify-center p-4">
      <div className="bg-glass p-8 rounded-2xl w-full max-w-md">
        <Title level={2} className="text-center text-white mb-8 font-bold">회원가입</Title>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: '이메일을 입력해주세요!' }, { type: 'email', message: '올바른 이메일 형식이 아닙니다!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="이메일 주소" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '비밀번호를 다시 한번 입력해주세요!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('비밀번호가 일치하지 않습니다!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 확인" />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" loading={loading} className="w-full h-12 text-lg font-bold btn-grad rounded-full">
              회원가입
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text className="text-gray-300">이미 계정이 있으신가요? </Text>
            <Link to="/login" className="font-semibold text-white hover:text-gray-200">로그인</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;

