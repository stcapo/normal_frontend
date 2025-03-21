import React, { createContext, useState, useEffect, useContext } from 'react';
import users from '../mock/users';

// 创建认证上下文
const AuthContext = createContext();

// 自定义钩子方便使用认证上下文
export const useAuth = () => {
  return useContext(AuthContext);
};

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 模拟从本地存储加载用户
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // 登录函数
  const login = (username, password) => {
    setError('');
    const user = users.find(
      u => (u.username === username || u.email === username || u.studentId === username) && 
           u.password === password
    );
    
    if (user) {
      // 为了安全，不要在本地保存密码
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    } else {
      setError('用户名或密码错误');
      return false;
    }
  };
  
  // 注册函数
  const register = (userData) => {
    setError('');
    // 检查用户是否已存在
    const existingUser = users.find(
      u => u.username === userData.username || u.email === userData.email
    );
    
    if (existingUser) {
      setError('用户名或邮箱已存在');
      return false;
    }
    
    // 模拟注册 (实际应用中会发送到服务器)
    const newUser = {
      id: users.length + 1,
      ...userData,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'active'
    };
    
    // 模拟添加到用户列表
    users.push(newUser);
    
    // 自动登录新用户
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return true;
  };
  
  // 登出函数
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  // 找回密码函数
  const recoverPassword = (email) => {
    setError('');
    const user = users.find(u => u.email === email);
    
    if (user) {
      // 模拟发送重置密码邮件 (实际应用中会发送真实邮件)
      // 在这里只是返回成功
      return true;
    } else {
      setError('该邮箱未注册');
      return false;
    }
  };
  
  // 更新用户信息
  const updateUserInfo = (updatedInfo) => {
    if (!currentUser) return false;
    
    // 更新用户信息
    const updatedUser = { ...currentUser, ...updatedInfo };
    
    // 更新本地存储
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // 更新模拟用户列表
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedInfo };
    }
    
    return true;
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    recoverPassword,
    updateUserInfo
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
