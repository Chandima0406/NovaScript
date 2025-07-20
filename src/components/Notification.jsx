import React from 'react';
import { format } from 'date-fns';
import { 
  FaClipboardList, 
  FaTimes
} from 'react-icons/fa';
import '../styles/Notification.css';

const Notification = ({ notification, onMarkAsRead, onDelete, onClick }) => {
  const { _id, title, message, createdAt, isRead } = notification;

  const getTypeIcon = () => {
    // Only survey type is supported now
    return <FaClipboardList className="notification-icon survey" />;
  };
  const handleClick = () => {
    // Let the parent component handle marking as read and navigation
    onClick && onClick(notification);
  };

  return (
    <div className={`notification ${isRead ? 'read' : 'unread'}`} onClick={handleClick}>
      <div className="notification-content">
        <div className="notification-icon-wrapper">
          {getTypeIcon()}
        </div>
        <div className="notification-details">
          <h4 className="notification-title">{title}</h4>
          <p className="notification-message">{message}</p>
          <span className="notification-time">
            {format(new Date(createdAt), 'MMM d, yyyy • h:mm a')}
          </span>
        </div>
      </div>
      <button 
        className="notification-delete-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(_id);
        }}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Notification;
