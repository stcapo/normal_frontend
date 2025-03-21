import resources from '../mock/resources';
import downloads from '../mock/downloads';
import users from '../mock/users';

// 获取所有资源
export const getAllResources = () => {
  return resources;
};

// 根据ID获取资源
export const getResourceById = (id) => {
  return resources.find(resource => resource.id === id);
};

// 根据上传者ID获取资源
export const getResourcesByUploader = (uploaderId) => {
  return resources.filter(resource => resource.uploader === uploaderId);
};

// 根据学科分类获取资源
export const getResourcesBySubject = (subject) => {
  return resources.filter(resource => resource.subject === subject);
};

// 根据资源类型获取资源
export const getResourcesByType = (type) => {
  return resources.filter(resource => resource.type === type);
};

// 搜索资源
export const searchResources = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  return resources.filter(resource => 
    resource.title.toLowerCase().includes(lowerKeyword) ||
    resource.description.toLowerCase().includes(lowerKeyword) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
};

// 获取热门资源（按下载量排序）
export const getPopularResources = (limit = 5) => {
  return [...resources].sort((a, b) => b.downloads - a.downloads).slice(0, limit);
};

// 获取最新资源（按上传时间排序）
export const getLatestResources = (limit = 5) => {
  return [...resources].sort((a, b) => 
    new Date(b.uploadTime) - new Date(a.uploadTime)
  ).slice(0, limit);
};

// 模拟上传资源
export const uploadResource = (resourceData) => {
  const newResource = {
    id: resources.length + 1,
    ...resourceData,
    views: 0,
    downloads: 0,
    rating: 0,
    comments: [],
    uploadTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  
  resources.push(newResource);
  return newResource;
};

// 模拟编辑资源
export const editResource = (id, updatedData) => {
  const index = resources.findIndex(resource => resource.id === id);
  if (index === -1) return false;
  
  resources[index] = { ...resources[index], ...updatedData };
  return resources[index];
};

// 模拟删除资源
export const deleteResource = (id) => {
  const index = resources.findIndex(resource => resource.id === id);
  if (index === -1) return false;
  
  resources.splice(index, 1);
  return true;
};

// 模拟下载资源
export const downloadResource = (resourceId, userId) => {
  const resource = getResourceById(resourceId);
  if (!resource) return false;
  
  // 增加下载记录
  const newDownload = {
    id: downloads.length + 1,
    resourceId,
    userId,
    downloadTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    ip: '192.168.1.' + Math.floor(Math.random() * 255)
  };
  
  downloads.push(newDownload);
  
  // 更新资源下载量
  const index = resources.findIndex(r => r.id === resourceId);
  if (index !== -1) {
    resources[index].downloads += 1;
  }
  
  return true;
};

// 获取用户下载记录
export const getUserDownloads = (userId) => {
  const userDownloads = downloads.filter(download => download.userId === userId);
  
  // 添加资源和上传者信息
  return userDownloads.map(download => {
    const resource = getResourceById(download.resourceId);
    const uploader = users.find(user => user.id === resource.uploader);
    
    return {
      ...download,
      resource: {
        id: resource.id,
        title: resource.title,
        subject: resource.subject,
        type: resource.type,
        format: resource.format
      },
      uploader: {
        id: uploader.id,
        name: uploader.name,
        department: uploader.department
      }
    };
  });
};

// 评价资源
export const rateResource = (resourceId, rating) => {
  const resource = getResourceById(resourceId);
  if (!resource) return false;
  
  // 简单的评分更新逻辑（实际应用中需要更复杂的逻辑）
  const index = resources.findIndex(r => r.id === resourceId);
  if (index !== -1) {
    // 模拟一个更新平均评分的简单算法
    resources[index].rating = ((resources[index].rating * resources[index].downloads) + rating) / (resources[index].downloads + 1);
  }
  
  return true;
};

// 添加评论
export const addComment = (resourceId, userId, content) => {
  const resource = getResourceById(resourceId);
  if (!resource) return false;
  
  const newComment = {
    id: resource.comments.length + 1,
    userId,
    content,
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    replies: []
  };
  
  const index = resources.findIndex(r => r.id === resourceId);
  if (index !== -1) {
    resources[index].comments.push(newComment);
  }
  
  return newComment;
};

// 添加评论回复
export const addReply = (resourceId, commentId, userId, content) => {
  const resource = getResourceById(resourceId);
  if (!resource) return false;
  
  const commentIndex = resource.comments.findIndex(comment => comment.id === commentId);
  if (commentIndex === -1) return false;
  
  const newReply = {
    id: resource.comments[commentIndex].replies.length + 1,
    userId,
    content,
    time: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  
  const resourceIndex = resources.findIndex(r => r.id === resourceId);
  if (resourceIndex !== -1) {
    resources[resourceIndex].comments[commentIndex].replies.push(newReply);
  }
  
  return newReply;
};

// 获取所有学科
export const getAllSubjects = () => {
  const subjects = new Set(resources.map(resource => resource.subject));
  return Array.from(subjects);
};

// 获取所有资源类型
export const getAllResourceTypes = () => {
  const types = new Set(resources.map(resource => resource.type));
  return Array.from(types);
};
