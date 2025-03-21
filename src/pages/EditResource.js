import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  message, 
  Divider,
  Space,
  Tag,
  Modal
} from 'antd';
import { 
  PlusOutlined, 
  TagOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { 
  getResourceById, 
  editResource, 
  getAllSubjects, 
  getAllResourceTypes 
} from '../utils/resourceUtils';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

const EditResource = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    // 获取资源信息
    const resourceData = getResourceById(parseInt(id));
    if (!resourceData) {
      message.error('资源不存在');
      navigate('/resources');
      return;
    }
    
    // 判断当前用户是否有权限编辑
    if (currentUser.role !== 'admin' && currentUser.id !== resourceData.uploader) {
      message.error('您没有权限编辑此资源');
      navigate(`/resources/${id}`);
      return;
    }
    
    setResource(resourceData);
    setTags(resourceData.tags || []);
    
    // 初始化表单值
    form.setFieldsValue({
      title: resourceData.title,
      description: resourceData.description,
      subject: resourceData.subject,
      type: resourceData.type,
      format: resourceData.format.toUpperCase(),
      size: resourceData.size
    });
    
    // 获取所有学科分类
    setSubjects(getAllSubjects());
    
    // 获取所有资源类型
    setResourceTypes(getAllResourceTypes());
  }, [id, form, currentUser, navigate]);
  
  // 处理标签输入可见性
  const showTagInput = () => {
    setInputVisible(true);
  };
  
  // 处理标签输入确认
  const handleTagInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };
  
  // 处理删除标签
  const handleTagClose = (removedTag) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };
  
  // 处理表单提交
  const handleSubmit = (values) => {
    setLoading(true);
    
    // 确认修改
    confirm({
      title: '确认修改',
      icon: <ExclamationCircleOutlined />,
      content: '确定要保存对此资源的修改吗？',
      onOk() {
        // 准备更新数据
        const updatedData = {
          title: values.title,
          description: values.description,
          subject: values.subject,
          type: values.type,
          tags: tags
        };
        
        // 更新资源
        const result = editResource(parseInt(id), updatedData);
        
        if (result) {
          message.success('资源更新成功');
          // 跳转到资源详情页
          navigate(`/resources/${id}`);
        } else {
          message.error('资源更新失败');
          setLoading(false);
        }
      },
      onCancel() {
        setLoading(false);
      },
    });
  };
  
  if (!resource) {
    return (
      <AppLayout>
        <div className="loading-container">
          <Text>加载中...</Text>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">编辑教学资源</Title>
        
        <Card className="custom-card">
          <Form
            form={form}
            layout="vertical"
            className="custom-form"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="title"
              label="资源标题"
              rules={[{ required: true, message: '请输入资源标题' }]}
            >
              <Input placeholder="请输入资源标题" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="资源描述"
              rules={[{ required: true, message: '请输入资源描述' }]}
            >
              <TextArea rows={4} placeholder="请输入资源描述" />
            </Form.Item>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="subject"
                label="学科分类"
                rules={[{ required: true, message: '请选择学科分类' }]}
                style={{ flex: 1 }}
              >
                <Select placeholder="请选择学科分类">
                  {subjects.map(subject => (
                    <Option key={subject} value={subject}>{subject}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="type"
                label="资源类型"
                rules={[{ required: true, message: '请选择资源类型' }]}
                style={{ flex: 1 }}
              >
                <Select placeholder="请选择资源类型">
                  {resourceTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            
            <Form.Item label="资源标签">
              <div className="tags-container">
                {tags.map(tag => (
                  <Tag
                    closable
                    key={tag}
                    onClose={() => handleTagClose(tag)}
                    className="custom-tag"
                  >
                    {tag}
                  </Tag>
                ))}
                
                {inputVisible ? (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onBlur={handleTagInputConfirm}
                    onPressEnter={handleTagInputConfirm}
                    autoFocus
                  />
                ) : (
                  <Tag onClick={showTagInput} className="custom-tag tag-add">
                    <PlusOutlined /> 添加标签
                  </Tag>
                )}
              </div>
              <Text type="secondary">
                <TagOutlined /> 添加标签有助于其他用户更容易找到您的资源
              </Text>
            </Form.Item>
            
            <Divider />
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="format"
                label="文件格式"
                style={{ flex: 1 }}
              >
                <Input disabled />
              </Form.Item>
              
              <Form.Item
                name="size"
                label="文件大小"
                style={{ flex: 1 }}
              >
                <Input disabled />
              </Form.Item>
            </div>
            
            <Text type="secondary">
              注意：文件本身不能修改，如需更新文件，请删除此资源并重新上传。
            </Text>
            
            <Divider />
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存修改
                </Button>
                <Button onClick={() => navigate(`/resources/${id}`)}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EditResource;
