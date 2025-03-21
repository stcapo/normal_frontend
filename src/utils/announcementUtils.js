import announcements from '../mock/announcements';
import users from '../mock/users';

// 获取所有公告
export const getAllAnnouncements = () => {
  return announcements;
};

// 获取活跃公告
export const getActiveAnnouncements = () => {
  return announcements.filter(announcement => announcement.isActive);
};

// 根据ID获取公告
export const getAnnouncementById = (id) => {
  return announcements.find(announcement => announcement.id === id);
};

// 根据发布者ID获取公告
export const getAnnouncementsByPublisher = (publisherId) => {
  return announcements.filter(announcement => announcement.publisher === publisherId);
};

// 获取最新公告
export const getLatestAnnouncements = (limit = 5) => {
  return [...announcements]
    .filter(announcement => announcement.isActive)
    .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
    .slice(0, limit);
};

// 根据重要性获取公告
export const getAnnouncementsByImportance = (importance) => {
  return announcements.filter(announcement => 
    announcement.isActive && announcement.importance === importance
  );
};

// 发布新公告
export const publishAnnouncement = (announcementData) => {
  const newAnnouncement = {
    id: announcements.length + 1,
    ...announcementData,
    publishTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    views: 0,
    isActive: true
  };
  
  announcements.push(newAnnouncement);
  return newAnnouncement;
};

// 编辑公告
export const editAnnouncement = (id, updatedData) => {
  const index = announcements.findIndex(announcement => announcement.id === id);
  if (index === -1) return false;
  
  announcements[index] = { ...announcements[index], ...updatedData };
  return announcements[index];
};

// 删除/隐藏公告
export const deleteAnnouncement = (id) => {
  const index = announcements.findIndex(announcement => announcement.id === id);
  if (index === -1) return false;
  
  // 实际上只是将公告标记为不活跃，而不是真正删除
  announcements[index].isActive = false;
  return true;
};

// 获取带有发布者信息的公告
export const getAnnouncementsWithPublisher = () => {
  return announcements.map(announcement => {
    const publisher = users.find(user => user.id === announcement.publisher);
    return {
      ...announcement,
      publisherName: publisher ? publisher.name : '未知',
      publisherRole: publisher ? publisher.role : '未知'
    };
  });
};

// 查看公告（增加浏览量）
export const viewAnnouncement = (id) => {
  const index = announcements.findIndex(announcement => announcement.id === id);
  if (index === -1) return false;
  
  announcements[index].views += 1;
  return announcements[index];
};
