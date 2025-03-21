import React from 'react';
import { Avatar, Tooltip } from 'antd';

const CommentComponent = ({ 
  author, 
  avatar, 
  content, 
  datetime, 
  actions, 
  children,
  className
}) => {
  return (
    <div className={`ant-comment ${className || ''}`}>
      <div className="ant-comment-inner">
        <div className="ant-comment-avatar">
          {avatar}
        </div>
        <div className="ant-comment-content">
          <div className="ant-comment-content-author">
            <span className="ant-comment-content-author-name">{author}</span>
            {datetime && (
              <span className="ant-comment-content-author-time">
                {datetime}
              </span>
            )}
          </div>
          <div className="ant-comment-content-detail">{content}</div>
          {actions && actions.length > 0 && (
            <ul className="ant-comment-actions">
              {actions.map((action, index) => (
                <li key={`action-${index}`}>{action}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {children && <div className="ant-comment-nested">{children}</div>}
    </div>
  );
};

export default CommentComponent;
