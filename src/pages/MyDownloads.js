import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Input,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getUserDownloads, downloadResource } from '../utils/resourceUtils';

const { Title } = Typography;

const MyDownloads = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  
  // 加载用户下载记录
  useEffect(() => {
    if (currentUser) {
      const userDownloads = getUserDownloads(currentUser.id);
      setDownloads(userDownloads);
      setLoading(false);
    }
  }, [currentUser]);
  
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
    onFilter: (value, record) => {
      const dataPath = dataIndex.split('.');
      let dataValue = record;
      for (const path of dataPath) {
        dataValue = dataValue[path];
        if (!dataValue) break;
      }
      return dataValue
        ? dataValue.toString().toLowerCase().includes(value.toLowerCase())
        : '';
    },
    render: (text, record) => {
      const dataPath = dataIndex.split('.');
      let dataValue = record;
      for (const path of dataPath) {
        dataValue = dataValue[path];
        if (!dataValue) break;
      }
      
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={dataValue ? dataValue.toString() : ''}
        />
      ) : (
        text
      );
    },
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
  
  // 重新下载资源
  const handleRedownload = (resourceId) => {
    const success = downloadResource(resourceId, currentUser.id);
    if (success) {
      // 获取最新的下载记录
      const updatedDownloads = getUserDownloads(currentUser.id);
      setDownloads(updatedDownloads);
    }
  };
  
  // 资源类型对应的标签颜色
  const typeColors = {
    '课件': 'blue',
    '视频': 'purple',
    '教案': 'green',
    '试题': 'orange',
    '其他': 'default'
  };
  
  // 表格列定义
  const columns = [
    {
      title: '资源标题',
      dataIndex: ['resource', 'title'],
      key: 'title',
      ...getColumnSearchProps('resource.title'),
      render: (text, record) => (
        <Link to={`/resources/${record.resource.id}`}>{text}</Link>
      ),
    },
    {
      title: '学科',
      dataIndex: ['resource', 'subject'],
      key: 'subject',
      width: 120,
      filters: [...new Set(downloads.map(item => item.resource.subject))].map(subject => ({
        text: subject,
        value: subject,
      })),
      onFilter: (value, record) => record.resource.subject === value,
    },
    {
      title: '类型',
      dataIndex: ['resource', 'type'],
      key: 'type',
      width: 100,
      filters: [...new Set(downloads.map(item => item.resource.type))].map(type => ({
        text: type,
        value: type,
      })),
      onFilter: (value, record) => record.resource.type === value,
      render: type => (
        <Tag color={typeColors[type] || 'default'}>{type}</Tag>
      ),
    },
    {
      title: '格式',
      dataIndex: ['resource', 'format'],
      key: 'format',
      width: 80,
      render: format => format.toUpperCase(),
    },
    {
      title: '上传者',
      dataIndex: ['uploader', 'name'],
      key: 'uploader',
      width: 120,
    },
    {
      title: '下载时间',
      dataIndex: 'downloadTime',
      key: 'downloadTime',
      width: 160,
      sorter: (a, b) => new Date(a.downloadTime) - new Date(b.downloadTime),
      defaultSortOrder: 'descend',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看资源">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/resources/${record.resource.id}`)}
            />
          </Tooltip>
          <Tooltip title="重新下载">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              onClick={() => handleRedownload(record.resource.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  return (
    <AppLayout>
      <div className="fade-in">
        <Title level={2} className="page-title">我的下载</Title>
        
        <Card className="custom-card">
          <Table
            columns={columns}
            dataSource={downloads}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `共 ${total} 条下载记录`
            }}
            loading={loading}
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default MyDownloads;
