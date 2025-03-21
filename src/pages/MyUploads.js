import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  message, 
  Tooltip,
  Modal,
  Input
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  DownloadOutlined, 
  StarOutlined,
  SearchOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getResourcesByUploader, deleteResource } from '../utils/resourceUtils';

const { Title } = Typography;
const { confirm } = Modal;

const MyUploads = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  // 加载用户上传的资源
  useEffect(() => {
    if (currentUser) {
      const userResources = getResourcesByUploader(currentUser.id);
      setResources(userResources);
      setLoading(false);
    }
  }, [currentUser]);
  
  // 资源类型对应的标签颜色
  const typeColors = {
    '课件': 'blue',
    '视频': 'purple',
    '教案': 'green',
    '试题': 'orange',
    '其他': 'default'
  };
  
  // 处理删除单个资源
  const handleDelete = (id) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除此资源吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const success = deleteResource(id);
        if (success) {
          message.success('资源已删除');
          // 更新资源列表
          const updatedResources = resources.filter(resource => resource.id !== id);
          setResources(updatedResources);
        } else {
          message.error('删除失败');
        }
      },
    });
  };
  
  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的资源');
      return;
    }
    
    confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 个资源吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        let successCount = 0;
        let failCount = 0;
        
        selectedRowKeys.forEach(id => {
          const success = deleteResource(id);
          if (success) {
            successCount++;
          } else {
            failCount++;
          }
        });
        
        if (successCount > 0) {
          message.success(`成功删除 ${successCount} 个资源`);
          // 更新资源列表
          const updatedResources = resources.filter(resource => !selectedRowKeys.includes(resource.id));
          setResources(updatedResources);
          setSelectedRowKeys([]);
        }
        
        if (failCount > 0) {
          message.error(`${failCount} 个资源删除失败`);
        }
      },
    });
  };
  
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
  
  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '资源标题',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
      render: (text, record) => (
        <Link to={`/resources/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: '学科',
      dataIndex: 'subject',
      key: 'subject',
      width: 100,
      filters: [...new Set(resources.map(item => item.subject))].map(subject => ({
        text: subject,
        value: subject,
      })),
      onFilter: (value, record) => record.subject === value,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      filters: [...new Set(resources.map(item => item.type))].map(type => ({
        text: type,
        value: type,
      })),
      onFilter: (value, record) => record.type === value,
      render: type => (
        <Tag color={typeColors[type] || 'default'}>{type}</Tag>
      ),
    },
    {
      title: '格式',
      dataIndex: 'format',
      key: 'format',
      width: 80,
      render: format => format.toUpperCase(),
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 160,
      sorter: (a, b) => new Date(a.uploadTime) - new Date(b.uploadTime),
      defaultSortOrder: 'descend',
    },
    {
      title: '下载量',
      dataIndex: 'downloads',
      key: 'downloads',
      width: 90,
      sorter: (a, b) => a.downloads - b.downloads,
      render: downloads => (
        <Space>
          <DownloadOutlined />
          {downloads}
        </Space>
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      sorter: (a, b) => a.rating - b.rating,
      render: rating => (
        <Space>
          <StarOutlined />
          {rating}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/resources/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/edit-resource/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: keys => setSelectedRowKeys(keys),
  };
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">我的上传</Title>
        
        <Card className="custom-card">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button 
                type="primary" 
                onClick={() => navigate('/upload-resource')}
              >
                上传新资源
              </Button>
              <Button 
                danger 
                onClick={handleBatchDelete} 
                disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
              <span style={{ marginLeft: 8 }}>
                {selectedRowKeys.length > 0 ? `已选择 ${selectedRowKeys.length} 项` : ''}
              </span>
            </Space>
          </div>
          
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={resources}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `共 ${total} 个资源`
            }}
            loading={loading}
            scroll={{ x: 1100 }}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default MyUploads;
