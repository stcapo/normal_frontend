import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Modal, 
  Form,
  Select,
  message,
  Switch,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  MailOutlined,
  BankOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import users from '../mock/users';

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  
  // 加载用户数据
  useEffect(() => {
    // 管理员可以看到所有用户，但不包括自己
    const filteredUsers = users.filter(user => user.id !== currentUser.id);
    setUserData(filteredUsers);
    setLoading(false);
  }, [currentUser.id]);
  
  // 搜索功能
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };
  
  // 添加新用户
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };
  
  // 编辑用户
  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      studentId: user.studentId,
      status: user.status === 'active'
    });
    setModalVisible(true);
  };
  
  // 删除用户
  const handleDeleteUser = (userId) => {
    // 在实际应用中，这里应该调用API删除用户
    // 这里我们就简单地从本地数组中删除
    const updatedUsers = userData.filter(user => user.id !== userId);
    setUserData(updatedUsers);
    message.success('用户已删除');
  };
  
  // 提交表单
  const handleSubmit = (values) => {
    if (editingUser) {
      // 更新用户
      const updatedUser = {
        ...editingUser,
        username: values.username,
        email: values.email,
        name: values.name,
        role: values.role,
        department: values.department,
        studentId: values.studentId,
        status: values.status ? 'active' : 'inactive'
      };
      
      const updatedUsers = userData.map(user => 
        user.id === editingUser.id ? updatedUser : user
      );
      
      setUserData(updatedUsers);
      message.success('用户信息更新成功');
    } else {
      // 添加新用户
      const newUser = {
        id: Math.max(...userData.map(user => user.id)) + 1,
        username: values.username,
        password: values.password || '123456', // 默认密码
        email: values.email,
        name: values.name,
        role: values.role,
        department: values.department,
        studentId: values.studentId,
        status: values.status ? 'active' : 'inactive',
        avatar: '',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      };
      
      setUserData([...userData, newUser]);
      message.success('新用户创建成功');
    }
    
    setModalVisible(false);
  };
  
  // 角色标签颜色
  const roleColors = {
    'admin': 'red',
    'teacher': 'blue',
    'student': 'green'
  };
  
  // 角色中文名称
  const roleNames = {
    'admin': '管理员',
    'teacher': '教师',
    'student': '学生'
  };
  
  // 定义表格列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      ...getColumnSearchProps('username')
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '教师', value: 'teacher' },
        { text: '学生', value: 'student' }
      ],
      onFilter: (value, record) => record.role === value,
      render: role => (
        <Tag color={roleColors[role] || 'default'}>
          {roleNames[role] || role}
        </Tag>
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      responsive: ['md']
    },
    {
      title: '院系',
      dataIndex: 'department',
      key: 'department',
      ...getColumnSearchProps('department'),
      responsive: ['lg']
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: '正常', value: 'active' },
        { text: '禁用', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === value,
      render: status => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      )
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      responsive: ['lg']
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      responsive: ['xl']
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑用户">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="删除用户">
            <Popconfirm
              title="确定要删除此用户吗？"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="删除"
              cancelText="取消"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">用户管理</Title>
        
        <Card className="custom-card">
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
            >
              添加用户
            </Button>
          </div>
          
          <Table
            columns={columns}
            dataSource={userData}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `共 ${total} 个用户`
            }}
            loading={loading}
            scroll={{ x: 1100 }}
          />
        </Card>
        
        {/* 用户编辑/添加对话框 */}
        <Modal
          title={editingUser ? '编辑用户' : '添加用户'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
            </Form.Item>
            
            {!editingUser && (
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
              </Form.Item>
            )}
            
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
            </Form.Item>
            
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
            </Form.Item>
            
            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                <Option value="admin">管理员</Option>
                <Option value="teacher">教师</Option>
                <Option value="student">学生</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="department"
              label="院系"
              rules={[{ required: true, message: '请输入院系' }]}
            >
              <Input prefix={<BankOutlined />} placeholder="请输入院系" />
            </Form.Item>
            
            <Form.Item
              name="studentId"
              label="学号"
              dependencies={['role']}
              rules={[
                ({ getFieldValue }) => ({
                  required: getFieldValue('role') === 'student',
                  message: '学生角色必须填写学号',
                }),
              ]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="请输入学号" />
            </Form.Item>
            
            <Form.Item
              name="status"
              label="账号状态"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="正常" unCheckedChildren="禁用" />
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingUser ? '保存' : '添加'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default UserManagement;
