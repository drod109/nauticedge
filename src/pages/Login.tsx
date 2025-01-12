import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <LoginForm />
    </div>
  );
};

export default Login;